---
name: summarize-changes
description: >-
  Writes a one-line commit message for uncommitted changes matching the
  repository's commit style. Use when the user runs /summarize-changes, asks for a commit
  message, or wants to summarize dirty/local/working-tree changes. Does not
  review code or commit — message only.
---

# summarize-changes

Produce a commit message for the current working tree. Does not review for bugs or commit — message only.

## Workflow

```
Summarize progress:
- [ ] Study repo commit style from git log
- [ ] Gather diff and status
- [ ] Draft message(s)
- [ ] Present in copyable code block
```

## 1. Study commit style

```bash
git log --oneline -20
```

Note format, tense, prefix conventions, length, and capitalization. Match what the repo actually uses.

## 2. Gather changes

Run in parallel when possible:

```bash
git status
git diff HEAD
git diff --cached
```

For **untracked** files, read them directly.

If there are no changes, say so in one sentence and stop.

## 3. Draft the message

**Subject line only. Never write a commit body.** One line, no blank line, no
bullet list of changes, no "why" paragraph. If the change feels too big to fit
one line, that is a sign it should be split.

The message must:

- Follow the exact style observed in the git log
- Accurately describe what changed
- Group related changes logically when they belong in one commit

If changes are too large or unrelated for one commit, suggest splitting and provide a separate message for each logical group.

## 4. Present

Put the commit message in a fenced code block so it's easy to copy.

Do not commit unless the user explicitly asks in a separate step.
