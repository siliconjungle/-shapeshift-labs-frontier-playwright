import {
  collectFrontierSnapshot,
  createFrontierAiEvidence,
  configureFrontierPlaywright,
  createFrontierAiSession,
  createFrontierPlaywrightRuntimeProofBuilderFields,
  createFrontierPlaywrightRuntimeProofEvidence,
  createFrontierTimelineReport,
  createFrontierPlaywrightProbe,
  decodeFrontierTimelineJsonl,
  domProbe,
  encodeFrontierTimelineJsonl,
  frontierDomDevtoolsProbe,
  frontierPlaywrightRuntimeEvidenceHash,
  frontierTimelineReportToLogRecords,
  installFrontierPlaywrightProbe,
  markFrontierTimeline,
  normalizeRuntimeProofSignals,
  queryFrontierTimeline,
  readFrontierTimeline,
  runFrontierAiStep,
  stateProbe,
  summarizeFrontierTimeline,
  waitForFrontierTimeline,
  type FrontierPlaywrightAiEvidence,
  type FrontierPlaywrightAiEvidenceOptions,
  type FrontierPlaywrightAiSession,
  type FrontierPlaywrightAiStepResult,
  type FrontierPlaywrightDomProbe,
  type FrontierPlaywrightEvidenceMatch,
  type FrontierPlaywrightInstallOptions,
  type FrontierPlaywrightLogRecord,
  type FrontierPlaywrightPageLike,
  type FrontierPlaywrightProbe,
  type FrontierPlaywrightRuntimeProofBuilderFields,
  type FrontierPlaywrightRuntimeProofEvidence,
  type FrontierPlaywrightSample,
  type FrontierPlaywrightTimelineQueryPlan,
  type FrontierPlaywrightTimelineReport,
  type FrontierPlaywrightTimelineMatch,
  type FrontierPlaywrightTimelineQuery
} from '../dist/index.js';

declare const page: FrontierPlaywrightPageLike;

const state = stateProbe('app', 'window.appState', { paths: ['/todos/0/text', ['todos', 0, 'done']] });
const dom: FrontierPlaywrightDomProbe = domProbe('todos', '[data-todo]', {
  include: ['text', 'attributes', 'value', 'checked', 'rect'],
  attributes: ['data-id']
});
const devtools = frontierDomDevtoolsProbe('dom', '__FRONTIER_DOM__', { includeStateSnapshot: true });

const options: FrontierPlaywrightInstallOptions = {
  sampleLimit: 32,
  state: [state],
  dom: [dom],
  devtools: [devtools]
};

await installFrontierPlaywrightProbe(page, options);
await configureFrontierPlaywright(page, options);
const probe: FrontierPlaywrightProbe = await createFrontierPlaywrightProbe(page, options);
const sample: FrontierPlaywrightSample = await collectFrontierSnapshot(page, { label: 'loaded' });
const mark = await markFrontierTimeline(page, 'clicked', { id: 'a' });
const timeline: FrontierPlaywrightSample[] = await readFrontierTimeline(page);
const query: FrontierPlaywrightTimelineQuery = { source: 'state', id: 'app', path: '/todos/0/done', changed: true };
const matches: FrontierPlaywrightTimelineMatch[] = queryFrontierTimeline(timeline, query);
const waited: FrontierPlaywrightTimelineMatch = await waitForFrontierTimeline(probe, { source: 'dom', id: 'todos', textIncludes: 'Done' });
const summary: Record<string, number> = summarizeFrontierTimeline(timeline);
const step: FrontierPlaywrightAiStepResult<number> = await runFrontierAiStep(probe, 'increment', () => 1, {
  waitFor: [{ source: 'state', id: 'app', path: '/todos/0/done', changed: true }],
  timeoutMs: 500,
  intervalMs: 10,
  captureErrors: true
});
const ai: FrontierPlaywrightAiSession = await createFrontierAiSession(page, {
  state: [state],
  dom: [dom],
  devtools: [devtools],
  runId: 'ai-run',
  defaultStep: { timeoutMs: 1000, sampleBefore: true }
});
const aiStep = await ai.step('click', async () => 'ok', { sampleAfter: true });
const plans: FrontierPlaywrightTimelineQueryPlan[] = [
  { id: 'done-changes', query, limit: 5 }
];
const report: FrontierPlaywrightTimelineReport = createFrontierTimelineReport(timeline, plans, {
  includeTimeline: true,
  redactKeys: ['token']
});
const aiReport = await ai.report(plans);
const evidenceOptions: FrontierPlaywrightAiEvidenceOptions = {
  includeJsonl: true,
  includeLogRecords: true,
  runId: 'ai-run',
  logContext: { actor: 'agent' }
};
const evidenceBundle: FrontierPlaywrightAiEvidence = createFrontierAiEvidence(timeline, plans, evidenceOptions);
const sessionEvidence: FrontierPlaywrightAiEvidence = await ai.evidence(plans, {
  includeLogRecords: true
});
const runtimeProofEvidence: FrontierPlaywrightRuntimeProofEvidence = createFrontierPlaywrightRuntimeProofEvidence({
  command: 'playwright test html-runtime.spec.ts',
  probeId: 'html:script-runtime-boundary',
  runtimeSignals: ['html-script-runtime'],
  report
});
const runtimeProofBuilderFields: FrontierPlaywrightRuntimeProofBuilderFields = createFrontierPlaywrightRuntimeProofBuilderFields(runtimeProofEvidence);
const runtimeSignals: readonly string[] = normalizeRuntimeProofSignals('html-script-runtime', { 'css-cascade-runtime': true });
const runtimeEvidenceHash: string = frontierPlaywrightRuntimeEvidenceHash({ report });
const jsonl: string = encodeFrontierTimelineJsonl(timeline);
const decoded: FrontierPlaywrightSample[] = decodeFrontierTimelineJsonl(jsonl);
const evidence: FrontierPlaywrightEvidenceMatch[] = report.queries[0].matches;
const records: FrontierPlaywrightLogRecord[] = frontierTimelineReportToLogRecords(report, { runId: 'ai-run' });

void sample;
void mark;
void matches;
void waited;
void summary;
void step;
void aiStep;
void aiReport;
void evidenceBundle;
void sessionEvidence;
void runtimeProofEvidence;
void runtimeProofBuilderFields;
void runtimeSignals;
void runtimeEvidenceHash;
void decoded;
void evidence;
void records;
