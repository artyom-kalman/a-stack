---
name: no-comments
description: Run a focused independent comment review when requested, a diff is comment-heavy, or ordinary review finds stale or narrating comments. Routine comment hygiene stays in code-readability.
---

# Review comments

Use the requested files or the complete task diff against its base, including
working-tree edits. Keep the scope bounded. Follow repository language rules.
Read code around each claim before judging it.

Use one fresh reviewer when delegation is available and authorized. If an
independent reviewer is already running, include this lens there. The reviewer
reports comment findings and suggested code clarification; the owner applies
accepted changes. When a fresh reviewer is unavailable, perform the pass directly
and state that it was not independent. No nested reviewers or unrelated edits.

Remove narration, redundant headings, commented-out dead code, task-history
stories, stale assertions, and explanations that merely repeat readable code.
Keep legal/license notices, meaningful public API contracts, proven external
constraints, and non-obvious reasons needed to understand behavior. Inspect
suppressions and their rules before changing them; preserve necessary justified
suppressions until an actual verified code fix replaces them. Follow explicit
repository exceptions. Do not delete an unresolved safety constraint on faith.

When a comment exposes confusing code, prefer the smallest clear name, branch,
or local structure within the authorized change. Substantive refactoring or a
new type/runtime/test enforcement mechanism needs justification within scope;
propose it separately when it changes the task. Do not build a new check for
every deleted comment or widen a comment pass into a subsystem rewrite.

Verify behavior-affecting fixes with relevant existing checks. Pure comment
removal needs no new tests. Report useful deletions, retained non-obvious
constraints, code clarification and unresolved findings briefly.

Adapted from [pstack's no-comments skill](https://github.com/cursor/plugins/blob/main/pstack/skills/no-comments/SKILL.md) with bounded refactoring and explicit preservation of justified constraints.
