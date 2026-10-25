---
name: task-cleanup
description: Clean up finished task dev services, worktrees, and branches after merge or explicit abandonment, including repository-wide cleanup when requested.
---

# Task cleanup

Run after merge and required acceptance checks, or when the user explicitly
abandons the task and authorizes discarding its changes. Clean up without
another prompt once that condition is met. A cleanup request authorizes removal
of verified finished worktrees and branches, including those still referenced
by completed T3 Code threads. Honor requests to keep an environment.

Touch only resources owned by the current task unless the user requests broader
cleanup. For repository-wide cleanup, inventory all worktrees and local branches
from the existing checkout; do not create another worktree for cleanup itself.
Always preserve the primary checkout and default branch.

## Decide what stays

Keep a task worktree or branch when any of these applies:

- A T3 Code thread using it is running, starting, preparing, queued, monitoring,
  or waiting for user input needed to continue the task.
- Its work is unmerged, including commits added after a PR merged. A rejected
  review, closed unmerged PR, or missing upstream does not authorize deletion.
- Its PR is merged but acceptance checks, requested confirmation, review
  follow-up, or other task work remains. Inspect recent thread messages and PR
  state for concrete unfinished work; do not invent extra confirmation steps.
- It contains uncommitted changes or valuable untracked or ignored files whose
  disposal is not authorized. Identify generated caches and dependencies before
  treating them as disposable.

A historical thread reference, an idle/completed thread, or an unsettled inbox
entry alone is not active work. Check the thread's actual remaining work and
workspace binding. Finished cleanup threads follow the same rules as other
finished tasks. If ownership or completion remains uncertain, retain that
resource with a specific reason and continue cleaning verified finished ones.

## Clean up finished work

1. Identify worktrees, local and remote branches, PR outcomes, T3 thread bindings
   and task state, and dev services. Confirm merge status against the actual PR
   base, including squash merges. For squash merges, verify that the local tip
   matches the merged PR head and the merge commit is in the base. A missing
   upstream alone is neither proof of completion nor a reason to keep a finished
   branch. Recheck tips and dirty state immediately before removal.
2. Record branch tips, PR links, and merge commits. Verified merges from step 1,
   including squash merges, need no additional Git history backup. Preserve
   useful config and evidence that would otherwise be lost; reuse existing
   archives or accessible published copies. If relying on published attachments,
   confirm they remain accessible. When the user requests history preservation
   for other work, scope the backup to the affected commits. Do not create
   full-repository archives for routine cleanup. Update the associated issue,
   if any, to reflect the actual merged or abandoned outcome, with result links
   when available.
3. Stop task-owned dev servers and leftover helpers from finished threads,
   including manual sessions. Remove disposable isolated development backends
   when applicable. Confirm ownership and process identity before stopping
   processes or deleting resources; preserve shared services and active threads.
4. Release or retarget the host workspace binding when supported. If T3 Code
   exposes no detach operation, proceed with removal of verified finished
   worktrees without another permission request. Old thread references do not
   reserve a checkout indefinitely. Do not edit T3's internal database to remove
   bindings. Report that resuming an affected old thread needs a fresh checkout.
5. Remove the worktree, then delete merged local and remote task branches.
   For abandoned work, delete unmerged changes and branches only within the
   user's explicit discard instructions. A clean status alone does not prove
   ignored files are disposable. Use force only after verifying exactly what
   would be removed and that its disposal is authorized.
6. Verify services stopped, backend removal, and worktree and branch removal.
   Report remaining worktrees and branches with concrete retention reasons.
