---
name: cursor-cloud
description: Hand off an authorized repository task to Cursor Cloud, observe delivery, and review its draft PR using the official SDK. Use for explicit cloud delegation; ordinary local implementation stays local.
---

# Cursor Cloud tasks

The parent owns scope, review and delivery. One durable cloud agent owns implementation for each task. This skill does not authorize new work, merges or production deployment.

## Prepare the handoff

Read the issue, current code, repository guidance and existing tests. Agree on observable behavior and exclusions before dispatch. Favor independent, bounded tasks; identify unresolved product decisions locally.

Write a brief and JSON config outside the repository. Include issue URL, repository, base commit/ref, approach, acceptance criteria, relevant skill paths, checks, evidence and draft-PR delivery. Include enough context for a fresh checkout. Explicitly tell the worker to read finishing SKILL.md files; a skill name is not a package script. Use project environment/E2E guidance and task-owned development data.

For bug fixes, require reproduction before edits and the same checks afterward. Existing regressions usually suffice. Browser proof must assert the required state; elapsed sleeps, swallowed failures and settled-only assertions do not prove transitions. Readability review covers the whole PR without unrelated cleanup.

Preserve the scope and timing of repository checks. A full check required before push is not a prerequisite for starting implementation. Do not add a green-repository preflight unless the user or repository explicitly requires it. For unrelated failures, establish the baseline with bounded evidence, continue task-relevant work and report the failed check honestly. Repairing unrelated fixtures or tooling is separate scope; do not silently waive an explicit blocking rule.

## Run the helper

Use `node scripts/cloud-task.mjs` relative to this skill. Its pinned dependency is installed with `npm ci --ignore-scripts` in the skill directory. Node 22.13+ is required.

```sh
node scripts/cloud-task.mjs doctor
node scripts/cloud-task.mjs start /absolute/path/config.json
node scripts/cloud-task.mjs status ISSUE-ID
node scripts/cloud-task.mjs followup ISSUE-ID /absolute/path/findings.txt
node scripts/cloud-task.mjs evidence ISSUE-ID
node scripts/cloud-task.mjs evidence ISSUE-ID /remote/artifact/path
node scripts/cloud-task.mjs finish ISSUE-ID reviewed-head-sha
```

Config requires `issue`, `repository`, `ref`, `model` and `briefPath`. Optional `budgetUsd` defaults to 5 and `maxFollowups` to 2. These guard NEW follow-ups, not spend inside a running prompt. Explain the intended cases and approximate cost before dispatch; never promise subscription work is free.

SDK authentication uses the existing private Cursor login or `CURSOR_API_KEY`. `doctor` reports readiness without showing the key. Never copy credentials into prompts, state or reports. For expired login, use the official SDK login flow; do not ask for a key in chat.

State and evidence live under `~/.local/state/cursor-cloud/<issue>/`; `CURSOR_CLOUD_STATE_DIR` can override that root. No task state belongs in the application checkout.

Creation and sends record intent before network mutation. Repeated start/followup is refused. A pending or uncertain send requires reconciliation against stored agent/run metadata, not a new agent or a changed prompt to evade the guard. The helper never automatically retries a paid submission. Follow-ups wait until the current run is terminal; collect review findings into one brief.

## Observe and review

One parent-thread monitor observes cloud delivery. Before API calls, check durable phase: ready/merged/blocked tasks exit quietly. Update only for meaningful progress or blockers. Stop the cloud timer after delivery; use the host PR watch for CI. Do not keep both polling the same completed work. Persist monitor ownership and stop it before handoff, so stale queued triggers do nothing.

Link every task PR with the host's PR-link tool. If the cloud cannot open a draft, create it from the pushed branch under the existing delivery authorization. Inspect the full final diff, current checks, conversation and evidence. `finished` and a PR URL are not review approval. Download actual logs/captures with `evidence` when exposed; report unavailable artifacts honestly.

Require resolved acceptance criteria, maintainable code, actual required verification and current head checks. Distinguish task regressions from evidenced pre-existing failures; unrelated baseline failures alone do not justify cancelling an active run. Send one focused follow-up to the SAME agent for confirmed gaps. After two revision rounds or the continuation budget, stop cloud revisions and diagnose in a local isolated worktree unless the user changes those limits. Preserve standards; do not waive failures to fit the budget.

Call `finish` only after parent review and task acceptance/applicable blocking checks pass. Keep unrelated baseline failures visible in the review; never describe a failing or skipped check as passed. Stop the scheduler and PR watch, update the issue to review/in progress, and report PR/head, evidence, limitations and aggregate charged cost. After merge, follow the project's normal task cleanup workflow.

The SDK manages agents, run metadata, cost and artifacts. Its cloud `conversation()` waits for stream completion, so live snapshots use Cursor's bounded `/v0/agents/{id}/conversation` read endpoint. If that compatibility endpoint fails, status still reports metadata and its error; inspect the cloud conversation manually rather than fabricating progress.

SDK reference: https://cursor.com/docs/sdk/typescript
