---
name: pr-presentation
description: Use when creating or updating a pull request title, description, supporting comments, or verification evidence.
---

# PR presentation

Write a brief a teammate can read in about a minute. Explain why the change
exists, what the submitted code does, what deserves attention in review, and
what evidence they can inspect. Keep consequential technical details. Small
changes can need only a few sentences; do not fill a template or enforce a word quota.

Follow repository conventions and templates. Use the final task diff, actual
dependency/schema changes, and recorded verification as sources. Respect the
session's existing delivery authorization; this skill does not authorize code
changes, additional paid runs, or merging.

## Plan evidence during verification

Choose proof that shows the changed behavior while doing the task's actual
verification. Capture readable UI screenshots for visible changes and recordings
when an interaction or transition matters. For nonvisual work, retain relevant
inputs, outputs, commands, or logs.

Reuse applicable captures. Do not rerun passing flows or make new model/service
calls solely to film a demo.

## Title and description

Write a short outcome title. Follow the repo's title convention, commonly
`type(scope): action`, without a trailing period. Prefer a concrete behavior to
an issue number, implementation phase, or vague promise of completion.

Start the description with the problem and resulting behavior in plain language.
Explain why the change is needed even when a ticket is linked. Describe the final
submission, not the sequence of attempts that produced it.

Use the following sections only where useful:

- **Implementation:** a few review-relevant details. Include added, removed, or
  changed dependencies and their purpose; schema changes and migrations; and
  consequential authentication, lifetime, renewal, ownership, or cleanup rules.
  Verify these against the diff. Distinguish removed runtime adapters from
  removed packages. Avoid file inventories and routine implementation narration.
- **Tradeoffs:** the benefit of a deliberate choice and the cost accepted for it.
  Include only choices a reviewer would reasonably question; skip generic pros
  and cons or invented rejected alternatives.
- **Real app conversations / observed behavior:** when runtime examples help,
  use a compact input/request, observed result, and optional elapsed-time table.
  Name conditions that affect interpretation, such as synthetic data or mocked
  providers. Individual timings establish observations, not a benchmark.
- **Verification:** a concise account of checks actually run and their outcomes,
  links to relevant CI/evidence, and material limitations. Keep failures, skips,
  and incomplete checks distinct from passes. Use exact commands when they make
  the result reproducible. Do not substitute test counts for behavior evidence.

Do not add a generic "How to check" section or instructions that depend on the
author's machine, private browser session, local paths, or test account. Useful
setup and detailed reproduction instructions belong in supporting comments.

Attach actual product captures near the claims they support, with short captions.
A screenshot of a written verification report does not replace a product capture,
recording, or actual output. Show the relevant value or state clearly. Replace
obsolete captures or label before/after states; keep recovered failures visible
and explain them when they appear in the evidence.

## Supporting comments and publication

Put necessary architecture rationale, detailed test results, experiment history,
traces, setup, and troubleshooting in linked PR comments. Keep the description
the canonical summary of the submitted behavior and final evidence. Reuse a
relevant supporting comment instead of accumulating repeated progress reports.
Keep important limits and unresolved decisions visible in the brief.

When editing an existing PR, read its latest body first. Preserve applicable
attachments, discussion, status, and concurrent updates. Move detail that still
matters into a supporting comment before shortening the body, then link it.

Use GitHub attachments for screenshots and videos, for example `gh pr edit` or
`gh pr create` with `--body-file` and `--attach`. Keep media out of the code diff.
Write captions and media references into the body file so uploads appear in the
intended place. Verify the published Markdown, links, and embedded media render.
Report an upload failure without claiming the evidence is attached. Reuse passing
verification while its relevant inputs remain unchanged; relate evidence to the
revision it actually covers.

The one-minute brief is adapted from [pstack's opening-a-PR playbook](https://github.com/cursor/plugins/blob/main/pstack/skills/poteto-mode/playbooks/opening-a-pr.md).
Attachment mechanics: [GitHub CLI media uploads](https://docs.github.com/en/github-cli/github-cli/attaching-files-with-github-cli).
