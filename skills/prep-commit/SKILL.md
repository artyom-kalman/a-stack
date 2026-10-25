---
name: prep-commit
description: >-
  Review uncommitted changes and commit if safe. Push or open a PR if
  the user asks. Use when the user runs /prep-commit or says "prep commit".
disable-model-invocation: true
argument-hint: "and push | and pr | don't commit"
---

# prep-commit

Review, then commit.

Invoking this skill is the commit request. Push and PR are not. Those
happen only when the user asks in the same message.

`review-diff` and `summarize-changes` are standalone skills. This skill
runs them in order, then commits.

## Workflow

```
Prep commit progress:
- [ ] Review (review-diff)
- [ ] Commit message (summarize-changes), only if safe
- [ ] Commit
- [ ] Push, only if the user asked
- [ ] Open a PR, only if the user asked
```

## 1. Review

Follow the `review-diff` skill with the current request and session
authorization. When fixes are authorized, complete its confirm-and-fix process
and re-review before continuing. A review-only request stays read-only.
Ticket creation requires its own authorization.

If the verdict is not safe to commit (unresolved important issues, including
a design choice that needs the user), stop after the review. Do not draft a
commit message or commit.

If important issues were found and fixed, include those fixes with the rest
of the intended change.

## 2. Commit message

If the verdict is safe to commit, follow the `summarize-changes` skill.

Present the review report first, then the commit message.

If the user said "don't commit" or "review only", stop after the message.
Otherwise continue to section 3. Do not stop after the message.

## 3. Commit, then push/PR on request

If the user said "don't commit" or "review only", stop after section 2.

Commit.

If they said "and push" or "then push", push after the commit.

If they said "and pr", "open a pr", or "then pr", push, then open a PR
unless one is already open. Follow the user's PR rules. If HEAD is the
default branch (`main`, `master`, or whatever `origin/HEAD` points at),
do not open a PR.

Do not create a branch.
Do not commit when the verdict is not safe.
Do not push or open a PR unless the user asked.
Do not force-push, amend, or skip hooks unless the user asked.
