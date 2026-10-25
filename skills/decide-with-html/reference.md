# decide-with-html — reference

Detail for filling the `DOC` object and building mockups. The skill workflow is in [SKILL.md](SKILL.md).

## DOC schema

```js
const DOC = {
  id: "feature-slug",          // REQUIRED. Stable slug → localStorage key. Keep constant across edits.
  meta: "scoping draft · not a spec",   // small tag line at the top
  title: "Feature — what's being decided",
  subtitle: "1–2 sentence framing.",    // the lede; HTML allowed
  locked: [                    // OPTIONAL. Settled context rendered as a callout. HTML per item. Omit/[] if none.
    "<b>Decided thing</b> — context, not debate.",
  ],
  preview: {                   // OPTIONAL hero mockup above the questions. Delete the key if unused.
    title: "What it looks like",
    mock: `<div class="mock">…</div>`,
    legend: `<span>…</span>`,  // optional, rendered in a .legend row under the mock
  },
  questions: [ /* see below */ ],
};
```

### Question (options type)

```js
{
  id: "q1",                    // REQUIRED, stable
  title: "The question?",
  intro: "<p>Framing. HTML ok.</p>",   // optional
  recommend: "1A",             // optional: option id to pre-select + badge "recommended"
  recommendNote: "Why.",       // optional: rendered as the "My lean" margin note
  options: [ /* 2–3 options */ ],
}
```

### Question (free type)

```js
{ id: "q9", title: "Anything else?", type: "free", intro: "<p class='small'>…</p>" }
```

Renders just a comment box — no options. Use for the trailing "anything else" and for genuinely open-ended questions. Free questions don't count toward the progress meter.

### Option

```js
{
  id: "1A",                    // REQUIRED. Short key shown on the card + in the summary.
  title: "Option name",
  size: "S",                   // optional pill: "S"|"M"|"L" (or "S–M"); S→green, M→amber, L→red
  desc: "<p class='small'>One-liner.</p>",   // optional
  mock: `<div class="mock">…</div>`,         // optional but strongly preferred — the whole point
  pros: ["…", "…"],            // optional
  cons: ["…"],                 // optional
  reuse: "Existing code it leans on.",       // optional, rendered as a "Reuse:" line
}
```

A **"Needs more info / discuss"** option is auto-appended to every options question — never author one yourself.

### Behavior notes

- `recommend` only pre-selects if the user has no saved pick (their localStorage choice always wins).
- Number keys `1..9` pick within the question the cursor is over (the auto "needs more info" option isn't number-addressable).
- Copy output is plain text or Markdown; both warn if any options question is unanswered.

## Mock-class catalog

Mockups are plain HTML using these classes (all themed by CSS variables, so they adapt to the palette). Compose freely and add inline styles (e.g. `style="grid-template-columns: 200px repeat(3, 74px)"`).

### Frame
- `.mock` — bordered, rounded container (`position: relative` so popovers/toasts anchor inside).
- `.hdr` — top bar. Children: `.crumb` (bold), `.sep` (dim slash), `.path` (mono chip).
- `.legend` — row of muted captions under a mock (use `DOC.preview.legend` or inline).

### Matrix / grid
- `.mx` — grid wrapper; set `grid-template-columns` inline. Uses `subgrid`.
- `.toolbar` — header strip; cells `.tcell`.
- `.colhdr` — column header (mono, uppercase). Inside: `.menu` (⋯), `.grab` (⠿).
- `.addcol` — accent "+" trailing column.
- `.row` — a data row. First cell `.label`; modifiers `.folder` (accent icon), `.indent`, `.indent2`. Icon span `.ico`.
- `.cell` — body cell (centers its content).
- `.cb` — checkbox box. Modifiers: `.on` (filled accent ✓), `.part` (partial –), `.ro` (read-only dim). For a blank, put `&nbsp;` inside.

### Popovers / menus / dialogs
- `.pop` — floating panel (shadowed). Position inline (`top/left/right`). Children: `.ttl`, `.field` (with `<label>` + `.inp` or `.sel`), `.actions`. **`.mock` is `overflow:hidden`, so an absolutely-positioned popover that extends past the frame gets clipped.** Give the mock enough body (extra rows / a bottom spacer) that the popover fits inside — `popover top + popover height ≤ mock height`.
- `.menupop` — context menu (combine with `.pop`). Items `.mi` (+ `.danger`, `.dim`); separator `.div`.
- `.toast` — bottom-centered notification inside a mock; `.u` = accent action (e.g. Undo).

### Buttons / pills
- `.btn` — small button; modifiers `.accent`, `.danger`.
- `.pill` — rounded tag; `.s`/`.m`/`.l` tint green/amber/red.

### Tokens (use in inline styles)
`var(--fg)` `var(--fg-2)` `var(--muted)` `var(--muted-2)` `var(--accent)` `var(--accent-fg)` `var(--green)` `var(--amber)` `var(--red)` `var(--purple)` `var(--bg)` `var(--panel)` `var(--panel-2)` `var(--border)` `var(--border-soft)` `var(--chip)` `var(--radius)` `var(--mono)` `var(--sans)` `var(--display)`.

Prefer tokens over hardcoded colors so mockups stay consistent with the theme. To tint, use `color-mix(in srgb, var(--accent) 14%, transparent)`.

## Example

A complete worked `DOC` (CRUD/folders feature, 3 options questions + a free one) is bundled as [example.html](example.html) — read its `DOC` block for a realistic reference of mockups and copy. Open it in a browser to see the rendered result.
