---
name: independent-review
description: Get an independent scored review when requested or when substantial UI, readability, auth, persistence, integration, or repeated-failure work warrants fresh judgment. Routine small edits use the normal diff review.
---

# Independent review

Use one fresh reviewer with the original request, acceptance criteria, final
diff/base/head, relevant source, checks, and actual evidence. Keep the brief
factual; let the reviewer form its own conclusions. Review only, no edits,
publication, or nested reviewers. Use a model the user selects or the host's
configured suitable reviewer; report its actual identity and unavailable access.
Do not substitute a user-named model without asking.

Follow the host's delegation rules. In T3 Code, discover capabilities first,
use delegate_task for another provider or user-specified settings, and start a
fresh task for each recheck. Follow its returned next action, not polling.
Use native delegation when the host directs it. Respect machine concurrency
limits. The implementation owner retains decisions, fixes, and PR monitoring.

Ask for:
- Concrete correctness or scope findings with source/evidence and severity.
- A 1–10 assessment of relevant dimensions: correctness, readability, and UI
  quality when applicable. Explain what limits each score and confidence.
- Runtime paths actually inspected and what remains unassessed. UI quality
  requires viewing the rendered result; code alone cannot earn a visual score.
- A verdict and the smallest useful fixes. Include the comment lens for a
  comment-heavy diff instead of starting a second reviewer.

Default to one initial round, at most three total. Recheck changed behavior and
open substantive findings only. Fix or decline findings with evidence; do not
expand the feature to satisfy speculative suggestions. Nits do not require a
new round. A numerical target such as 9/10 applies only when the user asks for
that polishing process; agree a bounded budget rather than loop indefinitely.
Budget exhaustion is not approval. Report unresolved disagreements or blockers.

Keep three outcomes separate: reviewer assessment, observed verification, and
delivery readiness. Re-run affected proof after behavior fixes. A score cannot
replace acceptance evidence. Publish the actual model, reviewed head, rounds,
score rationale, accepted/declined findings, and gaps concisely.

Adapted from [Theo Browne's bounded review loop](https://github.com/t3dotgg/tstack/blob/main/skills/sol-loop/SKILL.md).
