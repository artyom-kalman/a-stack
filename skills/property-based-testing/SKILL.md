---
name: property-based-testing
description: Write focused property-based tests for parsers, serializers, state transitions, or input-heavy logic when a general rule can cover useful cases beyond examples.
---

# Property-based testing

Use when the affected behavior has a clear invariant. Skip when ordinary
examples already prove the behavior adequately. Reuse the project's test runner;
prefer fast-check for JavaScript and TypeScript.

Derive the property from intended behavior. Generate valid inputs and meaningful
edge cases. Exercise the relevant operation: a passing escaping helper does not
prove an export/import round trip. Bound the run cost; 1,000 cases is a starting
point for cheap logic, not a requirement.

Check a failure against the intended contract before calling it a bug. Preserve
the seed, replay path, and minimized input; keep confirmed counterexamples as
ordinary regression tests. Follow the task's scope for fixing discovered bugs.

Example: exported translation text should survive reimport unchanged.
Substitute the project's real functions and fixtures for the example names.

```ts
fc.assert(
  fc.property(fc.string({ maxLength: 80 }), (text) => {
    const csv = exportTranslation(text);
    expect(importTranslation(csv)).toBe(text);
  }),
  { numRuns: 1_000 },
);
```
