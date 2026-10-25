# Readability examples

These examples come from Creobit Platform. They illustrate the preferred style
without requiring that checkout. Snippets show the relevant choices.
The registry example comes from an applied refactor; the other after versions
are instructional.

## Make a business decision explicit

Origin: Creobit Platform, `src/analytics/hooks/runTrafficImport.ts`.

Before:

```ts
return existingIntervals.has(intervalKey)
  ? { imported: 0, updated: 1, skipped: 0, rejected: 0 }
  : { imported: 1, updated: 0, skipped: 0, rejected: 0 };
```

After:

```ts
if (existingIntervals.has(intervalKey)) {
  return {
    imported: 0,
    updated: 1,
    skipped: 0,
    rejected: 0,
  };
}

return {
  imported: 1,
  updated: 0,
  skipped: 0,
  rejected: 0,
};
```

The choice and its outcomes are visible separately. This is a meaningful
business branch, not a reason to expand every simple ternary.

## Separate logical steps

Origin: Creobit Platform, `convex/analytics/agent/access.ts`.

Before:

```ts
if (budget.remaining <= 0) {
  throw new ThreadAuthorizationBudgetExceeded();
}
budget.remaining -= 1;
const project = await ctx.db.get(projectId);
```

After:

```ts
if (budget.remaining <= 0) {
  throw new ThreadAuthorizationBudgetExceeded();
}

budget.remaining -= 1;

const project = await ctx.db.get(projectId);
```

The guard, budget update, and database read are separate steps. Blank lines
mark those boundaries without narration comments or extra helpers.

## Wrap a long expression

Origin: Creobit Platform, `convex/analytics/agent/access.ts`.

Before:

```ts
.withIndex("by_projectId_userId", (q) => q.eq("projectId", projectId).eq("userId", user._id))
```

After:

```ts
.withIndex(
  "by_projectId_userId",
  (q) =>
    q.eq("projectId", projectId)
      .eq("userId", user._id),
)
```

Arguments and query constraints can be scanned separately. The callback still
lives at its call site because extracting it would not hide useful complexity.

## Make active choices visible

Origin: Creobit Platform, `convex/analytics/agent/tools.ts`,
[PR #205 refactor](https://github.com/creobitcom/creobit-platform/commit/e6014a640f660db9dd35d9e059d7c460e41242bb).
Snippets show the factory body before and after the refactor.

Before:

```ts
const budget = createAnalyticsExecutionBudget();
const legacy = createLegacyMultiProjectAnalyticsTools(
  threadId, turnEndDate, attemptId, budget,
);
const resolveEndDate = createTurnEndDateResolver(undefined, turnEndDate);

return {
  discoverProjects: legacy.discoverProjects,
  ...createDatasetTools(
    threadId, () => resolveEndDate(), attemptId, budget,
  ),
  findSteamFirstSales: legacy.findSteamFirstSales,
};
```

After:

```ts
const budget = createAnalyticsExecutionBudget();
const resolveEndDate = createTurnEndDateResolver(undefined, turnEndDate);
const datasets = createDatasetTools(
  threadId, () => resolveEndDate(), attemptId, budget,
);

return {
  discoverProjects: createDiscoverProjectsTool(threadId, attemptId, budget),
  listDatasets: datasets.listDatasets,
  describeDataset: datasets.describeDataset,
  inspectDataset: datasets.inspectDataset,
  queryDataset: datasets.queryDataset,
  findSteamFirstSales: createSteamFirstSalesTool(
    threadId, resolveEndDate, attemptId, budget,
  ),
};
```

The reader can see all six active tools without tracing two factories.
Discovery and first-sale constructors are shared with historical tests,
so the active factory no longer constructs retired tools to select two helpers.
All constructors still share one execution budget. Use object spreads when
their contents are clear; spell out registration when the active set matters.

## Readable tests

Origin: Creobit Platform, `convex/analytics/agent/money.test.ts`.

```ts
const presented = presentSteamSalesForAgent({
  linkedAppIds: ["480"],
  asOf: "2026-09-21",
  summary: { netSalesUsdE4: 136_717_920, netGameUnits: 214 },
  daily: [],
});

expect(presented.summary.netSales).toEqual({
  amount: 13_671.792,
  currency: "USD",
  display: "USD 13671.792",
});
```

Use concrete inputs and literal expected outputs. Preserve relevant cases such
as zero amounts and refunds. Calculate expected results independently instead
of calling the implementation to generate its own expected value.
