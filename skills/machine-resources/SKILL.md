---
name: machine-resources
description: >-
  Checks Linux CPU, RAM, swap, and disk usage; identifies top resource
  consumers and gives ranked recommendations. Use when the user runs
  /machine-resources, asks what is using system resources, why the machine
  is slow, or wants a before/after check after closing processes.
disable-model-invocation: true
---

# machine-resources

Quick Linux resource triage. Run commands yourself — do not guess from memory.

## Workflow

```
Resource check:
- [ ] Snapshot (RAM, swap, load, disk)
- [ ] Top processes (CPU and memory)
- [ ] Group memory by process name
- [ ] Check swap activity and zombies
- [ ] Report findings and recommendations
```

**Recheck mode:** When the user says they closed or stopped processes, run the full workflow again and include a before/after table (RAM, swap, load, top consumers). Keep the earlier snapshot from the same conversation; if none exists, note that and report current state only.

## 1. Snapshot

Run in parallel:

```bash
free -h && echo "---" && uptime && echo "---" && df -h / /home 2>/dev/null
nproc
```

## 2. Top processes

```bash
top -b -n1 | head -22
ps aux --sort=-%mem | head -15
ps aux --sort=-%cpu | head -15
```

## 3. Group by app

```bash
ps -eo pid,rss,comm --no-headers | awk '{rss[$3]+=$2; cnt[$3]++} END {for (c in rss) printf "%8.1f MB  %4d procs  %s\n", rss[c]/1024, cnt[c], c}' | sort -rn | head -15
```

For browser tab processes, count content processes and sum RSS when relevant:

```bash
ps -eo pid,rss,args --no-headers | grep -c '<browser-contentproc-pattern>'
```

Use the actual pattern from `ps` output (e.g. `-contentproc`, `chrome`, `firefox`).

## 4. Pressure and hygiene

```bash
vmstat 1 2 | tail -1
ps -eo stat,pid,comm --no-headers | awk '$1 ~ /Z/ {print}'
```

## 5. Stale dev servers (when present)

If `esbuild`, `tsserver`, `vite`, `wrangler`, or similar show high `etime`, trace the parent:

```bash
pstree -sp <pid>
ps -o pid,ppid,etime,args -p <pid>
```

Identify the project from the command line or `/proc/<pid>/cwd`.

## Report format

```markdown
## Summary

| Metric | Value |
|--------|-------|
| RAM | ... |
| Swap | ... |
| Load (1/5/15 min) | ... / cores |
| Disk | ... |

## Top consumers
- App — RAM, process count, notes

## Issues
- Memory pressure / swap thrashing / high load / stale dev servers / zombies

## Recommendations
1. Biggest impact first — close tabs, stop stale dev servers, restart bloated language servers
2. ...

## Before/after (recheck mode only)
| Metric | Before | After | Change |
|--------|--------|-------|--------|
```

## Interpretation (brief)

- **Swap heavily used + low available RAM** → memory pressure; likely sluggish
- **Load sustained above core count** → CPU busy
- **Zombies** → finished processes awaiting parent cleanup; harmless in small numbers; restart parent app if many
- **`esbuild --service`** → background bundler helper for a dev tool; trace parent to find the real dev server

Do not kill processes unless the user asks.
