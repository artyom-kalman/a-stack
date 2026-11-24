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

A standalone invocation authorizes review and commit by default. For any
additional delivery, follow the requested endpoint and authorization already
established in the session. [Development workflow](../development-workflow/SKILL.md)
owns the endpoint for implementation tasks.

`review-diff` and `summarize-changes` are standalone skills. This skill
runs them in order, then commits.

## Workflow

```
Prep commit progress:
- [ ] Review (review-diff)
- [ ] Commit message (summarize-changes), only if safe
- [ ] Commit
- [ ] Hand off any authorized push or PR
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

## 3. Commit and hand off

If the user said "don't commit" or "review only", stop after section 2.

Commit.

For an authorized push-only request, push after the commit. For authorized
PR delivery, hand off to [Open PR](../open-pr/SKILL.md). PR delivery requires an
existing task branch.

Do not create a branch in this skill.
Do not force-push, amend, or skip hooks unless the user asked.
