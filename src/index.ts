import {
  createFrontierPlaywrightRuntimeProofBuilderFields,
  createFrontierPlaywrightRuntimeProofEvidence,
  type FrontierPlaywrightRuntimeProofBuilderFields,
  type FrontierPlaywrightRuntimeProofEvidence,
  type FrontierPlaywrightRuntimeProofEvidenceInput,
  type FrontierPlaywrightRuntimeProofSignals
} from './runtime-proof.js';

export * from './runtime-proof.js';

export type FrontierPlaywrightJsonPrimitive = null | boolean | number | string;
export type FrontierPlaywrightJsonValue =
  | FrontierPlaywrightJsonPrimitive
  | FrontierPlaywrightJsonObject
  | FrontierPlaywrightJsonArray;

export interface FrontierPlaywrightJsonObject {
  [key: string]: FrontierPlaywrightJsonValue;
}

export interface FrontierPlaywrightJsonArray extends Array<FrontierPlaywrightJsonValue> {}

export type FrontierPlaywrightPath = string | readonly (string | number)[];
export type FrontierPlaywrightTelemetrySource = 'state' | 'dom' | 'devtools' | 'mark' | 'sample';

export interface FrontierPlaywrightPageLike {
  addInitScript?(script: { content: string } | string): Promise<unknown> | unknown;
  evaluate<T = unknown>(pageFunction: string | ((arg?: unknown) => T | Promise<T>), arg?: unknown): Promise<T>;
}

export interface FrontierPlaywrightStateProbe {
  id: string;
  expression?: string;
  globalName?: string;
  paths?: readonly FrontierPlaywrightPath[];
  maxDepth?: number;
  maxEntries?: number;
}

export interface FrontierPlaywrightDomProbe {
  id: string;
  selector: string;
  limit?: number;
  include?: readonly FrontierPlaywrightDomField[];
  attributes?: readonly string[];
  properties?: readonly string[];
}

export type FrontierPlaywrightDomField =
  | 'text'
  | 'html'
  | 'attributes'
  | 'dataset'
  | 'value'
  | 'checked'
  | 'rect';

export interface FrontierPlaywrightDevtoolsProbe {
  id: string;
  globalName?: string;
  expression?: string;
  includeStateSnapshot?: boolean;
}

export interface FrontierPlaywrightInstallOptions {
  state?: readonly FrontierPlaywrightStateProbe[];
  dom?: readonly FrontierPlaywrightDomProbe[];
  devtools?: readonly FrontierPlaywrightDevtoolsProbe[];
  sampleLimit?: number;
  defaultMaxDepth?: number;
  defaultMaxEntries?: number;
}

export interface FrontierPlaywrightSampleOptions {
  label?: string;
  state?: readonly FrontierPlaywrightStateProbe[];
  dom?: readonly FrontierPlaywrightDomProbe[];
  devtools?: readonly FrontierPlaywrightDevtoolsProbe[];
}

export interface FrontierPlaywrightStateProbeSample {
  id: string;
  value?: FrontierPlaywrightJsonValue;
  paths?: FrontierPlaywrightStatePathSample[];
  error?: string;
}

export interface FrontierPlaywrightStatePathSample {
  path: string;
  value?: FrontierPlaywrightJsonValue;
  missing?: boolean;
}

export interface FrontierPlaywrightDomProbeSample {
  id: string;
  selector: string;
  count: number;
  nodes: FrontierPlaywrightDomNodeSample[];
  error?: string;
}

export interface FrontierPlaywrightDomNodeSample {
  index: number;
  text?: string;
  html?: string;
  attributes?: Record<string, string>;
  dataset?: Record<string, string>;
  value?: FrontierPlaywrightJsonValue;
  checked?: boolean;
  rect?: FrontierPlaywrightDomRect;
  properties?: Record<string, FrontierPlaywrightJsonValue>;
}

export interface FrontierPlaywrightDomRect {
  x: number;
  y: number;
  width: number;
  height: number;
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export interface FrontierPlaywrightDevtoolsSample {
  id: string;
  globalName?: string;
  snapshot?: FrontierPlaywrightJsonValue;
  error?: string;
}

export interface FrontierPlaywrightMark {
  id: string;
  label: string;
  timestamp: number;
  data?: FrontierPlaywrightJsonValue;
}

export interface FrontierPlaywrightSample {
  kind: 'frontier.playwright.sample';
  version: 1;
  index: number;
  label?: string;
  timestamp: number;
  url?: string;
  title?: string;
  state: FrontierPlaywrightStateProbeSample[];
  dom: FrontierPlaywrightDomProbeSample[];
  devtools: FrontierPlaywrightDevtoolsSample[];
  marks: FrontierPlaywrightMark[];
}

export interface FrontierPlaywrightTimelineQuery {
  source?: FrontierPlaywrightTelemetrySource;
  id?: string;
  label?: string;
  path?: FrontierPlaywrightPath;
  selector?: string;
  textIncludes?: string;
  changed?: boolean;
  sinceIndex?: number;
  untilIndex?: number;
}

export interface FrontierPlaywrightTimelineMatch {
  sampleIndex: number;
  timestamp: number;
  label?: string;
  source: FrontierPlaywrightTelemetrySource;
  id?: string;
  path?: string;
  selector?: string;
  nodeIndex?: number;
  value?: unknown;
  previousValue?: unknown;
  changed: boolean;
  sample: FrontierPlaywrightSample;
}

export interface FrontierPlaywrightEvidenceMatch {
  sampleIndex: number;
  timestamp: number;
  label?: string;
  source: FrontierPlaywrightTelemetrySource;
  id?: string;
  path?: string;
  selector?: string;
  nodeIndex?: number;
  value?: FrontierPlaywrightJsonValue;
  previousValue?: FrontierPlaywrightJsonValue;
  changed: boolean;
}

export interface FrontierPlaywrightTimelineQueryPlan {
  id: string;
  query: FrontierPlaywrightTimelineQuery;
  description?: string;
  limit?: number;
}

export interface FrontierPlaywrightTimelineQueryReport {
  id: string;
  description?: string;
  query: FrontierPlaywrightTimelineQuery;
  count: number;
  matches: FrontierPlaywrightEvidenceMatch[];
}

export interface FrontierPlaywrightRedactionOptions {
  redactKeys?: readonly string[];
  replacement?: string;
  maxDepth?: number;
  maxEntries?: number;
}

export interface FrontierPlaywrightTimelineReportOptions extends FrontierPlaywrightRedactionOptions {
  includeTimeline?: boolean;
  maxMatchesPerQuery?: number;
}

export interface FrontierPlaywrightTimelineReport {
  kind: 'frontier.playwright.report';
  version: 1;
  generatedAt: string;
  summary: Record<string, number>;
  queries: FrontierPlaywrightTimelineQueryReport[];
  timeline?: FrontierPlaywrightSample[];
}

export interface FrontierPlaywrightSerializedError {
  name?: string;
  message: string;
  stack?: string;
}

export interface FrontierPlaywrightAiStepOptions extends FrontierPlaywrightTimelineReportOptions {
  id?: string;
  data?: FrontierPlaywrightJsonValue;
  sampleBefore?: boolean;
  sampleAfter?: boolean;
  waitFor?: FrontierPlaywrightTimelineQuery | readonly FrontierPlaywrightTimelineQuery[];
  timeoutMs?: number;
  intervalMs?: number;
  captureErrors?: boolean;
}

export interface FrontierPlaywrightAiStepResult<T = unknown> {
  kind: 'frontier.playwright.ai.step';
  version: 1;
  id: string;
  label: string;
  startedAt: string;
  endedAt: string;
  beforeIndex?: number;
  afterIndex?: number;
  value?: T;
  error?: FrontierPlaywrightSerializedError;
  matches: Record<string, FrontierPlaywrightEvidenceMatch[]>;
}

export interface FrontierPlaywrightAiSessionOptions extends FrontierPlaywrightInstallOptions {
  runId?: string;
  defaultStep?: FrontierPlaywrightAiStepOptions;
}

export interface FrontierPlaywrightAiSession extends FrontierPlaywrightProbe {
  readonly runId: string;
  step<T>(
    label: string,
    action: () => T | Promise<T>,
    options?: FrontierPlaywrightAiStepOptions
  ): Promise<FrontierPlaywrightAiStepResult<Awaited<T>>>;
  evidence(
    queries?: readonly FrontierPlaywrightTimelineQueryPlan[],
    options?: FrontierPlaywrightAiEvidenceOptions
  ): Promise<FrontierPlaywrightAiEvidence>;
  report(
    queries?: readonly FrontierPlaywrightTimelineQueryPlan[],
    options?: FrontierPlaywrightTimelineReportOptions
  ): Promise<FrontierPlaywrightTimelineReport>;
  exportJsonl(options?: FrontierPlaywrightRedactionOptions): Promise<string>;
}

export interface FrontierPlaywrightAiEvidenceOptions extends FrontierPlaywrightTimelineReportOptions {
  includeJsonl?: boolean;
  includeLogRecords?: boolean;
  logContext?: Record<string, FrontierPlaywrightJsonValue>;
  runId?: string;
}

export interface FrontierPlaywrightAiEvidence {
  kind: 'frontier.playwright.ai.evidence';
  version: 1;
  generatedAt: string;
  runId?: string;
  report: FrontierPlaywrightTimelineReport;
  jsonl?: string;
  logRecords?: FrontierPlaywrightLogRecord[];
}

export interface FrontierPlaywrightRuntimeProofRunOptions<T = unknown> extends FrontierPlaywrightAiSessionOptions {
  readonly id?: string;
  readonly command?: string;
  readonly commandId?: string;
  readonly runtimeCommand?: string;
  readonly browserCommand?: string;
  readonly probeId?: string;
  readonly runtimeProbeId?: string;
  readonly browserProbeId?: string;
  readonly runtimeSignals?: FrontierPlaywrightRuntimeProofSignals;
  readonly browserSignals?: FrontierPlaywrightRuntimeProofSignals;
  readonly evidenceSignals?: FrontierPlaywrightRuntimeProofSignals;
  readonly queries?: readonly FrontierPlaywrightTimelineQueryPlan[];
  readonly action?: (session: FrontierPlaywrightAiSession) => T | Promise<T>;
  readonly stepLabel?: string;
  readonly stepOptions?: FrontierPlaywrightAiStepOptions;
  readonly evidenceOptions?: FrontierPlaywrightAiEvidenceOptions;
  readonly status?: FrontierPlaywrightRuntimeProofEvidenceInput['status'];
  readonly runtimeEvidenceHash?: string;
  readonly browserEvidenceHash?: string;
  readonly evidenceHash?: string;
  readonly metadata?: Readonly<Record<string, unknown>>;
  readonly clearBefore?: boolean;
  readonly sampleInitial?: boolean;
}

export interface FrontierPlaywrightRuntimeProofRunResult<T = unknown> {
  readonly kind: 'frontier.playwright.runtime-proof-run';
  readonly version: 1;
  readonly id: string;
  readonly runId: string;
  readonly step?: FrontierPlaywrightAiStepResult<Awaited<T>>;
  readonly evidence: FrontierPlaywrightAiEvidence;
  readonly runtimeEvidence: FrontierPlaywrightRuntimeProofEvidence;
  readonly builderFields: FrontierPlaywrightRuntimeProofBuilderFields;
}

export interface FrontierPlaywrightSourceRuntimeProofBuilderInput extends FrontierPlaywrightRuntimeProofBuilderFields {
  readonly sourcePath?: string;
  readonly reasonCode?: string;
  readonly reasonCodes?: readonly string[];
  readonly side?: string;
  readonly sides?: readonly string[];
  readonly recordKey?: string;
  readonly recordKeys?: readonly string[];
  readonly boundary?: string;
  readonly boundaries?: readonly string[];
  readonly boundaryAttributes?: readonly string[];
  readonly attributeName?: string;
  readonly attributeNames?: readonly string[];
  readonly shapeKey?: string;
  readonly shapeKeys?: readonly string[];
  readonly base?: string;
  readonly worker?: string;
  readonly head?: string;
  readonly output?: string;
  readonly baseSourceText?: string;
  readonly workerSourceText?: string;
  readonly headSourceText?: string;
  readonly outputSourceText?: string;
}

export interface FrontierPlaywrightSourceRuntimeProofRunOptions<T = unknown> extends FrontierPlaywrightRuntimeProofRunOptions<T> {
  readonly sourcePath?: string;
  readonly reasonCode?: string;
  readonly reasonCodes?: readonly string[];
  readonly side?: string;
  readonly sides?: readonly string[];
  readonly recordKey?: string;
  readonly recordKeys?: readonly string[];
  readonly boundary?: string;
  readonly boundaries?: readonly string[];
  readonly boundaryAttributes?: readonly string[];
  readonly attributeName?: string;
  readonly attributeNames?: readonly string[];
  readonly shapeKey?: string;
  readonly shapeKeys?: readonly string[];
  readonly base?: string;
  readonly worker?: string;
  readonly head?: string;
  readonly output?: string;
  readonly baseSourceText?: string;
  readonly workerSourceText?: string;
  readonly headSourceText?: string;
  readonly outputSourceText?: string;
}

export interface FrontierPlaywrightSourceRuntimeProofRunResult<T = unknown> {
  readonly kind: 'frontier.playwright.source-runtime-proof-run';
  readonly version: 1;
  readonly id: string;
  readonly runId: string;
  readonly step?: FrontierPlaywrightAiStepResult<Awaited<T>>;
  readonly evidence: FrontierPlaywrightAiEvidence;
  readonly runtimeEvidence: FrontierPlaywrightRuntimeProofEvidence;
  readonly builderFields: FrontierPlaywrightRuntimeProofBuilderFields;
  readonly proofBuilderInput: FrontierPlaywrightSourceRuntimeProofBuilderInput;
}

export interface FrontierPlaywrightLogRecord {
  level: 'info';
  message: string;
  timestamp: number;
  attributes: Record<string, FrontierPlaywrightJsonValue>;
  payload: FrontierPlaywrightJsonValue;
}

export interface FrontierPlaywrightWaitOptions {
  timeoutMs?: number;
  intervalMs?: number;
  sampleLabel?: string;
}

export interface FrontierPlaywrightSamplingController {
  stop(): Promise<void>;
}

export interface FrontierPlaywrightStartOptions {
  intervalMs?: number;
  label?: string;
}

export interface FrontierPlaywrightProbe {
  install(options?: FrontierPlaywrightInstallOptions): Promise<void>;
  configure(options?: FrontierPlaywrightInstallOptions): Promise<void>;
  sample(labelOrOptions?: string | FrontierPlaywrightSampleOptions): Promise<FrontierPlaywrightSample>;
  mark(label: string, data?: FrontierPlaywrightJsonValue): Promise<FrontierPlaywrightMark>;
  timeline(): Promise<FrontierPlaywrightSample[]>;
  query(query: FrontierPlaywrightTimelineQuery): Promise<FrontierPlaywrightTimelineMatch[]>;
  waitFor(query: FrontierPlaywrightTimelineQuery, options?: FrontierPlaywrightWaitOptions): Promise<FrontierPlaywrightTimelineMatch>;
  clear(): Promise<void>;
  start(options?: FrontierPlaywrightStartOptions): FrontierPlaywrightSamplingController;
}

export const FRONTIER_PLAYWRIGHT_AGENT_GLOBAL = '__FRONTIER_PLAYWRIGHT__';

export const FRONTIER_PLAYWRIGHT_AGENT_SOURCE =
  '(' + installFrontierPlaywrightBrowserAgent.toString() + ')();';

export function stateProbe(
  id: string,
  expressionOrOptions: string | Omit<FrontierPlaywrightStateProbe, 'id'>,
  options: Omit<FrontierPlaywrightStateProbe, 'id' | 'expression'> = {}
): FrontierPlaywrightStateProbe {
  return typeof expressionOrOptions === 'string'
    ? { ...options, id, expression: expressionOrOptions }
    : { ...expressionOrOptions, id };
}

export function domProbe(
  id: string,
  selector: string,
  options: Omit<FrontierPlaywrightDomProbe, 'id' | 'selector'> = {}
): FrontierPlaywrightDomProbe {
  return { ...options, id, selector };
}

export function frontierDomDevtoolsProbe(
  id = 'frontier-dom',
  globalName = '__FRONTIER_DOM__',
  options: Omit<FrontierPlaywrightDevtoolsProbe, 'id' | 'globalName'> = {}
): FrontierPlaywrightDevtoolsProbe {
  return { ...options, id, globalName };
}

export async function installFrontierPlaywrightProbe(
  page: FrontierPlaywrightPageLike,
  options: FrontierPlaywrightInstallOptions = {}
): Promise<void> {
  const normalizedOptions = normalizeInstallOptions(options);
  if (typeof page.addInitScript === 'function') {
    await page.addInitScript({ content: initScriptWithOptions(normalizedOptions) });
  }
  await page.evaluate(FRONTIER_PLAYWRIGHT_AGENT_SOURCE);
  await configureFrontierPlaywright(page, normalizedOptions);
}

export async function configureFrontierPlaywright(
  page: FrontierPlaywrightPageLike,
  options: FrontierPlaywrightInstallOptions = {}
): Promise<void> {
  await page.evaluate((nextOptions) => {
    const api = (globalThis as Record<string, any>).__FRONTIER_PLAYWRIGHT__;
    if (!api || typeof api.configure !== 'function') throw new Error('Frontier Playwright agent is not installed');
    api.configure(nextOptions);
  }, normalizeInstallOptions(options));
}

export async function collectFrontierSnapshot(
  page: FrontierPlaywrightPageLike,
  options: string | FrontierPlaywrightSampleOptions = {}
): Promise<FrontierPlaywrightSample> {
  const sampleOptions = typeof options === 'string' ? { label: options } : options;
  return page.evaluate((nextOptions) => {
    const api = (globalThis as Record<string, any>).__FRONTIER_PLAYWRIGHT__;
    if (!api || typeof api.sample !== 'function') throw new Error('Frontier Playwright agent is not installed');
    return api.sample(nextOptions);
  }, sampleOptions) as Promise<FrontierPlaywrightSample>;
}

export async function readFrontierTimeline(page: FrontierPlaywrightPageLike): Promise<FrontierPlaywrightSample[]> {
  return page.evaluate(() => {
    const api = (globalThis as Record<string, any>).__FRONTIER_PLAYWRIGHT__;
    if (!api || typeof api.timeline !== 'function') throw new Error('Frontier Playwright agent is not installed');
    return api.timeline();
  }) as Promise<FrontierPlaywrightSample[]>;
}

export async function markFrontierTimeline(
  page: FrontierPlaywrightPageLike,
  label: string,
  data?: FrontierPlaywrightJsonValue
): Promise<FrontierPlaywrightMark> {
  return page.evaluate((input) => {
    const payload = input as { label: string; data?: FrontierPlaywrightJsonValue };
    const api = (globalThis as Record<string, any>).__FRONTIER_PLAYWRIGHT__;
    if (!api || typeof api.mark !== 'function') throw new Error('Frontier Playwright agent is not installed');
    return api.mark(payload.label, payload.data);
  }, { label, data }) as Promise<FrontierPlaywrightMark>;
}

export async function clearFrontierTimeline(page: FrontierPlaywrightPageLike): Promise<void> {
  await page.evaluate(() => {
    const api = (globalThis as Record<string, any>).__FRONTIER_PLAYWRIGHT__;
    if (!api || typeof api.clear !== 'function') throw new Error('Frontier Playwright agent is not installed');
    api.clear();
  });
}

export async function createFrontierPlaywrightProbe(
  page: FrontierPlaywrightPageLike,
  options: FrontierPlaywrightInstallOptions = {}
): Promise<FrontierPlaywrightProbe> {
  const probe = new FrontierPlaywrightProbeImpl(page);
  await probe.install(options);
  return probe;
}

export async function createFrontierAiSession(
  page: FrontierPlaywrightPageLike,
  options: FrontierPlaywrightAiSessionOptions = {}
): Promise<FrontierPlaywrightAiSession> {
  const { runId, defaultStep, ...installOptions } = options;
  const probe = await createFrontierPlaywrightProbe(page, installOptions);
  return new FrontierPlaywrightAiSessionImpl(probe, runId ?? createRunId(), defaultStep ?? {});
}

export async function runFrontierPlaywrightRuntimeProof<T = unknown>(
  page: FrontierPlaywrightPageLike,
  options: FrontierPlaywrightRuntimeProofRunOptions<T>
): Promise<FrontierPlaywrightRuntimeProofRunResult<T>> {
  const {
    id,
    command,
    commandId,
    runtimeCommand,
    browserCommand,
    probeId,
    runtimeProbeId,
    browserProbeId,
    runtimeSignals,
    browserSignals,
    evidenceSignals,
    queries = [],
    action,
    stepLabel = 'runtime proof',
    stepOptions,
    evidenceOptions,
    status,
    runtimeEvidenceHash,
    browserEvidenceHash,
    evidenceHash,
    metadata,
    clearBefore = true,
    sampleInitial = true,
    ...sessionOptions
  } = options;
  const session = await createFrontierAiSession(page, sessionOptions);
  if (clearBefore) await session.clear();
  let step: FrontierPlaywrightAiStepResult<Awaited<T>> | undefined;
  if (action) {
    step = await session.step(stepLabel, () => action(session), stepOptions);
  } else if (sampleInitial) {
    await session.sample({ label: stepLabel + ':sample' });
  }
  const evidence = await session.evidence(queries, {
    includeJsonl: true,
    includeLogRecords: true,
    includeTimeline: true,
    runId: session.runId,
    ...evidenceOptions
  });
  const runtimeEvidence = createFrontierPlaywrightRuntimeProofEvidence({
    id: id ?? createRuntimeProofRunId(session.runId, stepLabel),
    status: status ?? (step?.error ? 'failed' : 'passed'),
    command,
    commandId,
    runtimeCommand,
    browserCommand,
    probeId,
    runtimeProbeId,
    browserProbeId,
    runtimeEvidenceHash,
    browserEvidenceHash,
    evidenceHash,
    runtimeSignals,
    browserSignals,
    evidenceSignals,
    report: evidence.report,
    timeline: evidence.report.timeline,
    metadata: compactRuntimeProofRunMetadata({
      runId: session.runId,
      stepId: step?.id,
      stepLabel,
      ...(metadata ?? {})
    })
  });
  return {
    kind: 'frontier.playwright.runtime-proof-run',
    version: 1,
    id: runtimeEvidence.id ?? createRuntimeProofRunId(session.runId, stepLabel),
    runId: session.runId,
    step,
    evidence,
    runtimeEvidence,
    builderFields: createFrontierPlaywrightRuntimeProofBuilderFields(runtimeEvidence)
  };
}

export async function runFrontierPlaywrightSourceRuntimeProof<T = unknown>(
  page: FrontierPlaywrightPageLike,
  options: FrontierPlaywrightSourceRuntimeProofRunOptions<T>
): Promise<FrontierPlaywrightSourceRuntimeProofRunResult<T>> {
  const {
    sourcePath,
    reasonCode,
    reasonCodes,
    side,
    sides,
    recordKey,
    recordKeys,
    boundary,
    boundaries,
    boundaryAttributes,
    attributeName,
    attributeNames,
    shapeKey,
    shapeKeys,
    base,
    worker,
    head,
    output,
    baseSourceText,
    workerSourceText,
    headSourceText,
    outputSourceText,
    ...runtimeOptions
  } = options;
  const runtimeRun = await runFrontierPlaywrightRuntimeProof(page, runtimeOptions);
  const baseText = firstOptionalString(base, baseSourceText);
  const workerText = firstOptionalString(worker, workerSourceText);
  const headText = firstOptionalString(head, headSourceText);
  const outputText = firstOptionalString(output, outputSourceText);
  return {
    kind: 'frontier.playwright.source-runtime-proof-run',
    version: 1,
    id: runtimeRun.id,
    runId: runtimeRun.runId,
    step: runtimeRun.step,
    evidence: runtimeRun.evidence,
    runtimeEvidence: runtimeRun.runtimeEvidence,
    builderFields: runtimeRun.builderFields,
    proofBuilderInput: compactSourceRuntimeProofBuilderInput({
      sourcePath,
      reasonCode,
      reasonCodes,
      side,
      sides,
      recordKey,
      recordKeys,
      boundary,
      boundaries,
      boundaryAttributes,
      attributeName,
      attributeNames,
      shapeKey,
      shapeKeys,
      base: baseText,
      worker: workerText,
      head: headText,
      output: outputText,
      baseSourceText: baseSourceText ?? baseText,
      workerSourceText: workerSourceText ?? workerText,
      headSourceText: headSourceText ?? headText,
      outputSourceText: outputSourceText ?? outputText,
      ...runtimeRun.builderFields
    })
  };
}

export function queryFrontierTimeline(
  timeline: readonly FrontierPlaywrightSample[],
  query: FrontierPlaywrightTimelineQuery
): FrontierPlaywrightTimelineMatch[] {
  const matches: FrontierPlaywrightTimelineMatch[] = [];
  const previousValues = new Map<string, unknown>();
  const previousFingerprints = new Map<string, string>();
  const pathKey = query.path === undefined ? undefined : normalizePathKey(query.path);
  const since = query.sinceIndex ?? 0;
  const until = query.untilIndex ?? Number.POSITIVE_INFINITY;

  for (let i = 0; i < timeline.length; i++) {
    const sample = timeline[i];
    if (!sample || sample.index > until) continue;
    const emit = sample.index >= since;
    if (query.label !== undefined && sample.label !== query.label) continue;
    if (query.source === undefined || query.source === 'sample') {
      maybePushMatch(matches, previousValues, previousFingerprints, query, {
        sample,
        emit,
        source: 'sample',
        id: sample.label,
        value: summarizeSample(sample)
      });
    }
    if (query.source === undefined || query.source === 'state') {
      for (const state of sample.state) {
        if (query.id !== undefined && state.id !== query.id) continue;
        if (pathKey !== undefined) {
          let path: FrontierPlaywrightStatePathSample | undefined;
          const paths = state.paths;
          if (paths !== undefined) {
            for (let j = 0; j < paths.length; j++) {
              if (paths[j].path === pathKey) {
                path = paths[j];
                break;
              }
            }
          }
          if (!path) continue;
          maybePushMatch(matches, previousValues, previousFingerprints, query, {
            sample,
            emit,
            source: 'state',
            id: state.id,
            path: path.path,
            value: path.value
          });
        } else {
          maybePushMatch(matches, previousValues, previousFingerprints, query, {
            sample,
            emit,
            source: 'state',
            id: state.id,
            value: state.value
          });
        }
      }
    }
    if (query.source === undefined || query.source === 'dom') {
      for (const dom of sample.dom) {
        if (query.id !== undefined && dom.id !== query.id) continue;
        if (query.selector !== undefined && dom.selector !== query.selector) continue;
        for (const node of dom.nodes) {
          if (query.textIncludes !== undefined && !String(node.text ?? '').includes(query.textIncludes)) continue;
          maybePushMatch(matches, previousValues, previousFingerprints, query, {
            sample,
            emit,
            source: 'dom',
            id: dom.id,
            selector: dom.selector,
            nodeIndex: node.index,
            value: node
          });
        }
      }
    }
    if (query.source === undefined || query.source === 'devtools') {
      for (const devtools of sample.devtools) {
        if (query.id !== undefined && devtools.id !== query.id) continue;
        maybePushMatch(matches, previousValues, previousFingerprints, query, {
          sample,
          emit,
          source: 'devtools',
          id: devtools.id,
          value: devtools.snapshot
        });
      }
    }
    if (query.source === undefined || query.source === 'mark') {
      for (const mark of sample.marks) {
        if (query.id !== undefined && mark.id !== query.id) continue;
        if (query.label !== undefined && mark.label !== query.label) continue;
        maybePushMatch(matches, previousValues, previousFingerprints, query, {
          sample,
          emit,
          source: 'mark',
          id: mark.id,
          value: mark
        });
      }
    }
  }
  return matches;
}

export async function runFrontierAiStep<T>(
  probe: Pick<FrontierPlaywrightProbe, 'sample' | 'mark' | 'timeline' | 'query' | 'waitFor'>,
  label: string,
  action: () => T | Promise<T>,
  options: FrontierPlaywrightAiStepOptions = {}
): Promise<FrontierPlaywrightAiStepResult<Awaited<T>>> {
  const id = options.id ?? createStepId(label);
  const startedAt = new Date().toISOString();
  let beforeIndex: number | undefined;
  let afterIndex: number | undefined;
  const matches: Record<string, FrontierPlaywrightEvidenceMatch[]> = {};

  if (options.sampleBefore === false) {
    beforeIndex = lastSampleIndex(await probe.timeline());
  }
  await probe.mark('ai.step.start', { id, label, data: options.data ?? null });
  if (options.sampleBefore !== false) {
    const before = await probe.sample({ label: label + ':before' });
    beforeIndex = before.index;
  }

  try {
    const value = await action();
    const waitQueries = normalizeWaitQueries(options.waitFor, beforeIndex);
    for (let i = 0; i < waitQueries.length; i++) {
      const query = waitQueries[i];
      const match = await probe.waitFor(query, {
        timeoutMs: options.timeoutMs,
        intervalMs: options.intervalMs,
        sampleLabel: label + ':wait'
      });
      matches['waitFor.' + i] = [projectTimelineMatch(match, options)];
    }
    if (options.sampleAfter !== false) {
      const after = await probe.sample({ label: label + ':after' });
      afterIndex = after.index;
    }
    await probe.mark('ai.step.end', { id, label, ok: true });
    return {
      kind: 'frontier.playwright.ai.step',
      version: 1,
      id,
      label,
      startedAt,
      endedAt: new Date().toISOString(),
      beforeIndex,
      afterIndex,
      value: value as Awaited<T>,
      matches
    };
  } catch (error) {
    const serialized = serializeError(error);
    await probe.mark('ai.step.error', { id, label, error: sanitizeJsonValue(serialized) ?? null });
    if (options.sampleAfter !== false) {
      const after = await probe.sample({ label: label + ':error' });
      afterIndex = after.index;
    }
    const result: FrontierPlaywrightAiStepResult<Awaited<T>> = {
      kind: 'frontier.playwright.ai.step',
      version: 1,
      id,
      label,
      startedAt,
      endedAt: new Date().toISOString(),
      beforeIndex,
      afterIndex,
      error: serialized,
      matches
    };
    if (options.captureErrors === true) return result;
    throw attachStepResult(error, result);
  }
}

export function createFrontierTimelineReport(
  timeline: readonly FrontierPlaywrightSample[],
  queries: readonly FrontierPlaywrightTimelineQueryPlan[] = [],
  options: FrontierPlaywrightTimelineReportOptions = {}
): FrontierPlaywrightTimelineReport {
  const sanitizer = createRedactionContext(options);
  const reportQueries: FrontierPlaywrightTimelineQueryReport[] = new Array(queries.length);
  for (let i = 0; i < queries.length; i++) {
    const plan = queries[i];
    const rawMatches = queryFrontierTimeline(timeline, plan.query);
    const limit = Math.max(0, Math.floor(plan.limit ?? options.maxMatchesPerQuery ?? rawMatches.length));
    const matchLimit = Math.min(limit, rawMatches.length);
    const matches: FrontierPlaywrightEvidenceMatch[] = new Array(matchLimit);
    for (let j = 0; j < matchLimit; j++) {
      matches[j] = projectTimelineMatch(rawMatches[j], options, sanitizer);
    }
    reportQueries[i] = {
      id: plan.id,
      description: plan.description,
      query: plan.query,
      count: rawMatches.length,
      matches
    };
  }
  const report: FrontierPlaywrightTimelineReport = {
    kind: 'frontier.playwright.report',
    version: 1,
    generatedAt: new Date().toISOString(),
    summary: summarizeFrontierTimeline(timeline),
    queries: reportQueries
  };
  if (options.includeTimeline === true) {
    report.timeline = sanitizer.active
      ? sanitizeJsonValue(timeline, options, undefined, undefined, sanitizer) as unknown as FrontierPlaywrightSample[]
      : timeline.slice() as FrontierPlaywrightSample[];
  }
  return report;
}

export function createFrontierAiEvidence(
  timeline: readonly FrontierPlaywrightSample[],
  queries: readonly FrontierPlaywrightTimelineQueryPlan[] = [],
  options: FrontierPlaywrightAiEvidenceOptions = {}
): FrontierPlaywrightAiEvidence {
  const report = createFrontierTimelineReport(timeline, queries, options);
  const evidence: FrontierPlaywrightAiEvidence = {
    kind: 'frontier.playwright.ai.evidence',
    version: 1,
    generatedAt: report.generatedAt,
    runId: options.runId,
    report
  };
  if (options.includeJsonl === true) {
    evidence.jsonl = encodeFrontierTimelineJsonl(timeline, options);
  }
  if (options.includeLogRecords === true) {
    const context = options.runId === undefined
      ? { ...(options.logContext ?? {}) }
      : { runId: options.runId, ...(options.logContext ?? {}) };
    evidence.logRecords = frontierTimelineReportToLogRecords(report, context);
  }
  return evidence;
}

export function encodeFrontierTimelineJsonl(
  timeline: readonly FrontierPlaywrightSample[],
  options: FrontierPlaywrightRedactionOptions = {}
): string {
  const sanitizer = createRedactionContext(options);
  let out = '';
  if (!sanitizer.active) {
    for (let i = 0; i < timeline.length; i++) {
      out += JSON.stringify(timeline[i]) + '\n';
    }
    return out;
  }
  for (let i = 0; i < timeline.length; i++) {
    out += JSON.stringify(sanitizeJsonValue(timeline[i], options, undefined, undefined, sanitizer)) + '\n';
  }
  return out;
}

export function decodeFrontierTimelineJsonl(jsonl: string): FrontierPlaywrightSample[] {
  const out: FrontierPlaywrightSample[] = [];
  let start = 0;
  for (let i = 0; i <= jsonl.length; i++) {
    const code = i === jsonl.length ? 10 : jsonl.charCodeAt(i);
    if (code !== 10) continue;
    let end = i;
    if (end > start && jsonl.charCodeAt(end - 1) === 13) end--;
    if (end > start) out[out.length] = JSON.parse(jsonl.slice(start, end)) as FrontierPlaywrightSample;
    start = i + 1;
  }
  return out;
}

export function frontierTimelineReportToLogRecords(
  report: FrontierPlaywrightTimelineReport,
  context: Record<string, FrontierPlaywrightJsonValue> = {}
): FrontierPlaywrightLogRecord[] {
  return [{
    level: 'info',
    message: 'frontier.playwright.report',
    timestamp: Date.parse(report.generatedAt) || Date.now(),
    attributes: {
      ...context,
      samples: report.summary.samples ?? 0,
      state: report.summary.state ?? 0,
      dom: report.summary.dom ?? 0,
      devtools: report.summary.devtools ?? 0,
      marks: report.summary.marks ?? 0,
      queries: report.queries.length
    },
    payload: report as unknown as FrontierPlaywrightJsonValue
  }];
}

export async function waitForFrontierTimeline(
  probe: Pick<FrontierPlaywrightProbe, 'sample' | 'query'>,
  query: FrontierPlaywrightTimelineQuery,
  options: FrontierPlaywrightWaitOptions = {}
): Promise<FrontierPlaywrightTimelineMatch> {
  const timeoutMs = Math.max(0, options.timeoutMs ?? 5000);
  const intervalMs = Math.max(1, options.intervalMs ?? 50);
  const started = Date.now();
  for (;;) {
    await probe.sample(options.sampleLabel ?? 'wait');
    const matches = await probe.query(query);
    if (matches.length > 0) return matches[matches.length - 1];
    if (Date.now() - started >= timeoutMs) {
      throw new Error('Frontier Playwright wait timed out for query: ' + JSON.stringify(query));
    }
    await sleep(intervalMs);
  }
}

export function summarizeFrontierTimeline(timeline: readonly FrontierPlaywrightSample[]): Record<string, number> {
  const summary: Record<string, number> = {
    samples: timeline.length,
    state: 0,
    dom: 0,
    devtools: 0,
    marks: 0
  };
  for (const sample of timeline) {
    summary.state += sample.state.length;
    for (let i = 0; i < sample.dom.length; i++) summary.dom += sample.dom[i].nodes.length;
    summary.devtools += sample.devtools.length;
    summary.marks += sample.marks.length;
  }
  return summary;
}

class FrontierPlaywrightProbeImpl implements FrontierPlaywrightProbe {
  private active = true;

  constructor(private readonly page: FrontierPlaywrightPageLike) {}

  async install(options: FrontierPlaywrightInstallOptions = {}): Promise<void> {
    await installFrontierPlaywrightProbe(this.page, options);
  }

  async configure(options: FrontierPlaywrightInstallOptions = {}): Promise<void> {
    await configureFrontierPlaywright(this.page, options);
  }

  async sample(labelOrOptions: string | FrontierPlaywrightSampleOptions = {}): Promise<FrontierPlaywrightSample> {
    return collectFrontierSnapshot(this.page, labelOrOptions);
  }

  async mark(label: string, data?: FrontierPlaywrightJsonValue): Promise<FrontierPlaywrightMark> {
    return markFrontierTimeline(this.page, label, data);
  }

  async timeline(): Promise<FrontierPlaywrightSample[]> {
    return readFrontierTimeline(this.page);
  }

  async query(query: FrontierPlaywrightTimelineQuery): Promise<FrontierPlaywrightTimelineMatch[]> {
    return queryFrontierTimeline(await this.timeline(), query);
  }

  async waitFor(query: FrontierPlaywrightTimelineQuery, options: FrontierPlaywrightWaitOptions = {}): Promise<FrontierPlaywrightTimelineMatch> {
    return waitForFrontierTimeline(this, query, options);
  }

  async clear(): Promise<void> {
    await clearFrontierTimeline(this.page);
  }

  start(options: FrontierPlaywrightStartOptions = {}): FrontierPlaywrightSamplingController {
    const intervalMs = Math.max(1, options.intervalMs ?? 100);
    const label = options.label ?? 'interval';
    let stopped = false;
    const tick = async () => {
      if (stopped || !this.active) return;
      try {
        await this.sample(label);
      } finally {
        if (!stopped && this.active) setTimeout(tick, intervalMs);
      }
    };
    void tick();
    return {
      stop: async () => {
        stopped = true;
      }
    };
  }
}

class FrontierPlaywrightAiSessionImpl implements FrontierPlaywrightAiSession {
  constructor(
    private readonly probe: FrontierPlaywrightProbe,
    readonly runId: string,
    private readonly defaultStep: FrontierPlaywrightAiStepOptions
  ) {}

  async install(options: FrontierPlaywrightInstallOptions = {}): Promise<void> {
    await this.probe.install(options);
  }

  async configure(options: FrontierPlaywrightInstallOptions = {}): Promise<void> {
    await this.probe.configure(options);
  }

  async sample(labelOrOptions: string | FrontierPlaywrightSampleOptions = {}): Promise<FrontierPlaywrightSample> {
    return this.probe.sample(labelOrOptions);
  }

  async mark(label: string, data?: FrontierPlaywrightJsonValue): Promise<FrontierPlaywrightMark> {
    return this.probe.mark(label, data);
  }

  async timeline(): Promise<FrontierPlaywrightSample[]> {
    return this.probe.timeline();
  }

  async query(query: FrontierPlaywrightTimelineQuery): Promise<FrontierPlaywrightTimelineMatch[]> {
    return this.probe.query(query);
  }

  async waitFor(query: FrontierPlaywrightTimelineQuery, options: FrontierPlaywrightWaitOptions = {}): Promise<FrontierPlaywrightTimelineMatch> {
    return this.probe.waitFor(query, options);
  }

  async clear(): Promise<void> {
    await this.probe.clear();
  }

  start(options: FrontierPlaywrightStartOptions = {}): FrontierPlaywrightSamplingController {
    return this.probe.start(options);
  }

  async step<T>(
    label: string,
    action: () => T | Promise<T>,
    options: FrontierPlaywrightAiStepOptions = {}
  ): Promise<FrontierPlaywrightAiStepResult<Awaited<T>>> {
    return runFrontierAiStep(this.probe, label, action, {
      ...this.defaultStep,
      ...options,
      data: options.data ?? this.defaultStep.data
    });
  }

  async evidence(
    queries: readonly FrontierPlaywrightTimelineQueryPlan[] = [],
    options: FrontierPlaywrightAiEvidenceOptions = {}
  ): Promise<FrontierPlaywrightAiEvidence> {
    return createFrontierAiEvidence(await this.timeline(), queries, {
      ...options,
      runId: options.runId ?? this.runId
    });
  }

  async report(
    queries: readonly FrontierPlaywrightTimelineQueryPlan[] = [],
    options: FrontierPlaywrightTimelineReportOptions = {}
  ): Promise<FrontierPlaywrightTimelineReport> {
    return createFrontierTimelineReport(await this.timeline(), queries, options);
  }

  async exportJsonl(options: FrontierPlaywrightRedactionOptions = {}): Promise<string> {
    return encodeFrontierTimelineJsonl(await this.timeline(), options);
  }
}

function normalizeInstallOptions(options: FrontierPlaywrightInstallOptions): FrontierPlaywrightInstallOptions {
  return {
    ...options,
    sampleLimit: options.sampleLimit === undefined ? undefined : Math.max(1, Math.floor(options.sampleLimit)),
    defaultMaxDepth: options.defaultMaxDepth === undefined ? undefined : Math.max(0, Math.floor(options.defaultMaxDepth)),
    defaultMaxEntries: options.defaultMaxEntries === undefined ? undefined : Math.max(1, Math.floor(options.defaultMaxEntries)),
    state: options.state?.map((probe) => ({ ...probe, paths: probe.paths?.map(normalizePathKey) })),
    dom: options.dom?.map((probe) => ({ ...probe, include: probe.include?.slice(), attributes: probe.attributes?.slice(), properties: probe.properties?.slice() })),
    devtools: options.devtools?.map((probe) => ({ ...probe }))
  };
}

function initScriptWithOptions(options: FrontierPlaywrightInstallOptions): string {
  return FRONTIER_PLAYWRIGHT_AGENT_SOURCE +
    '\n;globalThis.__FRONTIER_PLAYWRIGHT__.configure(' +
    JSON.stringify(options) +
    ');';
}

function maybePushMatch(
  matches: FrontierPlaywrightTimelineMatch[],
  previousValues: Map<string, unknown>,
  previousFingerprints: Map<string, string>,
  query: FrontierPlaywrightTimelineQuery,
  input: {
    sample: FrontierPlaywrightSample;
    emit: boolean;
    source: FrontierPlaywrightTelemetrySource;
    id?: string;
    path?: string;
    selector?: string;
    nodeIndex?: number;
    value?: unknown;
  }
): void {
  const key = makeMatchKey(input.source, input.id, input.path, input.selector, input.nodeIndex);
  const hasPrior = previousValues.has(key);
  const prior = previousValues.get(key);
  let changed: boolean;
  if (input.value !== null && typeof input.value === 'object') {
    const fingerprint = stableJson(input.value);
    changed = hasPrior && previousFingerprints.get(key) !== fingerprint;
    previousFingerprints.set(key, fingerprint);
  } else {
    changed = hasPrior && !Object.is(prior, input.value);
    previousFingerprints.delete(key);
  }
  previousValues.set(key, input.value);
  if (!input.emit) return;
  if (query.source !== undefined && input.source !== query.source) return;
  if (query.id !== undefined && input.id !== query.id) return;
  if (query.changed === true && !changed) return;
  if (query.changed === false && changed) return;
  matches[matches.length] = {
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
  };
}

function makeMatchKey(
  source: FrontierPlaywrightTelemetrySource,
  id?: string,
  path?: string,
  selector?: string,
  nodeIndex?: number
): string {
  return source + '\0' + (id ?? '') + '\0' + (path ?? '') + '\0' + (selector ?? '') + '\0' + (nodeIndex ?? '');
}

function projectTimelineMatch(
  match: FrontierPlaywrightTimelineMatch,
  options: FrontierPlaywrightRedactionOptions = {},
  context = createRedactionContext(options)
): FrontierPlaywrightEvidenceMatch {
  return {
    sampleIndex: match.sampleIndex,
    timestamp: match.timestamp,
    label: match.label,
    source: match.source,
    id: match.id,
    path: match.path,
    selector: match.selector,
    nodeIndex: match.nodeIndex,
    value: projectJsonValue(match.value, options, context),
    previousValue: projectJsonValue(match.previousValue, options, context),
    changed: match.changed
  };
}

function projectJsonValue(
  value: unknown,
  options: FrontierPlaywrightRedactionOptions,
  context: RedactionContext
): FrontierPlaywrightJsonValue | undefined {
  return context.active
    ? sanitizeJsonValue(value, options, undefined, undefined, context)
    : value as FrontierPlaywrightJsonValue | undefined;
}

function summarizeSample(sample: FrontierPlaywrightSample): FrontierPlaywrightJsonValue {
  let dom = 0;
  for (let i = 0; i < sample.dom.length; i++) dom += sample.dom[i].nodes.length;
  return {
    state: sample.state.length,
    dom,
    devtools: sample.devtools.length,
    marks: sample.marks.length
  };
}

function normalizePathKey(path: FrontierPlaywrightPath): string {
  if (typeof path === 'string') return path.startsWith('/') ? path : '/' + path;
  return '/' + path.map((segment) => String(segment).replace(/~/g, '~0').replace(/\//g, '~1')).join('/');
}

function stableJson(value: unknown): string {
  if (value === undefined) return 'undefined';
  if (value === null || typeof value !== 'object') return JSON.stringify(value);
  if (Array.isArray(value)) return '[' + value.map(stableJson).join(',') + ']';
  const record = value as Record<string, unknown>;
  return '{' + Object.keys(record).sort().map((key) => JSON.stringify(key) + ':' + stableJson(record[key])).join(',') + '}';
}

interface RedactionContext {
  active: boolean;
  redacted: Set<string>;
  replacement: string;
  maxDepth: number;
  maxEntries: number;
}

function createRedactionContext(options: FrontierPlaywrightRedactionOptions = {}): RedactionContext {
  const redactKeys = options.redactKeys ?? [];
  const redacted = new Set<string>();
  for (let i = 0; i < redactKeys.length; i++) redacted.add(String(redactKeys[i]).toLowerCase());
  return {
    active: redacted.size > 0 || options.maxDepth !== undefined || options.maxEntries !== undefined,
    redacted,
    replacement: options.replacement ?? '[Redacted]',
    maxDepth: Math.max(0, Math.floor(options.maxDepth ?? 8)),
    maxEntries: Math.max(1, Math.floor(options.maxEntries ?? 512))
  };
}

function sanitizeJsonValue(
  value: unknown,
  options: FrontierPlaywrightRedactionOptions = {},
  depth?: number,
  seen = new WeakSet<object>(),
  context = createRedactionContext(options)
): FrontierPlaywrightJsonValue | undefined {
  const remainingDepth = depth ?? context.maxDepth;
  if (value === undefined) return undefined;
  if (value === null || typeof value === 'boolean' || typeof value === 'number' || typeof value === 'string') return value;
  if (typeof value === 'bigint') return String(value);
  if (typeof value === 'symbol' || typeof value === 'function') return String(value);
  if (typeof value !== 'object') return String(value);
  if (seen.has(value)) return '[Circular]';
  if (remainingDepth <= 0) return Array.isArray(value) ? '[Array]' : '[Object]';
  seen.add(value);
  if (Array.isArray(value)) {
    const length = Math.min(value.length, context.maxEntries);
    const out: FrontierPlaywrightJsonArray = [];
    for (let i = 0; i < length; i++) {
      const child = sanitizeJsonValue(value[i], options, remainingDepth - 1, seen, context);
      out[out.length] = child === undefined ? null : child;
    }
    if (value.length > length) out[out.length] = { truncated: value.length - length };
    seen.delete(value);
    return out;
  }
  const out: FrontierPlaywrightJsonObject = {};
  const keys = Object.keys(value as Record<string, unknown>);
  const limit = Math.min(keys.length, context.maxEntries);
  for (let i = 0; i < limit; i++) {
    const key = keys[i];
    out[key] = context.redacted.has(key.toLowerCase())
      ? context.replacement
      : sanitizeJsonValue((value as Record<string, unknown>)[key], options, remainingDepth - 1, seen, context) ?? null;
  }
  if (keys.length > limit) out.__truncated = keys.length - limit;
  seen.delete(value);
  return out;
}

function normalizeWaitQueries(
  waitFor: FrontierPlaywrightAiStepOptions['waitFor'],
  beforeIndex: number | undefined
): FrontierPlaywrightTimelineQuery[] {
  const queries = waitFor === undefined ? [] : Array.isArray(waitFor) ? waitFor : [waitFor];
  return queries.map((query) => {
    if (query.sinceIndex !== undefined || beforeIndex === undefined) return { ...query };
    return { ...query, sinceIndex: beforeIndex + 1 };
  });
}

function lastSampleIndex(timeline: readonly FrontierPlaywrightSample[]): number | undefined {
  let index: number | undefined;
  for (const sample of timeline) {
    if (sample && (index === undefined || sample.index > index)) index = sample.index;
  }
  return index;
}

let runCounter = 0;
let stepCounter = 0;

function createRunId(): string {
  runCounter += 1;
  return 'run-' + Date.now().toString(36) + '-' + runCounter.toString(36);
}

function createStepId(label: string): string {
  stepCounter += 1;
  const slug = label.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 48) || 'step';
  return 'step-' + stepCounter.toString(36) + '-' + slug;
}

function createRuntimeProofRunId(runId: string, label: string): string {
  const slug = label.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 48) || 'runtime-proof';
  return runId + '-' + slug;
}

function compactRuntimeProofRunMetadata(input: Readonly<Record<string, unknown>>): Readonly<Record<string, unknown>> | undefined {
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(input)) {
    if (value !== undefined) out[key] = value;
  }
  return Object.keys(out).length ? out : undefined;
}

function compactSourceRuntimeProofBuilderInput(input: FrontierPlaywrightSourceRuntimeProofBuilderInput): FrontierPlaywrightSourceRuntimeProofBuilderInput {
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(input)) {
    if (value !== undefined) out[key] = value;
  }
  return out as unknown as FrontierPlaywrightSourceRuntimeProofBuilderInput;
}

function firstOptionalString(...values: readonly unknown[]): string | undefined {
  return values.find((value): value is string => typeof value === 'string' && value.length > 0);
}

function serializeError(error: unknown): FrontierPlaywrightSerializedError {
  if (error instanceof Error) {
    const out: FrontierPlaywrightSerializedError = { name: error.name, message: error.message };
    if (error.stack !== undefined) out.stack = error.stack;
    return out;
  }
  return { message: String(error) };
}

function attachStepResult(error: unknown, result: FrontierPlaywrightAiStepResult): Error {
  const next = error instanceof Error ? error : new Error(String(error));
  (next as Error & { frontierStep?: FrontierPlaywrightAiStepResult }).frontierStep = result;
  return next;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function installFrontierPlaywrightBrowserAgent(): void {
  const root = globalThis as any;
  if (root.__FRONTIER_PLAYWRIGHT__?.version === 1) return;

  let config: any = {
    state: [],
    dom: [],
    devtools: [{ id: 'frontier-dom', globalName: '__FRONTIER_DOM__' }],
    sampleLimit: 256,
    defaultMaxDepth: 5,
    defaultMaxEntries: 256
  };
  const timeline: any[] = [];
  let sampleIndex = 0;
  let markIndex = 0;

  const api = {
    version: 1,
    configure(nextConfig: any = {}) {
      config = {
        ...config,
        ...nextConfig,
        state: Array.isArray(nextConfig.state) ? nextConfig.state.slice() : config.state,
        dom: Array.isArray(nextConfig.dom) ? nextConfig.dom.slice() : config.dom,
        devtools: Array.isArray(nextConfig.devtools) ? nextConfig.devtools.slice() : config.devtools,
        sampleLimit: Math.max(1, Math.floor(nextConfig.sampleLimit ?? config.sampleLimit ?? 256)),
        defaultMaxDepth: Math.max(0, Math.floor(nextConfig.defaultMaxDepth ?? config.defaultMaxDepth ?? 5)),
        defaultMaxEntries: Math.max(1, Math.floor(nextConfig.defaultMaxEntries ?? config.defaultMaxEntries ?? 256))
      };
    },
    sample(options: any = {}) {
      const sampleConfig = {
        ...config,
        state: Array.isArray(options.state) ? options.state : config.state,
        dom: Array.isArray(options.dom) ? options.dom : config.dom,
        devtools: Array.isArray(options.devtools) ? options.devtools : config.devtools
      };
      const sample = {
        kind: 'frontier.playwright.sample',
        version: 1,
        index: sampleIndex++,
        label: options.label,
        timestamp: Date.now(),
        url: typeof root.location?.href === 'string' ? root.location.href : undefined,
        title: typeof root.document?.title === 'string' ? root.document.title : undefined,
        state: sampleState(sampleConfig.state || [], sampleConfig),
        dom: sampleDom(sampleConfig.dom || [], sampleConfig),
        devtools: sampleDevtools(sampleConfig.devtools || [], sampleConfig),
        marks: []
      };
      pushSample(sample);
      return safeClone(sample, config.defaultMaxDepth + 4, config.defaultMaxEntries);
    },
    mark(label: string, data: any) {
      const mark = {
        id: 'mark-' + (++markIndex),
        label: String(label),
        timestamp: Date.now(),
        data: safeClone(data, config.defaultMaxDepth, config.defaultMaxEntries)
      };
      const sample = {
        kind: 'frontier.playwright.sample',
        version: 1,
        index: sampleIndex++,
        label: mark.label,
        timestamp: mark.timestamp,
        url: typeof root.location?.href === 'string' ? root.location.href : undefined,
        title: typeof root.document?.title === 'string' ? root.document.title : undefined,
        state: [],
        dom: [],
        devtools: [],
        marks: [mark]
      };
      pushSample(sample);
      return safeClone(mark, config.defaultMaxDepth, config.defaultMaxEntries);
    },
    timeline() {
      return safeClone(timeline, config.defaultMaxDepth + 4, config.defaultMaxEntries);
    },
    clear() {
      timeline.length = 0;
      sampleIndex = 0;
      markIndex = 0;
    }
  };

  root.__FRONTIER_PLAYWRIGHT__ = api;

  function pushSample(sample: any): void {
    timeline[timeline.length] = sample;
    const limit = Math.max(1, Math.floor(config.sampleLimit || 256));
    if (timeline.length > limit) timeline.splice(0, timeline.length - limit);
  }

  function sampleState(probes: any[], sampleConfig: any): any[] {
    const out = [];
    for (let i = 0; i < probes.length; i++) {
      const probe = probes[i];
      const entry: any = { id: String(probe.id ?? 'state:' + i) };
      try {
        const value = readStateProbe(probe);
        const maxDepth = Math.max(0, Math.floor(probe.maxDepth ?? sampleConfig.defaultMaxDepth ?? 5));
        const maxEntries = Math.max(1, Math.floor(probe.maxEntries ?? sampleConfig.defaultMaxEntries ?? 256));
        entry.value = safeClone(value, maxDepth, maxEntries);
        if (Array.isArray(probe.paths)) {
          entry.paths = new Array(probe.paths.length);
          for (let j = 0; j < probe.paths.length; j++) {
            const path = probe.paths[j];
            const normalized = normalizePath(path);
            const resolved = readPath(value, normalized);
            entry.paths[j] = resolved.missing
              ? { path: normalized, missing: true }
              : { path: normalized, value: safeClone(resolved.value, maxDepth, maxEntries) };
          }
        }
      } catch (error) {
        entry.error = errorMessage(error);
      }
      out[out.length] = entry;
    }
    return out;
  }

  function readStateProbe(probe: any): any {
    if (typeof probe.expression === 'string' && probe.expression.length > 0) {
      return Function('return (' + probe.expression + ')').call(root);
    }
    if (typeof probe.globalName === 'string' && probe.globalName.length > 0) {
      return root[probe.globalName];
    }
    return undefined;
  }

  function sampleDom(probes: any[], sampleConfig: any): any[] {
    const out = [];
    const document = root.document;
    for (let i = 0; i < probes.length; i++) {
      const probe = probes[i];
      const entry: any = {
        id: String(probe.id ?? 'dom:' + i),
        selector: String(probe.selector ?? ''),
        count: 0,
        nodes: []
      };
      try {
        const nodes = document && typeof document.querySelectorAll === 'function'
          ? document.querySelectorAll(entry.selector)
          : [];
        const nodeCount = Number(nodes.length ?? 0);
        entry.count = nodeCount;
        const limit = Math.max(0, Math.floor(probe.limit ?? nodeCount));
        const include = Array.isArray(probe.include) ? probe.include : ['text', 'attributes'];
        const includeText = include.indexOf('text') !== -1;
        const includeHtml = include.indexOf('html') !== -1;
        const includeAttributes = include.indexOf('attributes') !== -1;
        const includeDataset = include.indexOf('dataset') !== -1;
        const includeValue = include.indexOf('value') !== -1;
        const includeChecked = include.indexOf('checked') !== -1;
        const includeRect = include.indexOf('rect') !== -1;
        for (let j = 0; j < nodeCount && j < limit; j++) {
          entry.nodes[entry.nodes.length] = sampleDomNode(
            nodes[j],
            j,
            includeText,
            includeHtml,
            includeAttributes,
            includeDataset,
            includeValue,
            includeChecked,
            includeRect,
            probe,
            sampleConfig
          );
        }
      } catch (error) {
        entry.error = errorMessage(error);
      }
      out[out.length] = entry;
    }
    return out;
  }

  function sampleDomNode(
    node: any,
    index: number,
    includeText: boolean,
    includeHtml: boolean,
    includeAttributes: boolean,
    includeDataset: boolean,
    includeValue: boolean,
    includeChecked: boolean,
    includeRect: boolean,
    probe: any,
    sampleConfig: any
  ): any {
    const out: any = { index };
    if (includeText) out.text = String(node.textContent ?? '');
    if (includeHtml) out.html = String(node.innerHTML ?? '');
    if (includeAttributes) out.attributes = readAttributes(node, probe.attributes);
    if (includeDataset) out.dataset = node.dataset ? { ...node.dataset } : {};
    if (includeValue) out.value = safeClone(node.value, sampleConfig.defaultMaxDepth, sampleConfig.defaultMaxEntries);
    if (includeChecked) out.checked = Boolean(node.checked);
    if (includeRect && typeof node.getBoundingClientRect === 'function') {
      const rect = node.getBoundingClientRect();
      out.rect = {
        x: Number(rect.x ?? rect.left ?? 0),
        y: Number(rect.y ?? rect.top ?? 0),
        width: Number(rect.width ?? 0),
        height: Number(rect.height ?? 0),
        top: Number(rect.top ?? 0),
        right: Number(rect.right ?? 0),
        bottom: Number(rect.bottom ?? 0),
        left: Number(rect.left ?? 0)
      };
    }
    if (Array.isArray(probe.properties) && probe.properties.length > 0) {
      out.properties = {};
      for (const property of probe.properties) {
        out.properties[property] = safeClone(node[property], sampleConfig.defaultMaxDepth, sampleConfig.defaultMaxEntries);
      }
    }
    return out;
  }

  function readAttributes(node: any, names: any): Record<string, string> {
    const out: Record<string, string> = {};
    if (Array.isArray(names) && names.length > 0) {
      for (const name of names) {
        const value = typeof node.getAttribute === 'function' ? node.getAttribute(String(name)) : undefined;
        if (value !== null && value !== undefined) out[String(name)] = String(value);
      }
      return out;
    }
    const attrs = node.attributes;
    if (!attrs) return out;
    for (let i = 0; i < attrs.length; i++) {
      const attr = attrs[i];
      if (attr) out[String(attr.name)] = String(attr.value);
    }
    return out;
  }

  function sampleDevtools(probes: any[], sampleConfig: any): any[] {
    const out = [];
    for (let i = 0; i < probes.length; i++) {
      const probe = probes[i];
      const entry: any = { id: String(probe.id ?? 'devtools:' + i) };
      if (typeof probe.globalName === 'string') entry.globalName = probe.globalName;
      try {
        const value = readDevtoolsProbe(probe);
        entry.snapshot = safeClone(value, sampleConfig.defaultMaxDepth + 4, sampleConfig.defaultMaxEntries);
      } catch (error) {
        entry.error = errorMessage(error);
      }
      out[out.length] = entry;
    }
    return out;
  }

  function readDevtoolsProbe(probe: any): any {
    const value = typeof probe.expression === 'string' && probe.expression.length > 0
      ? Function('return (' + probe.expression + ')').call(root)
      : root[probe.globalName || '__FRONTIER_DOM__'];
    if (value && typeof value.snapshot === 'function') {
      return value.snapshot({ includeStateSnapshot: probe.includeStateSnapshot === true });
    }
    if (value && typeof value.inspect === 'function') {
      return value.inspect({ includeStateSnapshot: probe.includeStateSnapshot === true });
    }
    return value;
  }

  function normalizePath(path: any): string {
    if (typeof path === 'string') return path.startsWith('/') ? path : '/' + path;
    if (Array.isArray(path)) {
      return '/' + path.map((segment) => String(segment).replace(/~/g, '~0').replace(/\//g, '~1')).join('/');
    }
    return '/';
  }

  function readPath(value: any, path: string): { value?: any; missing?: boolean } {
    if (path === '' || path === '/') return { value };
    const segments = path.split('/').slice(1).map((segment) => segment.replace(/~1/g, '/').replace(/~0/g, '~'));
    let current = value;
    for (const segment of segments) {
      if (current === null || current === undefined || !(segment in Object(current))) return { missing: true };
      current = current[segment];
    }
    return { value: current };
  }

  function safeClone(value: any, maxDepth: number, maxEntries: number): any {
    if (value === undefined) return undefined;
    if (value === null || typeof value === 'boolean' || typeof value === 'number' || typeof value === 'string') return value;
    if (typeof value === 'bigint') return String(value);
    if (typeof value === 'symbol' || typeof value === 'function') return String(value);
    if (maxDepth <= 0) return Array.isArray(value) ? '[Array]' : '[Object]';
    if (Array.isArray(value)) {
      const length = Math.min(value.length, maxEntries);
      const out = new Array(length);
      for (let i = 0; i < length; i++) out[i] = safeClone(value[i], maxDepth - 1, maxEntries);
      if (value.length > length) out.push({ truncated: value.length - length });
      return out;
    }
    const out: Record<string, any> = {};
    const allKeys = Object.keys(value);
    const limit = Math.min(allKeys.length, maxEntries);
    for (let i = 0; i < limit; i++) {
      const key = allKeys[i];
      out[key] = safeClone(value[key], maxDepth - 1, maxEntries);
    }
    if (allKeys.length > limit) out.__truncated = allKeys.length - limit;
    return out;
  }

  function errorMessage(error: any): string {
    return error && typeof error.message === 'string' ? error.message : String(error);
  }
}
