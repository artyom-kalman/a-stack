---
name: create-verification-skill
description: Create or extend runnable project verification guidance using the real app, existing tests, and user journeys. Use when asked to create a verification skill or when a project lacks a repeatable way to prove behavior.
---

# Create verification guidance

Inspect repository guidance, scripts, existing skills, tests, routes, fixture
helpers, and clients first. Reuse the established launch, authentication,
provisioning, and cleanup paths. Extend suitable project skills; create a thin
verification entrypoint only when it helps discovery across multiple clients.
Do not duplicate startup instructions or executable assertions in a second map.

Identify the primary surfaces and a small useful set of journeys, usually three
to five. For each, record the relevant client and entry point, prerequisites,
run-owned fixtures, exact existing command or concrete driving steps, expected
observable state, important denial/recovery cases, evidence location, and cleanup.
Link maintained tests as the executable source. Label manual-only journeys and
missing harness/fixture coverage honestly; do not describe them as automated.
Keep credentials and machine-specific connector bindings in ignored task state.

Use skill-creator for the instructions. Ground selectors, commands and paths in
the repository. Include a read-only doctor, or link the existing one, that checks
whether the intended checkout, revision, backend and auth context are usable.
Separate direct API proof from actual agent/client task completion. A healthy
process alone is not a usable app. Preserve other tasks' environments.

Execute the guidance before delivering it: launch or reuse the intended isolated
setup, run the doctor, drive one mapped user journey, inspect side effects and
capture evidence, clean only what the run created, then confirm evidence survived.
Fix and retry task-owned harness problems within scope. A blocked real path stays
unverified; a stand-in must list the real-target steps it did not establish.
Do not weaken the journey to make it pass. An unexecuted recipe is a draft.

Report the path proved, commands, evidence, cleanup, and remaining coverage.
Point to maintain-verification-skill for upkeep; schedule it only when asked.

Adapted from [Lauren Tan's pstack generator](https://github.com/cursor/plugins/blob/main/pstack/skills/create-verification-skill/SKILL.md).
