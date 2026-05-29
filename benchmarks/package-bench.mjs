import fs from 'node:fs';
import path from 'node:path';
import { performance } from 'node:perf_hooks';
import { fileURLToPath } from 'node:url';
import {
  createFrontierAiEvidence,
  createFrontierTimelineReport,
  encodeFrontierTimelineJsonl,
  queryFrontierTimeline,
  summarizeFrontierTimeline
} from '../dist/index.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const packageDir = path.resolve(__dirname, '..');
const repoRoot = path.basename(path.dirname(packageDir)) === 'packages'
  ? path.resolve(packageDir, '..', '..')
  : packageDir;
const args = parseArgs(process.argv.slice(2));
const samples = readPositiveInt(args.samples, 1000);
const rounds = readPositiveInt(args.rounds, 40);
const outPath = args.out ? path.resolve(repoRoot, args.out) : null;

const timeline = makeTimeline(samples);
const rows = [
  measure('query-state-changes-' + samples, () => {
    return queryFrontierTimeline(timeline, { source: 'state', id: 'app', path: '/count', changed: true }).length;
  }),
  measure('query-dom-text-' + samples, () => {
    return queryFrontierTimeline(timeline, { source: 'dom', id: 'rows', textIncludes: 'selected' }).length;
  }),
  measure('summarize-timeline-' + samples, () => {
    return summarizeFrontierTimeline(timeline).samples;
  }),
  measure('create-ai-report-' + samples, () => {
    return createFrontierTimelineReport(timeline, [
      { id: 'count-changes', query: { source: 'state', id: 'app', path: '/count', changed: true }, limit: 16 },
      { id: 'selected-rows', query: { source: 'dom', id: 'rows', textIncludes: 'selected' }, limit: 16 }
    ]).queries.length;
  }),
  measure('create-ai-evidence-' + samples, () => {
    const evidence = createFrontierAiEvidence(timeline, [
      { id: 'count-changes', query: { source: 'state', id: 'app', path: '/count', changed: true }, limit: 16 },
      { id: 'selected-rows', query: { source: 'dom', id: 'rows', textIncludes: 'selected' }, limit: 16 }
    ], { includeJsonl: true, includeLogRecords: true, runId: 'bench' });
    return evidence.report.queries.length + (evidence.jsonl?.length ?? 0) + (evidence.logRecords?.length ?? 0);
  }),
  measure('encode-jsonl-' + samples, () => {
    return encodeFrontierTimelineJsonl(timeline).length;
  })
];

const report = {
  package: '@shapeshift-labs/frontier-playwright',
  version: readPackageVersion(),
  generatedAt: new Date().toISOString(),
  node: process.version,
  platform: process.platform + ' ' + process.arch,
  samples,
  rounds,
  rows
};

if (outPath) {
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify(report, null, 2) + '\n');
}

console.log(report.package + ' package benchmark');
console.log('Node ' + report.node + ' on ' + report.platform + ', samples=' + samples + ', rounds=' + rounds);
console.log('These are Frontier-only package measurements, not competitor comparisons.');
console.log('');
console.log(padRight('Fixture', 32) + padLeft('Median', 12) + padLeft('p95', 12));
for (const row of rows) {
  console.log(padRight(row.fixture, 32) + padLeft(formatUs(row.medianUs), 12) + padLeft(formatUs(row.p95Us), 12));
}
if (outPath) console.log('\nwrote ' + path.relative(repoRoot, outPath));

function measure(fixture, fn) {
  const values = [];
  let sink = 0;
  for (let round = 0; round < rounds; round++) {
    const started = performance.now();
    sink += fn();
    values[values.length] = (performance.now() - started) * 1000;
  }
  if (sink === -1) console.log('sink=' + sink);
  values.sort((left, right) => left - right);
  return {
    fixture,
    medianUs: percentile(values, 0.5),
    p95Us: percentile(values, 0.95)
  };
}

function makeTimeline(count) {
  const out = [];
  for (let i = 0; i < count; i++) {
    out[out.length] = {
      kind: 'frontier.playwright.sample',
      version: 1,
      index: i,
      label: i % 10 === 0 ? 'tick' : 'sample',
      timestamp: i,
      state: [{
        id: 'app',
        value: { count: i },
        paths: [{ path: '/count', value: i }]
      }],
      dom: [{
        id: 'rows',
        selector: '[data-row]',
        count: 2,
        nodes: [
          { index: 0, text: i % 7 === 0 ? 'selected row ' + i : 'row ' + i, attributes: { 'data-row': String(i) } },
          { index: 1, text: 'row ' + (i + 1), attributes: { 'data-row': String(i + 1) } }
        ]
      }],
      devtools: [],
      marks: i % 25 === 0 ? [{ id: 'mark-' + i, label: 'checkpoint', timestamp: i }] : []
    };
  }
  return out;
}

function percentile(values, p) {
  return values[Math.min(values.length - 1, Math.floor((values.length - 1) * p))] ?? 0;
}

function formatUs(value) {
  if (value >= 1000) return (value / 1000).toFixed(2) + ' ms';
  return value.toFixed(2) + ' us';
}

function padRight(value, width) {
  return String(value).padEnd(width, ' ');
}

function padLeft(value, width) {
  return String(value).padStart(width, ' ');
}

function readPackageVersion() {
  return JSON.parse(fs.readFileSync(path.join(packageDir, 'package.json'), 'utf8')).version;
}

function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--samples') out.samples = argv[++i];
    else if (arg === '--rounds') out.rounds = argv[++i];
    else if (arg === '--out') out.out = argv[++i];
    else if (arg === '--help' || arg === '-h') {
      console.log('Usage: npm run bench -- [--samples 1000] [--rounds 40] [--out benchmarks/results/frontier-playwright-package-bench-latest.json]');
      process.exit(0);
    }
  }
  return out;
}

function readPositiveInt(value, fallback) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : fallback;
}
