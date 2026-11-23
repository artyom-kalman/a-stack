# PR writing guidance

Write a brief a teammate can read in about a minute. Follow the repository's
title conventions and templates. Explain the problem even when a ticket is
linked, then describe the submitted behavior. Use the final diff and recorded
verification as sources. Small changes can need only a few sentences.

Include these details where useful.

- **Implementation.** Keep details that affect review. Name dependency or
  schema changes, migrations, and consequential authentication, lifetime,
  ownership, or cleanup rules. Check them against the diff. Distinguish removed
  adapters from removed packages.
- **Tradeoffs.** Name the benefit and cost of a deliberate choice a reviewer
  would ask about.
- **Observed behavior.** Show representative requests and actual outcomes when
  examples help. Include fixture or mock conditions and label individual timing
  observations. Reserve benchmark claims for benchmark results.
- **Verification.** State checks run, outcomes, relevant CI or evidence links,
  and material limitations. Distinguish passes, skips, incomplete checks, and
  failures. Give exact commands when they make results reproducible. Keep the
  changed state or behavior visible beside the claim it supports.
- **Independent review.** When used, name the reviewer model, reviewed revision,
  score and scope, findings, and remaining disagreements. Report visual quality
  as unassessed when the reviewer did not inspect the rendered product.

Use linked supporting comments for architecture rationale, detailed results,
traces, setup, and troubleshooting. Keep the description current as the summary
of the submitted behavior and evidence. Reuse a relevant comment when possible.
Before shortening a description, preserve relevant details in a linked comment.
Replace obsolete captures or identify the revision they show. If evidence shows
a recovered failure, explain the recovery.

Adapted from [pstack's PR playbook](https://github.com/cursor/plugins/blob/main/pstack/skills/poteto-mode/playbooks/opening-a-pr.md).
