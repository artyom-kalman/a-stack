# a-stack

Personal skills shared through `~/.agents/skills`. Keep repository-specific
commands and fixtures in that repository's own skills.

Check or install only the selected skills, preserving unrelated local files:

```bash
python3 install-skills.py development-workflow independent-review create-verification-skill maintain-verification-skill no-comments pr-presentation task-cleanup
python3 install-skills.py development-workflow independent-review create-verification-skill maintain-verification-skill no-comments pr-presentation task-cleanup --apply
```

A check exits 1 when files differ. Apply backs up replaced files under
`~/.agents/.skill-backups/`, copies the selected files atomically, and reports
SHA-256 hashes. Run the same check from the same commit on each machine to
verify installation. It neither removes local-only files nor rewrites symlinked
skills. Existing agent clients that discover `~/.agents/skills` need a new session
to discover added skills; keep their configured discovery paths intact.

Implementation normally ends at a verified, merge-ready PR. Independent scoring
and focused comment review are selective. Verification generation and maintenance
reuse the project's existing test harness. Explicit user stopping points and
repository conventions take precedence. Merging needs its own authorization.

Validate the installer with `python3 -m unittest discover -s tests`.
