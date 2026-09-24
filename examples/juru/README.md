# Juru (demo)

A three-page site for a sample AI project: meeting minutes for Indonesian
teams whose meetings mix Bahasa Indonesia and English. Built with this kit to
test its process on the category most prone to AI slop: AI products.
Juru is not a real product; the meeting, people and every figure are examples.

| Page | Mode | What it shows |
|---|---|---|
| `index.html` | Persuade | Transcript and minutes side by side; click a note to see its source line; replay the meeting |
| `cara-kerja.html` | Read | Six-step pipeline, components, evaluation, known limits, when not to use it |
| `privasi.html` | Read | What is stored, for how long, who can see it; export and delete |

**Process** (docs/anti-slop.md §1):
1. Subject and mode as above.
2. References via `node tools/find-reference.mjs "voice"`: wisprflow.ai, voiceos.com, withdavid.ai. What was taken, and what was deliberately not taken, is in `public/css/skin.css`.
3. Plan: the accent is a yellow highlighter ("stabilo") that also marks decisions in the product; each speaker has a colour used everywhere; Newsreader display over Schibsted Grotesk, mono only for timestamps; dark sections in deep teal.
4. Cluster review: none matched, and none of the AI-product clichés (purple, sparkles, chat bubbles, glowing orbs, "AI-powered").
5. Verified with `slop-lint`, `contrast-check` (including speaker colours) and a browser pass at 320–1440px.

Live: https://papatora.github.io/Website-And-Apps-Designer/juru/
