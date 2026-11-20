---
name: development-workflow
description: Carry implementation through task setup, review, verification, PR delivery, and cleanup. Use for implementation or task-finishing requests; keep investigation read-only.
---

# Development workflow

Own the finishing steps. Respect the user's scope and stopping point.
A bare issue reference starts investigation; implementation requests authorize
the requested edits.

Use [Full Stop](../full-stop/SKILL.md) by default for implementation requests.
It defines the endpoint and the checks for handing over an open PR for the
user's review. Follow an explicit different endpoint and repository contribution
rules.

Merge only when requested. Explain normal deployment consequences before an
authorized merge; follow the repository's release checks after it. Manual
production changes outside that normal release still need their own authorization.

Any stage can stop when evidence invalidates the next step. Explain the
blocker and decision needed; continue independent work where possible.

## Start

Before substantial work, state the intended outcome, task mode, and observable
completion condition. Infer these from context; ask only when ambiguity changes
scope. Completing an experiment does not imply the product goal is complete.

Before implementation, identify one concrete acceptance case: the relevant
client, environment/revision, user action, and observable result that proves
the request is satisfied.

Read repository guidance, relevant code, acceptance criteria, and tests.
Identify relevant product invariants. Distinguish intended behavior from current
implementation restrictions; do not treat existing limitations as requirements.
For suitable input-heavy or stateful logic, consider
[property-based-testing](../property-based-testing/SKILL.md) for a focused invariant test.
Record consequential decisions in the tracked issue before implementation.

Explain how the plan and evidence prove the requested outcome before substantial
work. Identify likely affected domains and contracts to guide focused tests.
Flag consequential assumptions or substitutions. For bugs, reproduce
before editing. Resolve factual uncertainty through inspection or a small
experiment; ask only for product, preference, or spending decisions
that existing context and authorization do not settle.

For paid evaluations, state cases, candidates, scoring criteria, and estimated
spend before bulk runs.

For PR delivery, read [Open PR](../open-pr/SKILL.md) before verification so you
can capture evidence during the checks.

Implement changes in an isolated environment using a worktree from `main`.
Use relevant project setup, implementation, and testing skills.

## Build and verify

1. Implement the requested behavior.
2. Apply [code-readability](../code-readability/SKILL.md) to the changed code.
   Review every added comment, including test comments. Remove comments that
   restate readable code. Keep comments only when they add non-obvious reasons,
   constraints, or external facts.
3. Review the final diff for correctness and readability. Use prep-commit's
   review stage when committing; otherwise use review-diff or review directly.
   Fix confirmed correctness
   issues and maintainability problems introduced by the change.
   Use [independent-review](../independent-review/SKILL.md) when requested or
   when a substantial UI/readability change, consequential auth/persistence/
   integration boundary, or unresolved repeated failure warrants fresh judgment.
   Routine small fixes and prose changes normally need only the standard pass.
   A focused [no-comments](../no-comments/SKILL.md) pass fits comment-heavy diffs;
   include that lens in an existing reviewer rather than launching another.
4. Use [blast-radius](../blast-radius/SKILL.md) on the complete task diff to
   choose verification. Run project-required checks and the selected tests.
   After review fixes, update the assessment when impact changes and recheck
   affected behavior. Reuse passing evidence while its relevant inputs remain
   unchanged. Use project browser-testing guidance when needed.
5. Capture evidence from the final result: screenshots, recordings, or actual
   inputs and outputs. For bugs, compare the reproduction before and after.
   Run that acceptance case through the relevant client and integration boundary
   on the submitted revision before handoff. Handler tests alone do not prove MCP
   client behavior; fixtures alone do not prove live persistence or streaming.
   Use relevant project MCP and browser-testing guidance for those checks.
   Report the tested path and remaining gaps before calling work complete.
   Passing other checks does not replace acceptance evidence.

Complete authorized commit and push stages after verification. Use
[Open PR](../open-pr/SKILL.md) to file the PR or update the existing one. Own
checks and relevant review findings through the agreed endpoint. Fix confirmed
task-related failures and conflicts. Inspect infrastructure failures before
retrying. Keep scope bounded.
Reuse passing evidence unless changed inputs or unresolved concerns invalidate it.

When checks or reviews are pending, use the host's PR watcher and resume on its
events. In T3 Code, handle existing findings, call watch_pull_request, and end
the turn. Only the owning parent watches. Unwatch before a ready/blocked handoff
or a question; do not leave an idle polling loop. A wake is not merge approval.

Use [Full Stop's handoff checks](../full-stop/SKILL.md#hand-off-the-pr) when
delivering a PR for the user's review.

## Deliver

For an explicitly early draft, state what remains. Keep reviewer assessment
separate from verification. Name the reviewed revision, model, score or
findings, actual client journeys and outcomes, and untested paths. A high
review score does not establish runtime behavior.

Show the result, evidence, checks, and gaps in chat. Include material safety
assumptions and their proof or unresolved gaps; keep routine assessments brief.
Give readable findings
first; raw traces and archives are supporting material.

For readability changes, show an existing diff link and a representative
before/after when useful.

Offer the task URL and a short review path in the shared browser when helpful.
Keep the environment available while review is pending.

Check completion against the original request and acceptance criteria.
Unverified work or a narrower pilot remains partial unless the user changes scope.

## Clean up

After merge and required acceptance checks, or explicit abandonment with
permission to discard the changes, use [task-cleanup](../task-cleanup/SKILL.md).
Honor requests to keep the environment. Once a user-merged task is observed
complete, clean it without requiring another prompt. Use existing repository
cleanup automation for merges that happen after handoff; do not keep a PR watcher
alive solely for cleanup or invent a new background job for every task.
