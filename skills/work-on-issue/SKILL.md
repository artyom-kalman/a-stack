---
name: work-on-issue
description: Gather context for a tracked issue, check its premise, and carry out the requested investigation or authorized change. Use when the user supplies an issue ID, URL, or identifiable tracked task.
---

# Work on issue

Understand the issue before acting. Follow the user's requested outcome
and existing session authorization. Each stage can stop the work when
evidence does not justify proceeding.

## Understand the request

Find the issue through the connected tracker when available. Read its
description, acceptance criteria, relevant comments, and linked sources.

Inspect the relevant repository guidance, implementation, tests, recent
history, and current working state. Compare the issue with current reality.
Do not assume its description or status is still accurate.

Establish:

- What outcome the user wants.
- What already exists or has changed since the issue was written.
- Which constraints and unresolved decisions matter.

A bare issue reference starts with investigation unless the conversation
already authorizes implementation. An explicit implementation request
authorizes work within its scope.

## Choose the work and its proof

Choose from the requested outcome and evidence, rather than the tracker label.

- Feature or behavior change: establish observable acceptance criteria.
- Refactor: capture the existing behavior that must remain unchanged.
- Bug: confirm the reported failure in at least two separate runs before
  implementing a fix. Reset relevant state when needed. For intermittent
  failures, report reproductions and total attempts.
- Investigation: define the question and return an evidence-backed answer.
- Other work: choose verification appropriate to the requested result.

Existing behavior may be intentional and still be the subject of a valid
improvement request.

## Proceed through the appropriate workflow

For authorized implementation, use development-workflow. Use diagnose when
a bug needs deeper investigation.

Assess the proposed change before editing. Check whether it addresses the
actual need, fits the existing system, and introduces acceptable risks.

Verify the requested outcome against the actual result. For bugs, rerun
the reproduction steps. For refactors, verify preserved behavior.
Failed or inconclusive verification does not count as completion.

## Stop the line

At any stage, stop when the premise is unsupported, necessary evidence
is unavailable, the change is too risky, or a required decision is unresolved.

Report:

- Where the work stopped.
- The evidence and reason.
- What would allow progress, or why no change is warranted.

One bug reproduction is partial confirmation. Failure to reproduce does
not prove the bug is absent.

Continue independent work when useful. Do not force a change to satisfy
the ticket or ask for another approval merely because a stage passed.

Commits, PRs, deployments, and tracker updates follow the user's authorization.
