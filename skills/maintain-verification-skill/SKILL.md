---
name: maintain-verification-skill
description: Audit project verification recipes against source and live behavior, correcting proven instruction or harness drift. Use when asked to maintain verification guidance or audit its coverage.
---

# Maintain verification guidance

Locate the existing project verification skills and recipes. Follow the requested
scope, or audit their maintained coverage when no narrower scope is given. Read
linked tests and current implementation; identify stale commands, prerequisites,
missing entry points and duplicate sources of truth. Do not generate a parallel
feature catalogue or rewrite clean instructions for style.

Derive the smallest set of live journeys that covers the selected recipes.
Use the project's existing launch, doctor, fixtures and evidence conventions.
Only one owner drives a shared instance. Source reading alone does not establish
that a recipe works. Recheck readiness after a surprising failure and reset a
wedged app to a known state before continuing. Preserve evidence after every run
and clean run-owned residue from failed attempts as well as successful ones.

Classify each finding:
- Instruction drift: correct the recipe to match intended, demonstrated behavior.
- Harness gap: fix scoped verification tooling, then exercise the fix live.
- Product defect: report the reproduction and evidence. Do not weaken the recipe
  or edit product behavior under this maintenance task.

Keep edits to verification guidance and its supporting tooling. Obtain separate
authorization for product fixes. Mark a missing prerequisite or inaccessible
client as blocked with the exact path attempted, not a pass. Fix task-owned
setup when possible; retain explicit external blockers.

Return clean when all selected journeys pass without useful corrections;
changed for one reviewable PR of demonstrated corrections; blocked when coverage
cannot finish. A clean or blocked audit needs no empty branch or PR. Report
coverage, proven changes, evidence, cleanup and remaining gaps. Schedule future
runs only when requested.

Adapted from [pstack's verification maintenance](https://github.com/cursor/plugins/blob/main/pstack/skills/maintain-verification-skill/SKILL.md).
