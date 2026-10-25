---
name: explain-diff-html
description: Create a rich, self-contained interactive HTML explanation of a code change, diff, branch, or pull request. Use when the user asks to explain or teach a code change in depth, especially when an HTML artifact with diagrams and a comprehension quiz would help.
---

# Explain Diff

Produce a single, self-contained HTML explainer for the specified change. First inspect the diff and enough surrounding code to explain both the former system and the reasons for the change. Write for a beginner while keeping the directly relevant explanation useful to an experienced reader.

## Output

- Save the HTML outside the repository in a global temporary location. Name it `/tmp/YYYY-MM-DD-explanation-<slug>.html`, using today's date and a concise slug.
- Tell the user the created file path.
- Keep the document one long page: do not use top-level tabs. Include a table of contents and responsive CSS.
- Embed all CSS and JavaScript; do not depend on external assets, frameworks, CDNs, or network access.

## Required sections

### Background

Explain the relevant existing system before discussing the patch. Begin with optional beginner-friendly context, then narrow to the components, data flow, and prior behavior that the change touches. Explore adjacent code rather than relying on the diff alone.

### Intuition

Explain the essential idea before implementation details. Use small, concrete toy examples and reusable visual diagrams. Prefer simple HTML/CSS diagrams for UI states, components, and example data flows; never use ASCII diagrams.

### Code

Walk through the changes at a high level, grouping them by purpose rather than diff order. Explain important trade-offs, edge cases, and how the changed pieces connect. Use `<pre>` for code excerpts; ensure every code block preserves whitespace with `white-space: pre` or `pre-wrap`.

### Quiz

Add five medium-difficulty multiple-choice questions that test real understanding of the change. Each question must be interactive: after a choice is clicked, show whether it is correct and explain why. Do not use trick questions.

## Writing and visual design

- Write in a clear, engaging, classic explanatory style: connect ideas with smooth transitions and define terms before relying on them.
- Use callouts for definitions, key concepts, caveats, and edge cases.
- Reuse a small number of diagram families throughout the page so the explanation feels coherent.
- Verify the artifact before handoff: open or inspect the generated HTML, confirm it is self-contained, and scan all code-block styles for `white-space: pre` or `pre-wrap`.
