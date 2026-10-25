# decide-with-html

An Agent Skill (Cursor + Claude Code) that turns open UI/scope/design questions into a **self-contained interactive HTML doc**. Instead of asking design questions in chat, the agent generates a page with real visual mockups of each option. You open it in a browser, click an option per question, add comments, hit **Copy summary**, and paste the result back.

Beats chat questions for visual decisions — you choose faster from tangible mockups than from prose.

## What the generated doc gives you

- Clickable option cards (radio) with the recommendation pre-selected and badged
- A "Needs more info / discuss" escape hatch on every question
- Number-key picking, per-question comment boxes
- Live summary with one-click **Copy summary** / **Copy as Markdown** (warns on unanswered)
- Progress meter, **Reset**, and refresh-safe `localStorage` autosave

Visual style is a deliberate "editorial design-memo": Fraunces + Hanken Grotesk + Geist Mono, ink-on-warm-paper, vermillion accent, paper grain, staggered load.

## Files

| File | Role |
|------|------|
| `SKILL.md` | Skill entry: when to use, the workflow, hand-off. |
| `template.html` | The self-contained doc. Edit **only** the `DOC` config block; the CSS + engine below it are fixed. |
| `reference.md` | `DOC` schema + the mock-class catalog for building mockups. |
| `example.html` | A complete worked doc — open it, and read its `DOC` for reference. |

## Install

This repo is the source of truth. Symlink it into each runtime's skills dir:

```sh
# clone wherever you keep portable agent assets, e.g.
git clone <remote> ~/.agents/skills/decide-with-html

ln -s ~/.agents/skills/decide-with-html ~/.cursor/skills/decide-with-html
ln -s ~/.agents/skills/decide-with-html ~/.claude/skills/decide-with-html
```

Then invoke with `/decide-with-html <topic>`, or just describe a UI/scope decision and the agent picks it up.

## Usage (what the agent does)

1. Copy `template.html` to a scratch path (e.g. `~/.cache/decide-with-html/<feature>.html`).
2. Replace the `DOC` object with the feature's questions, options, and mockups (see `reference.md`).
3. `node --check` the script, then open it and hand off.
4. You decide in the browser and paste the summary back; the agent writes the spec from it.
