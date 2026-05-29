import assert from 'node:assert';
import vm from 'node:vm';
import {
  collectFrontierSnapshot,
  createFrontierAiSession,
  createFrontierAiEvidence,
  createFrontierTimelineReport,
  createFrontierPlaywrightProbe,
  decodeFrontierTimelineJsonl,
  domProbe,
  encodeFrontierTimelineJsonl,
  frontierTimelineReportToLogRecords,
  frontierDomDevtoolsProbe,
  queryFrontierTimeline,
  runFrontierAiStep,
  stateProbe,
  summarizeFrontierTimeline
} from '../dist/index.js';

class FakePage {
  constructor() {
    const button = fakeNode({
      textContent: 'Save',
      attributes: { 'data-action': 'save', role: 'button' },
      dataset: { action: 'save' },
      rect: { x: 1, y: 2, width: 80, height: 24, top: 2, right: 81, bottom: 26, left: 1 }
    });
    this.nodes = { button };
    this.context = vm.createContext({
      window: null,
      location: { href: 'http://example.test/app' },
      document: {
        title: 'Frontier Test',
        querySelectorAll: (selector) => selector === 'button[data-action]' ? [button] : []
      },
      appState: {
        count: 0,
        todos: [{ id: 'a', text: 'Alpha', done: false }]
      },
      __FRONTIER_DOM__: {
        snapshot: () => ({
          kind: 'frontier.dom.devtools',
          version: 1,
          source: { snapshot: { count: this.context.appState.count } },
          summary: { patchCount: this.context.appState.count }
        })
      },
      setTimeout,
      Date,
      Array,
      Object,
      String,
      Number,
      Boolean
    });
    this.context.window = this.context;
    this.initScripts = [];
  }

  async addInitScript(script) {
    this.initScripts.push(script);
  }

  async evaluate(pageFunction, arg) {
    this.context.__frontierArg = arg;
    if (typeof pageFunction === 'string') return vm.runInContext(pageFunction, this.context);
    return vm.runInContext('(' + pageFunction.toString() + ')(__frontierArg)', this.context);
  }
}

const page = new FakePage();
const probe = await createFrontierPlaywrightProbe(page, {
  sampleLimit: 8,
  state: [
    stateProbe('app', 'window.appState', { paths: ['/count', ['todos', 0, 'text']] })
  ],
  dom: [
    domProbe('actions', 'button[data-action]', {
      include: ['text', 'attributes', 'dataset', 'rect'],
      attributes: ['data-action', 'role']
    })
  ],
  devtools: [
    frontierDomDevtoolsProbe('dom', '__FRONTIER_DOM__', { includeStateSnapshot: true })
  ]
});

assert.strictEqual(page.initScripts.length, 1);
assert.ok(page.initScripts[0].content.includes('__FRONTIER_PLAYWRIGHT__.configure'));
assert.ok(page.initScripts[0].content.includes('"sampleLimit":8'));

const initial = await collectFrontierSnapshot(page, 'initial');
assert.strictEqual(initial.label, 'initial');
assert.strictEqual(initial.state[0].paths[0].value, 0);
assert.strictEqual(initial.dom[0].nodes[0].text, 'Save');
assert.strictEqual(initial.devtools[0].snapshot.summary.patchCount, 0);

page.context.appState.count = 1;
page.context.appState.todos[0].text = 'Beta';
page.nodes.button.textContent = 'Saved';
await probe.sample('after-click');
await probe.mark('assertion', { ok: true });

const timeline = await probe.timeline();
assert.strictEqual(timeline.length, 3);
assert.deepStrictEqual(summarizeFrontierTimeline(timeline), {
  samples: 3,
  state: 2,
  dom: 2,
  devtools: 2,
  marks: 1
});

const changedCount = queryFrontierTimeline(timeline, {
  source: 'state',
  id: 'app',
  path: '/count',
  changed: true
});
assert.strictEqual(changedCount.length, 1);
assert.strictEqual(changedCount[0].value, 1);
assert.strictEqual(changedCount[0].previousValue, 0);

const savedButton = await probe.query({ source: 'dom', id: 'actions', textIncludes: 'Saved' });
assert.strictEqual(savedButton.length, 1);
assert.strictEqual(savedButton[0].value.attributes['data-action'], 'save');

const mark = await probe.query({ source: 'mark', label: 'assertion' });
assert.strictEqual(mark.length, 1);
assert.strictEqual(mark[0].value.data.ok, true);

setTimeout(() => {
  page.context.appState.count = 2;
}, 5);
const sinceIndex = (await probe.timeline()).length;
const waited = await probe.waitFor({ source: 'state', id: 'app', path: '/count', changed: true, sinceIndex }, {
  timeoutMs: 500,
  intervalMs: 5,
  sampleLabel: 'poll'
});
assert.strictEqual(waited.value, 2);

const stepResult = await runFrontierAiStep(probe, 'toggle from helper', () => {
  page.context.appState.count = 3;
}, {
  waitFor: { source: 'state', id: 'app', path: '/count', changed: true },
  timeoutMs: 500,
  intervalMs: 5
});
assert.strictEqual(stepResult.error, undefined);
assert.strictEqual(stepResult.matches['waitFor.0'][0].value, 3);

const ai = await createFrontierAiSession(page, {
  sampleLimit: 8,
  state: [stateProbe('app', 'window.appState', { paths: ['/count'] })],
  dom: [domProbe('actions', 'button[data-action]', { include: ['text'] })],
  runId: 'run-test'
});
const aiStep = await ai.step('save via ai', () => {
  page.context.appState.count = 4;
}, {
  waitFor: { source: 'state', id: 'app', path: '/count', changed: true },
  timeoutMs: 500,
  intervalMs: 5
});
assert.strictEqual(ai.runId, 'run-test');
assert.strictEqual(aiStep.matches['waitFor.0'][0].value, 4);

const report = await ai.report([
  { id: 'count-changes', query: { source: 'state', id: 'app', path: '/count', changed: true }, limit: 4 },
  { id: 'saved-dom', query: { source: 'dom', id: 'actions', textIncludes: 'Saved' }, limit: 2 }
], { includeTimeline: true, redactKeys: ['secret'] });
assert.strictEqual(report.kind, 'frontier.playwright.report');
assert.ok(report.summary.samples > 0);
assert.ok(report.queries[0].count >= 1);
assert.ok(report.timeline.length > 0);

const jsonl = encodeFrontierTimelineJsonl(await ai.timeline());
assert.ok(jsonl.includes('frontier.playwright.sample'));
assert.strictEqual(decodeFrontierTimelineJsonl(jsonl).length, (await ai.timeline()).length);

const records = frontierTimelineReportToLogRecords(report, { runId: ai.runId });
assert.strictEqual(records[0].message, 'frontier.playwright.report');
assert.strictEqual(records[0].attributes.runId, 'run-test');

const evidence = await ai.evidence([
  { id: 'count-changes', query: { source: 'state', id: 'app', path: '/count', changed: true }, limit: 2 }
], { includeJsonl: true, includeLogRecords: true });
assert.strictEqual(evidence.kind, 'frontier.playwright.ai.evidence');
assert.strictEqual(evidence.runId, 'run-test');
assert.ok(evidence.jsonl.includes('frontier.playwright.sample'));
assert.strictEqual(evidence.logRecords[0].attributes.runId, 'run-test');

const standaloneEvidence = createFrontierAiEvidence(await ai.timeline(), [
  { id: 'dom', query: { source: 'dom', id: 'actions' }, limit: 1 }
], { includeLogRecords: true, runId: 'standalone-run' });
assert.strictEqual(standaloneEvidence.logRecords[0].attributes.runId, 'standalone-run');

const standaloneReport = createFrontierTimelineReport(await ai.timeline(), [
  { id: 'dom', query: { source: 'dom', id: 'actions' }, limit: 1 }
]);
assert.strictEqual(standaloneReport.queries[0].matches.length, 1);

await probe.clear();
assert.strictEqual((await probe.timeline()).length, 0);

console.log('frontier playwright smoke passed');

function fakeNode(input) {
  const attrs = Object.entries(input.attributes ?? {}).map(([name, value]) => ({ name, value: String(value) }));
  return {
    textContent: input.textContent ?? '',
    innerHTML: input.innerHTML ?? '',
    dataset: input.dataset ?? {},
    attributes: attrs,
    value: input.value,
    checked: input.checked,
    getAttribute(name) {
      const attr = attrs.find((entry) => entry.name === name);
      return attr ? attr.value : null;
    },
    getBoundingClientRect() {
      return input.rect ?? { x: 0, y: 0, width: 0, height: 0, top: 0, right: 0, bottom: 0, left: 0 };
    }
  };
}
