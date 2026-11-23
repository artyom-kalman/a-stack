---
name: open-pr
description: Open or update a pull request and publish its verification evidence. Use for PR delivery, screenshots or recordings, and edits to PR titles, descriptions, or supporting comments.
---

# Open PR

For PR delivery, plan evidence before verification. For a focused edit to an
existing PR, read its latest body, preserve applicable content and attachments,
make the requested edit, and verify the result. Reuse captures that still cover
the submitted behavior. If asked for draft copy, return it without publishing.

## Capture evidence during verification

For a visible change, show the resulting state in the running app on the
revision being submitted. Use a screenshot for a visible state and a short
recording when the action or transition matters. Label fixture data, mocked
services, and before/after states when they affect interpretation. For nonvisual
work, retain relevant test output, input and output examples, or logs.

Reuse applicable captures. Capture media during the actual acceptance check
and avoid extra model or service calls solely to record a demo.

## Publish

Confirm the intended repository, base, and task branch. Review the diff against
the base and check for an existing PR. Use the existing PR when it covers the
task. Open a draft when requested or when the review evidence is still pending.

Write a short outcome title and explain why the change exists, what reviewers
should inspect, and what the checks actually showed. For detailed descriptions
or supporting comments, see [PR writing guidance](references/pr-writing.md).

Upload screenshots and recordings as PR attachments and embed them in the
description beside the behavior they demonstrate. Use short captions and keep
media out of the code diff. Use the configured host tools for the PR. For media
uploads, use the host's attachment flow. Where GitHub CLI is used for the PR,
see [GitHub CLI media uploads](https://docs.github.com/en/github-cli/github-cli/attaching-files-with-github-cli).

Link the PR with the host when supported. Check the published head, base, and
description. For a visible change, confirm the embedded screenshots render or
the recording plays before calling the PR ready for review. If capture or
upload fails, report the specific gap and return the PR link.
