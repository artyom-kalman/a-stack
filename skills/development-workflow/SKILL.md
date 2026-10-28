---
name: development-workflow
description: Carry implementation through task setup, review, verification, PR delivery, and cleanup. Use for implementation or task-finishing requests; keep investigation read-only.
---

# Development workflow

Own the finishing steps. Respect the user's scope and stopping point.
A bare issue reference starts investigation; implementation requests authorize
the requested edits.

Tracked issue implementation includes prep-commit, commit, push, and a draft
PR with evidence. For other work, commit, push, and open a PR only when authorized.
Merge and production deployment require separate authorization.

Any stage can stop when evidence invalidates the next step. Explain the
blocker and decision needed; continue independent work where possible.

## Start

Before implementation, identify one concrete acceptance case: the relevant
environment/revision, user action, and observable result that proves the
request is satisfied.

Read repository guidance, relevant code, acceptance criteria, and tests.
Explain how the plan and evidence prove the requested outcome before substantial
work. Identify likely affected domains and contracts to guide focused tests.
Flag consequential assumptions or substitutions. For bugs, reproduce
before editing. Resolve factual uncertainty through inspection or a small
experiment; ask only for product, preference, or spending decisions
that existing context and authorization do not settle.

For paid evaluations, state cases, candidates, scoring criteria, and estimated
spend before bulk runs.

For PR delivery, read [pr-presentation](../pr-presentation/SKILL.md) before
verification so useful screenshots and recordings are captured during actual
checks.

Implement changes in an isolated environment using a worktree from `main`.
Use relevant project setup, implementation, and testing skills.

## Build and verify

1. Implement the requested behavior.
2. Apply [code-readability](../code-readability/SKILL.md) to the changed code.
3. Review the final diff for correctness and readability. Use prep-commit's
   review stage when committing; otherwise use review-diff or review directly.
   Fix confirmed correctness
   issues and maintainability problems introduced by the change.
4. Use [blast-radius](../blast-radius/SKILL.md) on the complete task diff to
   choose verification. Run project-required checks and the selected tests.
   After review fixes, update the assessment when impact changes and recheck
   affected behavior. Reuse passing evidence while its relevant inputs remain
   unchanged. Use project browser-testing guidance when needed.
5. Capture evidence from the final result: screenshots, recordings, or actual
   inputs and outputs. For bugs, compare the reproduction before and after.
   Run that acceptance case against the submitted revision before handoff.
   Passing other checks does not replace it; report any gap explicitly.

Complete authorized commit, push, and PR stages after verification and evidence.
Register the PR with the host when supported. Avoid unrelated cleanup and
repeating passing checks without a change or unresolved concern.

## Deliver

Show the result, evidence, checks, and gaps in chat. Include material safety
assumptions and their proof or unresolved gaps; keep routine assessments brief.
Give readable findings
first; raw traces and archives are supporting material.

Use [pr-presentation](../pr-presentation/SKILL.md) for the PR title, description,
review-relevant technical details, supporting comments, and evidence attachments.

For readability changes, show an existing diff link and a representative
before/after when useful.

Offer the task URL and a short review path in the shared browser when helpful.
Keep the environment available while review is pending.

Check completion against the original request and acceptance criteria.
Unverified work or a narrower pilot remains partial unless the user changes scope.

## Clean up

After merge and required acceptance checks, or explicit abandonment with
permission to discard the changes, use [task-cleanup](../task-cleanup/SKILL.md).
Honor requests to keep the environment.
