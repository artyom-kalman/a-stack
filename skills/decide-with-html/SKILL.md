---
name: decide-with-html
description: >-
  Builds a interactive HTML doc for making UI, scope, or design
  decisions: visual option cards the user clicks, per-question comment boxes, and
  a one-click-copy summary they paste back. 
  The user decides faster seeing real mockups side by side. Triggers: "decide with html", 
  "make an options doc", "design options", "show me mockups", "/decide-with-html".
argument-hint: "<feature / topic to decide>"
---

## When to use

- A feature's architecture/data-model is settled but **UI shape, scope, or design choices remain**.
- The user says "decide with html", "options doc", "show me mockups", "design options".

Skip for: factual lookups, a single yes/no, or non-visual decisions where one chat question is faster.

## How it works

`template.html` (next to this file) is a complete, self-contained doc: editorial theme, CSS, and the interactive engine (selection, comments, live summary, copy, progress, localStorage, keyboard). **You edit exactly one thing** — the `const DOC = {…}` object in the marked `CONTENT` block near the top of the `<script>`. Never touch the CSS or the engine code below `DOC`.


## Steps

1. **Settle non-visual decisions first.** Lock architecture, data model, and naming in chat or a spec. The doc is only for the *open* visual/scope choices. List the settled ones in `DOC.locked` as context.

2. **Copy the template.** `cp ~/.agents/skills/decide-with-html/template.html ~/.cache/decide-with-html/<feature-slug>.html` (create the dir if missing). Saving under `~/.cache/` keeps the repo's git status clean. Pick a fresh filename so you don't clobber an earlier doc on the same feature.

3. **Write mockups, not prose — in the target app's own look.** Each option's `mock` is real HTML reproducing the actual UI — the grid, dialog, menu, toast, panel. Use the mock-class catalog in [reference.md](reference.md). A mockup the user can picture beats three bullets. Reuse markup from prior docs in the repo if any exist.

   **Make mocks resemble the real product, not the doc's editorial theme.** Before writing them: (a) read the actual component(s) you're depicting in the project so the structure, labels, and class layout match what ships; (b) sample the project's design tokens — its `globals.css`/`:root` CSS variables, Tailwind/shadcn theme, or equivalent 

4. **Fill `DOC`.** Follow the schema in [reference.md](reference.md). Per option give honest pros/cons and a `reuse` note (what existing code it leans on). Set `recommend` to your lean — it pre-selects (still changeable) and is badged. End with a free-form "Anything else?" question (`type: "free"`).

6. **Offer to open it.** 

   ```sh
   xdg-open "$F" 2>/dev/null || open "$F" 2>/dev/null || start "" "$F" 2>/dev/null
   ```

   - `xdg-open` or `gio open` — Linux/BSD
   - `open` — macOS
   - `start` — Windows

7. **On return,** turn the pasted decisions into the spec / task breakdown / implementation.

## Notes

- Keep `id`s stable across edits of the same doc — they key the user's saved answers (`localStorage`). Changing an `id` orphans their prior input for that question.
