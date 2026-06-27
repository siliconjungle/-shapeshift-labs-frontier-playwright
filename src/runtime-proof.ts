export type FrontierPlaywrightRuntimeProofSignals =
  | string
  | readonly string[]
  | Readonly<Record<string, boolean | 'passed' | string>>;

export interface FrontierPlaywrightRuntimeProofEvidenceInput {
  readonly id?: string;
  readonly status?: 'passed' | 'failed' | 'blocked' | string;
  readonly runtimeCommand?: string;
  readonly browserCommand?: string;
  readonly command?: string;
  readonly commandId?: string;
  readonly runtimeProbeId?: string;
  readonly browserProbeId?: string;
  readonly probeId?: string;
  readonly runtimeEvidenceHash?: string;
  readonly browserEvidenceHash?: string;
  readonly evidenceHash?: string;
  readonly runtimeSignals?: FrontierPlaywrightRuntimeProofSignals;
  readonly browserSignals?: FrontierPlaywrightRuntimeProofSignals;
  readonly evidenceSignals?: FrontierPlaywrightRuntimeProofSignals;
  readonly probeSignals?: FrontierPlaywrightRuntimeProofSignals;
  readonly report?: unknown;
  readonly timeline?: unknown;
  readonly matches?: unknown;
  readonly metadata?: Readonly<Record<string, unknown>>;
}

export interface FrontierPlaywrightRuntimeProofEvidence {
  readonly kind: 'frontier.playwright.runtime-proof-evidence';
  readonly version: 1;
  readonly id?: string;
  readonly status: string;
  readonly runtimeCommand?: string;
  readonly runtimeProbeId?: string;
  readonly runtimeEvidenceHash: string;
  readonly runtimeSignals: readonly string[];
  readonly evidenceHashInputKind: 'provided' | 'computed';
  readonly runtimeEvidenceBound: boolean;
  readonly browserRuntimeEquivalenceClaim: false;
  readonly browserCascadeEquivalenceClaim: false;
  readonly browserRenderEquivalenceClaim: false;
  readonly semanticEquivalenceClaim: false;
  readonly autoMergeClaim: false;
  readonly evidence: FrontierPlaywrightRuntimeProofBuilderFields['runtimeEvidence'];
  readonly metadata?: Readonly<Record<string, unknown>>;
}

export interface FrontierPlaywrightRuntimeProofBuilderFields {
  readonly runtimeCommand?: string;
  readonly runtimeProbeId?: string;
  readonly runtimeEvidenceHash: string;
  readonly runtimeSignals: readonly string[];
  readonly runtimeEvidence: {
    readonly command?: string;
    readonly probeId?: string;
    readonly evidenceHash: string;
    readonly signals: readonly string[];
  };
  readonly runtimeEvidenceBound: boolean;
  readonly browserRuntimeEquivalenceClaim: false;
  readonly browserCascadeEquivalenceClaim: false;
  readonly browserRenderEquivalenceClaim: false;
  readonly semanticEquivalenceClaim: false;
  readonly autoMergeClaim: false;
}

export function createFrontierPlaywrightRuntimeProofEvidence(input: FrontierPlaywrightRuntimeProofEvidenceInput): FrontierPlaywrightRuntimeProofEvidence {
  const runtimeCommand = firstString(input.runtimeCommand, input.browserCommand, input.command, input.commandId);
  const runtimeProbeId = firstString(input.runtimeProbeId, input.browserProbeId, input.probeId);
  const providedHash = firstString(input.runtimeEvidenceHash, input.browserEvidenceHash, input.evidenceHash);
  const runtimeSignals = normalizeRuntimeProofSignals(input.runtimeSignals, input.browserSignals, input.evidenceSignals, input.probeSignals);
  const status = input.status ?? 'passed';
  const runtimeEvidenceHash = providedHash ?? frontierPlaywrightRuntimeEvidenceHash({
    report: input.report,
    timeline: input.timeline,
    matches: input.matches,
    metadata: input.metadata,
    runtimeCommand,
    runtimeProbeId,
    runtimeSignals
  });
  const runtimeEvidenceBound = status === 'passed' &&
    Boolean(runtimeCommand && runtimeProbeId && runtimeEvidenceHash && runtimeSignals.length);
  return compactRecord({
    kind: 'frontier.playwright.runtime-proof-evidence',
    version: 1,
    id: input.id,
    status,
    runtimeCommand,
    runtimeProbeId,
    runtimeEvidenceHash,
    runtimeSignals,
    evidenceHashInputKind: providedHash ? 'provided' : 'computed',
    runtimeEvidenceBound,
    browserRuntimeEquivalenceClaim: false,
    browserCascadeEquivalenceClaim: false,
    browserRenderEquivalenceClaim: false,
    semanticEquivalenceClaim: false,
    autoMergeClaim: false,
    evidence: compactRecord({ command: runtimeCommand, probeId: runtimeProbeId, evidenceHash: runtimeEvidenceHash, signals: runtimeSignals }),
    metadata: input.metadata
  }) as FrontierPlaywrightRuntimeProofEvidence;
}

export function createFrontierPlaywrightRuntimeProofBuilderFields(
  input: FrontierPlaywrightRuntimeProofEvidenceInput | FrontierPlaywrightRuntimeProofEvidence
): FrontierPlaywrightRuntimeProofBuilderFields {
  const evidence = 'kind' in input && input.kind === 'frontier.playwright.runtime-proof-evidence'
    ? input
    : createFrontierPlaywrightRuntimeProofEvidence(input);
  return {
    runtimeCommand: evidence.runtimeCommand,
    runtimeProbeId: evidence.runtimeProbeId,
    runtimeEvidenceHash: evidence.runtimeEvidenceHash,
    runtimeSignals: evidence.runtimeSignals,
    runtimeEvidence: evidence.evidence,
    runtimeEvidenceBound: evidence.runtimeEvidenceBound,
    browserRuntimeEquivalenceClaim: false,
    browserCascadeEquivalenceClaim: false,
    browserRenderEquivalenceClaim: false,
    semanticEquivalenceClaim: false,
    autoMergeClaim: false
  };
}

export function frontierPlaywrightRuntimeEvidenceHash(value: unknown): string {
  const text = stableJson({ kind: 'frontier.playwright.runtime-proof-evidence.hash.v1', value });
  let hash = 0x811c9dc5;
  for (let i = 0; i < text.length; i++) {
    hash ^= text.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }
  return 'fnv1a32:' + hash.toString(16).padStart(8, '0');
}

export function normalizeRuntimeProofSignals(...values: readonly (FrontierPlaywrightRuntimeProofSignals | undefined)[]): readonly string[] {
  const signals = new Set<string>();
  for (const value of values) addRuntimeProofSignals(signals, value);
  return [...signals].sort();
}

function addRuntimeProofSignals(signals: Set<string>, value: FrontierPlaywrightRuntimeProofSignals | undefined): void {
  if (typeof value === 'string' && value.trim()) signals.add(value.trim());
  else if (Array.isArray(value)) for (const item of value) addRuntimeProofSignals(signals, item);
  else if (value && typeof value === 'object') {
    for (const [key, enabled] of Object.entries(value)) if (enabled === true || enabled === 'passed') signals.add(key);
  }
}

function firstString(...values: readonly unknown[]): string | undefined {
  return values.find((value): value is string => typeof value === 'string' && value.trim().length > 0)?.trim();
}

function compactRecord<T extends Record<string, unknown>>(record: T): T {
  return Object.fromEntries(Object.entries(record).filter(([, value]) => value !== undefined)) as T;
}

function stableJson(value: unknown): string {
  if (value === undefined) return 'undefined';
  if (value === null || typeof value !== 'object') return JSON.stringify(value);
  if (Array.isArray(value)) return '[' + value.map(stableJson).join(',') + ']';
  const record = value as Record<string, unknown>;
  return '{' + Object.keys(record).sort().map((key) => JSON.stringify(key) + ':' + stableJson(record[key])).join(',') + '}';
}
