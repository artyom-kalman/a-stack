---
name: code-readability
description: Simplify changed code while preserving behavior. Use during implementation finishing, refactoring, or requests to make code easier to read.
---

# Code readability

Make this change understandable using our approved examples. Remove unnecessary
indirection, duplicate decisions, and hidden state. Preserve behavior. Explain
what became easier to understand.

Read [the examples](references/examples.md) before the pass. They illustrate
specific choices. Follow the current repository conventions when they differ.

## Review the changed code

For a PR-wide pass, inspect every changed file in the full PR diff, not just
uncommitted edits. Prioritize the reader's question and report changed areas
left dense. Inspection does not require changing every file.

- Prefer early exits and shallow control flow. Use explicit branches for
  business decisions; avoid nested ternaries. A simple value expression is fine
  when it is immediately readable.
- Separate logical steps with blank lines. Wrap long conditions, calls, and
  object literals so the reader can scan each part. More lines are acceptable.
- Keep state local and explicit. Derive values instead of maintaining another
  copy. Represent distinct states clearly.
- Keep each business rule in one place. Reuse the canonical helper. Extract a
  function when its name explains a meaningful operation or it hides real
  complexity; collapse pass-through wrappers that add only another jump.
- Keep names tied to the domain. Prefer direct code over a generic mechanism
  for a single concrete case.
- Keep tests readable through concrete inputs and independently chosen expected
  results, as in the test example.

## Comments

- Explain non-obvious decisions, constraints, and external limitations.
- Remove comments that narrate obvious code or repeat names.
- Turn enforceable constraints into types, checks, or tests.
- Fix confusing code before adding a comment to explain it.

## Make the smallest useful change

Work within the change and its necessary callers. Use existing behavior tests
or capture the relevant baseline before moving structure. Make small changes
and rerun the checks that can detect a behavior change. Formatting alone needs
no new tests. Do not weaken checks to make a refactor pass.

Stop when the requested change is clear and verified. Do not manufacture a
refactor, grow a new framework, or move complexity across more files just to
make each file shorter. Report the concrete improvement in one sentence when
useful. No quality score or required walkthrough.
