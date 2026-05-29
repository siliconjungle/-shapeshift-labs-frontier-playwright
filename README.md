# @shapeshift-labs/frontier-playwright

Playwright and headless-browser telemetry helpers for Frontier state, DOM, and devtools timelines.

This package is intentionally separate from `@shapeshift-labs/frontier-dom`: Playwright is a Node/headless automation concern, while DOM rendering and browser devtools should stay runtime-light. The package talks to Playwright through a structural `Page` interface and installs a small browser-side probe that can sample arbitrary state expressions, DOM selectors, and Frontier DOM devtools globals over time.

- npm: [`@shapeshift-labs/frontier-playwright`](https://www.npmjs.com/package/@shapeshift-labs/frontier-playwright)
- source: [`siliconjungle/-shapeshift-labs-frontier-playwright`](https://github.com/siliconjungle/-shapeshift-labs-frontier-playwright)
- license: MIT

## Related Packages

The published Frontier package family is generated from one shared package catalog so READMEs stay in sync across packages:

- [`@shapeshift-labs/frontier`](https://www.npmjs.com/package/@shapeshift-labs/frontier): Core JSON diff/apply, compact patch tuples, JSON Pointer, equality, clone, validation, Unicode helpers, and tiny dependency-free runtime budget/scheduler primitives.
- [`@shapeshift-labs/frontier-query`](https://www.npmjs.com/package/@shapeshift-labs/frontier-query): Shared query-key, selector path, condition, entity identity, and table-shape primitives.
- [`@shapeshift-labs/frontier-codec`](https://www.npmjs.com/package/@shapeshift-labs/frontier-codec): Patch serialization, binary frames, canonical JSON, and patch-history codecs.
- [`@shapeshift-labs/frontier-engine`](https://www.npmjs.com/package/@shapeshift-labs/frontier-engine): Stateful planned diff engine, adaptive profiles, schema plans, and engine-level history helpers.
- [`@shapeshift-labs/frontier-state`](https://www.npmjs.com/package/@shapeshift-labs/frontier-state): Patch-routed app-state subscriptions, owned commits, maintained views, and path mapping.
- [`@shapeshift-labs/frontier-state-cache`](https://www.npmjs.com/package/@shapeshift-labs/frontier-state-cache): Normalized query-result cache with entity/query watchers, persistence, change logs, optimistic layers, scheduled persistence, and mutation bridge.
- [`@shapeshift-labs/frontier-state-cache-idb`](https://www.npmjs.com/package/@shapeshift-labs/frontier-state-cache-idb): IndexedDB persistence adapter for Frontier state-cache snapshots and durable change logs.
- [`@shapeshift-labs/frontier-state-cache-file`](https://www.npmjs.com/package/@shapeshift-labs/frontier-state-cache-file): Structured file persistence adapter for Frontier state-cache snapshots and change logs.
- [`@shapeshift-labs/frontier-state-cache-sql`](https://www.npmjs.com/package/@shapeshift-labs/frontier-state-cache-sql): SQL persistence adapter for Frontier state-cache snapshots and change logs.
- [`@shapeshift-labs/frontier-schema`](https://www.npmjs.com/package/@shapeshift-labs/frontier-schema): JSON Schema validation, Frontier profile generation, CloudEvent envelopes, and query/table schema helpers.
- [`@shapeshift-labs/frontier-event-log`](https://www.npmjs.com/package/@shapeshift-labs/frontier-event-log): Bounded event logs, replay cursors, consumer acknowledgements, keyed compaction, checkpoints, and Frontier patch event records.
- [`@shapeshift-labs/frontier-scheduler`](https://www.npmjs.com/package/@shapeshift-labs/frontier-scheduler): Deterministic work scheduling, lanes, cancellation, backpressure, frame policies, replay snapshots, and work graphs.
- [`@shapeshift-labs/frontier-logging`](https://www.npmjs.com/package/@shapeshift-labs/frontier-logging): Opt-in structured logging, browser telemetry, scheduled sinks, file sinks, exporters, benchmark traces, and Frontier patch/update summaries.
- [`@shapeshift-labs/frontier-mutation`](https://www.npmjs.com/package/@shapeshift-labs/frontier-mutation): Explicit mutation and selector plans compiled to Frontier patches or CRDT operations.
- [`@shapeshift-labs/frontier-virtual`](https://www.npmjs.com/package/@shapeshift-labs/frontier-virtual): DOM-neutral virtualization, layout providers, range materialization, grids, spatial/frustum indexes, patch invalidation, camera anchors, and serializable layout state.
- [`@shapeshift-labs/frontier-scene`](https://www.npmjs.com/package/@shapeshift-labs/frontier-scene): Patch-native 2D/3D scene graph, transform propagation, bounds queries, virtual/culling adapters, spatial invalidation, and camera/frustum materialization.
- [`@shapeshift-labs/frontier-pathfinding`](https://www.npmjs.com/package/@shapeshift-labs/frontier-pathfinding): Patch-native grid pathfinding, typed-array A*/Dijkstra search, flow fields, connected components, line-of-sight smoothing, dirty-cell invalidation, and scheduler-friendly path jobs.
- [`@shapeshift-labs/frontier-dom`](https://www.npmjs.com/package/@shapeshift-labs/frontier-dom): Patch-native DOM and host renderer bindings, manifest hydration, JSX runtime/compiler helpers, SSR, devtools, and logging bridges.
- [`@shapeshift-labs/frontier-crdt`](https://www.npmjs.com/package/@shapeshift-labs/frontier-crdt): Native CRDT documents, update tooling, awareness, branches, conflict introspection, version frames, and undo.
- [`@shapeshift-labs/frontier-crdt-sync`](https://www.npmjs.com/package/@shapeshift-labs/frontier-crdt-sync): CRDT sync endpoints, repo/storage/provider contracts, scheduled sync work, document URLs, local networks, model checking, forensics, and text binding contracts.
- [`@shapeshift-labs/frontier-crdt-websocket`](https://www.npmjs.com/package/@shapeshift-labs/frontier-crdt-websocket): WebSocket client/server transports for Frontier CRDT sync providers.
- [`@shapeshift-labs/frontier-react`](https://www.npmjs.com/package/@shapeshift-labs/frontier-react): React external-store hooks and adapters for Frontier state, cache, and CRDT surfaces.
- [`@shapeshift-labs/frontier-richtext`](https://www.npmjs.com/package/@shapeshift-labs/frontier-richtext): Rich text Delta normalization/application, marks, embeds, ranges, and cursor/selection transforms for local editor integrations.
- [`@shapeshift-labs/frontier-realtime`](https://www.npmjs.com/package/@shapeshift-labs/frontier-realtime): Shared realtime command, tick, snapshot, prediction, reconciliation, interpolation, rollback, message, and delta primitives.
- [`@shapeshift-labs/frontier-realtime-server`](https://www.npmjs.com/package/@shapeshift-labs/frontier-realtime-server): Authoritative realtime room, tick, command validation, rate-limit, session, and snapshot-history runtime.
- [`@shapeshift-labs/frontier-realtime-websocket`](https://www.npmjs.com/package/@shapeshift-labs/frontier-realtime-websocket): WebSocket client, wire, and Node room-server transport for Frontier realtime.
- [`@shapeshift-labs/frontier-game`](https://www.npmjs.com/package/@shapeshift-labs/frontier-game): Game-facing entity, component, player, room, ownership, spatial interest, rollback, physics, and replication helpers above realtime.

Package source repositories:

- [`siliconjungle/-shapeshift-labs-frontier`](https://github.com/siliconjungle/-shapeshift-labs-frontier)
- [`siliconjungle/-shapeshift-labs-frontier-query`](https://github.com/siliconjungle/-shapeshift-labs-frontier-query)
- [`siliconjungle/-shapeshift-labs-frontier-codec`](https://github.com/siliconjungle/-shapeshift-labs-frontier-codec)
- [`siliconjungle/-shapeshift-labs-frontier-engine`](https://github.com/siliconjungle/-shapeshift-labs-frontier-engine)
- [`siliconjungle/-shapeshift-labs-frontier-state`](https://github.com/siliconjungle/-shapeshift-labs-frontier-state)
- [`siliconjungle/-shapeshift-labs-frontier-state-cache`](https://github.com/siliconjungle/-shapeshift-labs-frontier-state-cache)
- [`siliconjungle/-shapeshift-labs-frontier-state-cache-idb`](https://github.com/siliconjungle/-shapeshift-labs-frontier-state-cache-idb)
- [`siliconjungle/-shapeshift-labs-frontier-state-cache-file`](https://github.com/siliconjungle/-shapeshift-labs-frontier-state-cache-file)
- [`siliconjungle/-shapeshift-labs-frontier-state-cache-sql`](https://github.com/siliconjungle/-shapeshift-labs-frontier-state-cache-sql)
- [`siliconjungle/-shapeshift-labs-frontier-schema`](https://github.com/siliconjungle/-shapeshift-labs-frontier-schema)
- [`siliconjungle/-shapeshift-labs-frontier-event-log`](https://github.com/siliconjungle/-shapeshift-labs-frontier-event-log)
- [`siliconjungle/-shapeshift-labs-frontier-scheduler`](https://github.com/siliconjungle/-shapeshift-labs-frontier-scheduler)
- [`siliconjungle/-shapeshift-labs-frontier-logging`](https://github.com/siliconjungle/-shapeshift-labs-frontier-logging)
- [`siliconjungle/-shapeshift-labs-frontier-mutation`](https://github.com/siliconjungle/-shapeshift-labs-frontier-mutation)
- [`siliconjungle/-shapeshift-labs-frontier-virtual`](https://github.com/siliconjungle/-shapeshift-labs-frontier-virtual)
- [`siliconjungle/-shapeshift-labs-frontier-scene`](https://github.com/siliconjungle/-shapeshift-labs-frontier-scene)
- [`siliconjungle/-shapeshift-labs-frontier-pathfinding`](https://github.com/siliconjungle/-shapeshift-labs-frontier-pathfinding)
- [`siliconjungle/-shapeshift-labs-frontier-dom`](https://github.com/siliconjungle/-shapeshift-labs-frontier-dom)
- [`siliconjungle/-shapeshift-labs-frontier-playwright`](https://github.com/siliconjungle/-shapeshift-labs-frontier-playwright)
- [`siliconjungle/-shapeshift-labs-frontier-crdt`](https://github.com/siliconjungle/-shapeshift-labs-frontier-crdt)
- [`siliconjungle/-shapeshift-labs-frontier-crdt-sync`](https://github.com/siliconjungle/-shapeshift-labs-frontier-crdt-sync)
- [`siliconjungle/-shapeshift-labs-frontier-crdt-websocket`](https://github.com/siliconjungle/-shapeshift-labs-frontier-crdt-websocket)
- [`siliconjungle/-shapeshift-labs-frontier-react`](https://github.com/siliconjungle/-shapeshift-labs-frontier-react)
- [`siliconjungle/-shapeshift-labs-frontier-richtext`](https://github.com/siliconjungle/-shapeshift-labs-frontier-richtext)
- [`siliconjungle/-shapeshift-labs-frontier-realtime`](https://github.com/siliconjungle/-shapeshift-labs-frontier-realtime)
- [`siliconjungle/-shapeshift-labs-frontier-realtime-server`](https://github.com/siliconjungle/-shapeshift-labs-frontier-realtime-server)
- [`siliconjungle/-shapeshift-labs-frontier-realtime-websocket`](https://github.com/siliconjungle/-shapeshift-labs-frontier-realtime-websocket)
- [`siliconjungle/-shapeshift-labs-frontier-game`](https://github.com/siliconjungle/-shapeshift-labs-frontier-game)

## Install

```sh
npm install @shapeshift-labs/frontier-playwright playwright
```

## Current Surface

```ts
import { test } from '@playwright/test';
import {
  createFrontierPlaywrightProbe,
  domProbe,
  frontierDomDevtoolsProbe,
  stateProbe
} from '@shapeshift-labs/frontier-playwright';

test('state and DOM stay in sync', async ({ page }) => {
  const frontier = await createFrontierPlaywrightProbe(page, {
    state: [
      stateProbe('app', 'window.appState.get()', {
        paths: ['/todos/0/text', '/todos/0/done']
      })
    ],
    dom: [
      domProbe('todos', '[data-todo]', {
        include: ['text', 'attributes'],
        attributes: ['data-id', 'data-done']
      })
    ],
    devtools: [
      frontierDomDevtoolsProbe('dom', '__FRONTIER_DOM__', {
        includeStateSnapshot: true
      })
    ]
  });

  await page.goto('http://localhost:3000');
  await frontier.sample('loaded');
  await page.getByRole('checkbox', { name: 'Alpha' }).click();
  await frontier.sample('after-toggle');

  const stateChanges = await frontier.query({
    source: 'state',
    id: 'app',
    path: '/todos/0/done',
    changed: true
  });

  const dirtyDomWrites = await frontier.query({
    source: 'devtools',
    id: 'dom',
    changed: true
  });
});
```

The browser-side probe stores a bounded timeline in `window.__FRONTIER_PLAYWRIGHT__`. It can sample:

- state via `expression`, `globalName`, and JSON Pointer paths
- DOM via selectors, text, attributes, dataset, value, checked state, geometry, and selected properties
- Frontier DOM devtools via `snapshot()` or `inspect()` globals such as `__FRONTIER_DOM__`
- explicit marks for AI/test-script milestones

Timeline queries run in Node, so AI scripts can ask for "what changed at `/todos/0/done` after the click" without writing page-specific diff code.

## AI Session Harness

For agent-authored scripts, use the session wrapper. It records step boundaries, samples before and after actions, waits for state or DOM changes, and can export compact evidence for another model or a log sink.

```ts
import {
  createFrontierAiSession,
  domProbe,
  stateProbe
} from '@shapeshift-labs/frontier-playwright';

const frontier = await createFrontierAiSession(page, {
  runId: 'checkout-debug',
  state: [
    stateProbe('cart', 'window.store.getState()', {
      paths: ['/cart/total', '/checkout/status']
    })
  ],
  dom: [
    domProbe('checkout', '[data-frontier-checkout]', {
      include: ['text', 'attributes', 'value'],
      attributes: ['data-state', 'aria-invalid']
    })
  ],
  defaultStep: {
    timeoutMs: 2000,
    intervalMs: 25
  }
});

await frontier.step('submit checkout', async () => {
  await page.getByRole('button', { name: 'Pay now' }).click();
}, {
  waitFor: [
    { source: 'state', id: 'cart', path: '/checkout/status', changed: true },
    { source: 'dom', id: 'checkout', textIncludes: 'Processing' }
  ]
});

const evidence = await frontier.evidence([
  {
    id: 'checkout-status-changes',
    query: { source: 'state', id: 'cart', path: '/checkout/status', changed: true },
    limit: 8
  },
  {
    id: 'checkout-dom',
    query: { source: 'dom', id: 'checkout' },
    limit: 8
  }
], {
  includeJsonl: true,
  includeLogRecords: true,
  redactKeys: ['token', 'authorization', 'password']
});

console.log(evidence.report.summary);
await uploadEvidence(evidence.jsonl);
await writeLogs(evidence.logRecords);
```

The harness intentionally returns plain JSON-shaped evidence. `frontier.evidence(...)` reads the browser timeline once, then produces the report, optional JSONL export, and optional structural log records from that same snapshot. `frontierTimelineReportToLogRecords(...)` remains available when you already have a report and want to bridge into Frontier logging sinks without importing `@shapeshift-labs/frontier-logging`.

## Benchmarks

These are Frontier-only package measurements, not competitor comparisons.

Run package-local measurements:

```sh
npm run bench
```

The benchmark covers timeline state-change queries, DOM text queries, AI reports, AI evidence bundles, JSONL export, and timeline summaries over synthetic Playwright samples.

Latest local package benchmark on Node v26.1.0, darwin arm64, 1000 samples and 80 rounds:

| Fixture | Median | p95 |
| --- | ---: | ---: |
| `query-state-changes-1000` | 138.67 us | 297.54 us |
| `query-dom-text-1000` | 162.25 us | 331.79 us |
| `summarize-timeline-1000` | 15.04 us | 65.42 us |
| `create-ai-report-1000` | 266.17 us | 364.08 us |
| `create-ai-evidence-1000` | 824.71 us | 987.71 us |
| `encode-jsonl-1000` | 546.79 us | 605.42 us |
