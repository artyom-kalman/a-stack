---
name: good-morning
description: Morning briefing — today's calendar, open Linear issues. Use when the user says "good morning", asks for their plan for the day, or invokes /good-morning.
---

Build the user's plan for today, then help them adjust it.

## Gather

Run these in parallel:

1. **Calendar** — `list_calendars`, then `list_events` on each non-holiday calendar for today (00:00–24:00, user's timezone). Get the current time first; the past part of the day is history, not plan.
2. **Linear** — `list_issues` with `assignee: "me"`, `includeArchived: false`. Keep only issues whose `statusType` is `started` or `unstarted`.
3. **Code** — for the few issues that look like today's work, check the repo they refer to: current branch, uncommitted changes, recent commits, and whether the described fix is already in the code. An issue marked "In Progress" is often half-done or already done; say so.

## Report

Short. No preamble.

- **Schedule** — remaining blocks of today, with times. Note collisions and anything with no travel time.
- **Tasks** — open issues, highest priority first, grouped by what they actually are. Mark ones the code says are further along than Linear thinks.
- **Plan** — map specific issues onto specific calendar blocks. Batch issues that touch the same code. Recommend one thing to cut when there is too much.

Then stop and let the user react.

