---
name: blast-radius
description: Assess what a code change could break beyond its diff and select proportionate verification. Use for change-impact questions and implementation verification; review-only requests stay read-only.
---

# Blast radius

Adapted from [Lauren Tan's pstack skill](https://github.com/cursor/plugins/blob/main/pstack/skills/blast-radius/SKILL.md).

Assess the requested change, not just its edited files. Follow existing task
scope and authorization; this assessment does not authorize fixes or delegation.

## Assess impact

- Read the complete task diff and relevant context. For branch work, include
  committed and uncommitted changes since the task base, not only the last edit.
- Identify changed behavior, affected domains, consumers, and the assumptions
  that preserve correctness. Trace important risks across API and stored-data
  contracts, library behavior, runtime timing, and cleanup where relevant.
- Separate confirmed problems, risks checked and cleared, and unresolved
  assumptions. Support claims with source or executable evidence.

## Choose proof

Use existing focused tests during iteration. Before handoff, select affected
unit, component, and integration coverage at the domain or package boundary,
including relevant consumers outside it. Broaden to the affected suites when
shared changes or uncertain impact make narrower selection unreliable.

Prove consequential assumptions with the cheapest useful executable check.
Prefer existing tests; add a focused regression test when warranted. Use real
browser or service verification when local tests cannot establish the behavior.
Do not add a test or launch an environment merely to fill a checklist.

Treat automatic dependency selection as assistance: runtime contracts may not
appear in its graph. Follow repository check requirements and resource limits.
A read-only review may run existing permitted checks; propose new tests instead
of editing files. Reuse current evidence and revise selection after impact changes.

## Report

Keep routine assessments brief. State the affected areas, material safety
assumptions, checks actually run and their results, and remaining evidence gaps.
Do not present an unproven assumption as established safety or passing CI as
proof of behavior its checks do not exercise.
