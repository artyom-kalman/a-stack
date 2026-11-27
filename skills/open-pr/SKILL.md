---
name: open-pr
description: Open or update a pull request and publish its verification evidence. Use for PR delivery, screenshots or recordings, and edits to PR titles, descriptions, or supporting comments.
---

# Open PR

Use [development-workflow](../development-workflow/SKILL.md) for the full
implementation flow. For a focused edit, read the current PR body and preserve
applicable content and attachments. If asked for draft copy, return it without
publishing.

## Evidence for the PR

For a visible change, show the resulting state in the running app on the
revision being submitted. Use a screenshot for a visible state and a short
recording when the action or transition matters. Label fixture data, mocked
services, and before/after states when they affect interpretation. For nonvisual
work, retain relevant test output, input and output examples, or logs.

For database schema changes, include a **Database schema diff** in the PR body.
Use a side-by-side before/after table for the affected schema against the PR
base. Highlight changed fields, types, optionality, and indexes. Add a small ERD when
relationships change. Explain what happens to existing records and whether a
migration or backfill is needed.

For changes to MCP behavior, exercise the changed journey through the intended
client or host against the submitted revision in a test environment. Use the
project's live MCP testing guidance when available. Include a **Live MCP
verification** section in the PR body with the tested commit, host, environment,
transport, tool calls and observed outcomes, and links to sanitized evidence.
Report SDK-only checks as integration evidence and identify mocked dependencies.
If the intended host could not be tested, state the specific blocker and behavior
still unverified.

Reuse captures that still cover the submitted behavior. Plan to collect new
media during the acceptance check. Use synthetic or approved data for published
captures.

## Publish

Confirm the intended repository, base, and task branch. Review the diff against
the base and check for an existing PR. Use the existing PR when it covers the
task. Open a draft when requested or when the review evidence is still pending.

Write a short outcome title and explain why the change exists, what reviewers
should inspect, and what the checks actually showed. For detailed descriptions
or supporting comments, see [PR writing guidance](references/pr-writing.md).

Upload screenshots and recordings as PR attachments and embed them in the
description beside the behavior they demonstrate. Use short captions and keep
media out of the code diff. Use the configured PR tools to manage the PR. If
they accept only Markdown, use a supported, authorized media upload route and
embed the returned URLs. Where GitHub CLI is the configured route for PR media,
see [GitHub CLI media uploads](https://docs.github.com/en/github-cli/github-cli/attaching-files-with-github-cli).

Link the PR with the host when supported. Check the published head, base, and
description. For a visible change, verify that the embedded screenshots render
or the recording plays with reviewer access. Keep the PR in draft while
required evidence is missing or unverified. Link the draft and name the specific
capture, upload, or access blocker.
