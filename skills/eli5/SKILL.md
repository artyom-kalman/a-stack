---
name: eli5
description: Explain a topic like I'm a 5 year old. Use when user needs dead-simple explanation for a topic or struggles to understand something
argument-hint: "<topic>"
---

# eli5

Explain like I'm someone who knows nothing about this topic, using a HTML artifact with big pictures and few words.

Topic: $ARGUMENTS

If `$ARGUMENTS` is empty, use the topic from the user's message.

## Output

Write one self-contained HTML file. Pictures carry the idea. Words are captions.

1. Save under `~/.cache/eli5/<slug>.html` (create the dir if missing). Fresh filename so you don't clobber an earlier explainer. Keep git clean: do not write into the repo unless the user asks.

2. Open it.

   ```sh
   xdg-open "$F" 2>/dev/null || open "$F" 2>/dev/null || start "" "$F" 2>/dev/null
   ```

3. Chat: one markdown link to the absolute path. No paste of the HTML.
