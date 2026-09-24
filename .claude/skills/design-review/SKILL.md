---
name: design-review
description: Review an existing web page, component or app screen for design quality and "AI slop" tells — typography, color, layout, copy, states and accessibility — and return prioritized, concrete fixes. Use when asked to critique, audit, review or de-slop a UI.
---

# Design review

1. **Automated pass.** Run `node tools/slop-lint.mjs <target>` (add `--md` for docs).
   If the project has skins or a theme file with `light-dark()` colors, run
   `node tools/contrast-check.mjs <file>`.
2. **Look at it.** Render at 390px and 1440px if a browser is available.
3. **Manual pass** using `checklists/design-review.md`, in this order:
   hierarchy → typography → color → layout & spacing → copy → states → accessibility → responsive.
4. **Report** as a prioritized list. For each finding:
   - where (file:line or section),
   - what's wrong in one sentence,
   - the specific fix (a value, a class, rewritten copy — not "improve spacing").

   Group as **Must fix** (broken, inaccessible, or an obvious slop tell),
   **Should fix** (clearly better), **Could** (taste).
5. Offer to apply the fixes. If asked, apply them, re-run the linter, and report the before/after score.

Be direct and specific. Praise only what's worth keeping so it survives the next edit.
