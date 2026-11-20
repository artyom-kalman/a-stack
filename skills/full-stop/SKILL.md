---
name: full-stop
description: Finish implementation with an open pull request ready for the user's review. Use by default for implementation and when the user requests Full Stop.
---

# Full Stop

Take the requested work through verification, review, commit, push, and PR
follow-through. Leave the PR open for the user's merge decision. State the
endpoint and observable acceptance case before substantial work.

Use this endpoint for ordinary implementation. Honor a different endpoint the
user specifies, such as investigation only, local edits, a demo before
publication, or an early draft. Follow repository rules and the host's
authorization requirements.

Use the remaining stages of [development-workflow](../development-workflow/SKILL.md)
to get there. Reuse an existing task PR when one exists. Before pushing to it,
confirm it has no auto-merge or active merge queue entry. Open the PR ready for
review and own required CI and blocking review findings through handoff.

## Hand off the PR

Check the live PR's current head and base. Confirm the PR is open, ready for
review, and left for manual merge. Confirm acceptance evidence covers the
submitted behavior, required checks have passed, and blocking findings and
conflicts are resolved. Recheck affected evidence after a behavior change.

Report the PR link, final head, evidence, and the actual handoff state:

- **Ready for review** when proof and required checks pass and the PR is mergeable.
- **Waiting for required approval** when a human approval is the remaining gate.
- **Blocked** when progress needs a missing prerequisite or decision. State the
  specific blocker and next action.

When required checks or reviews are still pending, follow the development
workflow's PR watcher instructions.

Adapted from [Theo Browne's Full Stop](https://github.com/t3dotgg/tstack/blob/main/skills/full-stop/SKILL.md).
