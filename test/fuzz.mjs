import assert from 'node:assert';
import {
  createFrontierAiEvidence,
  createFrontierTimelineReport,
  decodeFrontierTimelineJsonl,
  encodeFrontierTimelineJsonl,
  queryFrontierTimeline
} from '../dist/index.js';

const args = parseArgs(process.argv.slice(2));
const cases = readPositiveInt(args.cases, 300);
let seed = readPositiveInt(args.seed, 0x5eed);

for (let i = 0; i < cases; i++) {
  const timeline = makeTimeline(randInt(1, 40));
  const query = makeQuery(timeline);
  const actual = queryFrontierTimeline(timeline, query).map(projectMatch);
  const expected = referenceQuery(timeline, query).map(projectMatch);
  assert.deepStrictEqual(actual, expected, 'query mismatch for ' + JSON.stringify({ seed, query }));
  const report = createFrontierTimelineReport(timeline, [{ id: 'q', query, limit: 3 }], {
    includeTimeline: chance(0.5),
    redactKeys: ['token', 'secret'],
    maxDepth: 6,
    maxEntries: 32
  });
  assert.strictEqual(report.queries[0].count, actual.length);
  assert.ok(report.queries[0].matches.length <= 3);
  const evidence = createFrontierAiEvidence(timeline, [{ id: 'q', query, limit: 2 }], {
    includeJsonl: chance(0.5),
    includeLogRecords: true,
    runId: 'fuzz',
    redactKeys: ['token', 'secret'],
    maxDepth: 6,
    maxEntries: 32
  });
  assert.strictEqual(evidence.report.queries[0].count, actual.length);
  assert.strictEqual(evidence.logRecords[0].attributes.runId, 'fuzz');
  const roundTrip = decodeFrontierTimelineJsonl(encodeFrontierTimelineJsonl(timeline));
  assert.strictEqual(roundTrip.length, timeline.length);
}

console.log(`frontier playwright fuzz passed: cases=${cases}`);

function makeTimeline(count) {
  const timeline = [];
  let countValue = randInt(0, 3);
  let doneValue = false;
  for (let i = 0; i < count; i++) {
    if (chance(0.35)) countValue += randInt(0, 2);
    if (chance(0.25)) doneValue = !doneValue;
    const selected = chance(0.2);
    timeline.push({
      kind: 'frontier.playwright.sample',
      version: 1,
      index: i,
      label: i % 5 === 0 ? 'tick' : 'sample',
      timestamp: i,
      state: [{
        id: 'app',
        value: { count: countValue, todo: { id: 'a', done: doneValue } },
        paths: [
          { path: '/count', value: countValue },
          { path: '/todo/done', value: doneValue }
        ]
      }],
      dom: [{
        id: 'rows',
        selector: '[data-row]',
        count: 1,
        nodes: [{
          index: 0,
          text: selected ? 'selected row ' + i : 'row ' + i,
          attributes: { 'data-row': String(i), 'data-selected': selected ? 'true' : 'false' }
        }]
      }],
      devtools: [{
        id: 'dom',
        globalName: '__FRONTIER_DOM__',
        snapshot: { summary: { patchCount: countValue + i } }
      }],
      marks: i % 11 === 0 ? [{ id: 'mark-' + i, label: 'checkpoint', timestamp: i }] : []
    });
  }
  return timeline;
}

function makeQuery(timeline) {
  const source = pick([undefined, 'sample', 'state', 'dom', 'devtools', 'mark']);
  const query = {
    source,
    changed: pick([undefined, true, false]),
    sinceIndex: chance(0.5) ? randInt(0, timeline.length - 1) : undefined,
    untilIndex: chance(0.3) ? randInt(0, timeline.length - 1) : undefined
  };
  if (query.untilIndex !== undefined && query.sinceIndex !== undefined && query.untilIndex < query.sinceIndex) {
    const tmp = query.untilIndex;
    query.untilIndex = query.sinceIndex;
    query.sinceIndex = tmp;
  }
  if (source === 'state') {
    query.id = chance(0.85) ? 'app' : 'missing';
    query.path = pick([undefined, '/count', '/todo/done', ['todo', 'done'], '/missing']);
  } else if (source === 'dom') {
    query.id = chance(0.85) ? 'rows' : 'missing';
    query.selector = chance(0.8) ? '[data-row]' : '.missing';
    query.textIncludes = pick([undefined, 'selected', 'row', 'absent']);
  } else if (source === 'devtools') {
    query.id = chance(0.85) ? 'dom' : 'missing';
  } else if (source === 'mark') {
    query.label = pick([undefined, 'checkpoint', 'missing']);
  } else if (source === 'sample') {
    query.label = pick([undefined, 'tick', 'sample', 'missing']);
  }
  for (const key of Object.keys(query)) if (query[key] === undefined) delete query[key];
  return query;
}

function referenceQuery(timeline, query) {
  const matches = [];
  const previous = new Map();
  const pathKey = query.path === undefined ? undefined : normalizePathKey(query.path);
  const since = query.sinceIndex ?? 0;
  const until = query.untilIndex ?? Number.POSITIVE_INFINITY;
  for (const sample of timeline) {
    if (!sample || sample.index > until) continue;
    const emit = sample.index >= since;
    if (query.label !== undefined && sample.label !== query.label) continue;
    if (query.source === undefined || query.source === 'sample') {
      referencePush(matches, previous, query, { sample, emit, source: 'sample', id: sample.label, value: summarize(sample) });
    }
    if (query.source === undefined || query.source === 'state') {
      for (const state of sample.state) {
        if (query.id !== undefined && state.id !== query.id) continue;
        if (pathKey !== undefined) {
          const path = state.paths?.find((entry) => entry.path === pathKey);
          if (path) referencePush(matches, previous, query, { sample, emit, source: 'state', id: state.id, path: path.path, value: path.value });
        } else {
          referencePush(matches, previous, query, { sample, emit, source: 'state', id: state.id, value: state.value });
        }
      }
    }
    if (query.source === undefined || query.source === 'dom') {
      for (const dom of sample.dom) {
        if (query.id !== undefined && dom.id !== query.id) continue;
        if (query.selector !== undefined && dom.selector !== query.selector) continue;
        for (const node of dom.nodes) {
          if (query.textIncludes !== undefined && !String(node.text ?? '').includes(query.textIncludes)) continue;
          referencePush(matches, previous, query, { sample, emit, source: 'dom', id: dom.id, selector: dom.selector, nodeIndex: node.index, value: node });
        }
      }
    }
    if (query.source === undefined || query.source === 'devtools') {
      for (const devtools of sample.devtools) {
        if (query.id !== undefined && devtools.id !== query.id) continue;
        referencePush(matches, previous, query, { sample, emit, source: 'devtools', id: devtools.id, value: devtools.snapshot });
      }
    }
    if (query.source === undefined || query.source === 'mark') {
      for (const mark of sample.marks) {
        if (query.id !== undefined && mark.id !== query.id) continue;
        if (query.label !== undefined && mark.label !== query.label) continue;
        referencePush(matches, previous, query, { sample, emit, source: 'mark', id: mark.id, value: mark });
      }
    }
  }
  return matches;
}

function referencePush(matches, previous, query, input) {
  const key = [input.source, input.id ?? '', input.path ?? '', input.selector ?? '', input.nodeIndex ?? ''].join('\0');
  const hasPrior = previous.has(key);
  const prior = previous.get(key);
  const changed = hasPrior && stableJson(prior) !== stableJson(input.value);
  previous.set(key, input.value);
  if (!input.emit) return;
  if (query.changed === true && !changed) return;
  if (query.changed === false && changed) return;
  matches.push({
    sampleIndex: input.sample.index,
    timestamp: input.sample.timestamp,
    label: input.sample.label,
    source: input.source,
    id: input.id,
    path: input.path,
    selector: input.selector,
    nodeIndex: input.nodeIndex,
    value: input.value,
    previousValue: prior,
    changed,
    sample: input.sample
  });
}

function projectMatch(match) {
  return {
    sampleIndex: match.sampleIndex,
    source: match.source,
    id: match.id,
    path: match.path,
    selector: match.selector,
    nodeIndex: match.nodeIndex,
    value: match.value,
    previousValue: match.previousValue,
    changed: match.changed
  };
}

function summarize(sample) {
  return {
    state: sample.state.length,
    dom: sample.dom.reduce((sum, probe) => sum + probe.nodes.length, 0),
    devtools: sample.devtools.length,
    marks: sample.marks.length
  };
}

function normalizePathKey(path) {
  if (typeof path === 'string') return path.startsWith('/') ? path : '/' + path;
  return '/' + path.map((segment) => String(segment).replace(/~/g, '~0').replace(/\//g, '~1')).join('/');
}

function stableJson(value) {
  if (value === undefined) return 'undefined';
  if (value === null || typeof value !== 'object') return JSON.stringify(value);
  if (Array.isArray(value)) return '[' + value.map(stableJson).join(',') + ']';
  return '{' + Object.keys(value).sort().map((key) => JSON.stringify(key) + ':' + stableJson(value[key])).join(',') + '}';
}

function rand() {
  seed = (seed * 1664525 + 1013904223) >>> 0;
  return seed / 0x100000000;
}

function randInt(min, max) {
  if (max < min) return min;
  return min + Math.floor(rand() * (max - min + 1));
}

function chance(probability) {
  return rand() < probability;
}

function pick(values) {
  return values[randInt(0, values.length - 1)];
}

function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--cases') out.cases = argv[++i];
    else if (arg === '--seed') out.seed = argv[++i];
  }
  return out;
}

function readPositiveInt(value, fallback) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : fallback;
}
