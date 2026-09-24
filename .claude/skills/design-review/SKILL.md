---
name: design-review
description: Review an existing web page, component or app screen for design quality and "AI slop" tells — default palettes, template chrome, typography, layout, copy, motion, states and accessibility — and return prioritized, concrete fixes with their sources. Use when asked to critique, audit, review or de-slop a UI.
---

# Design review

1. **Automated pass.** `node tools/slop-lint.mjs <target>` (add `--md` for docs). If there's a theme with `light-dark()` colours, `node tools/contrast-check.mjs <file>`.
2. **Look at it** at 390px and 1440px if a browser is available.
3. **Default-cluster check** (docs/anti-slop.md §2). Does the palette or layout sit on one of the five clusters? Is there template chrome (caps eyebrows, `·` meta, `WORD — fragment`, near-black, mono labels, `→` suffixes)?
4. **Manual pass** with `checklists/design-review.md`, in order: subject fit → hierarchy → typography → colour → layout → copy → motion → states → accessibility → responsive.
5. **Compare to reality.** Find 1–2 real sites in the same field (`node tools/find-reference.mjs "<subject>"`) and name one thing they do that this page could borrow.
6. **Report** as a prioritized list. For each finding give:
   - where (file:line or section);
   - what's wrong, in one sentence, with the source key (A/I/H/F) when it comes from the research;
   - the specific fix (a value, a class, rewritten copy, not "improve spacing").

   Group as **Must fix** (broken, inaccessible, or an obvious generated-UI tell), **Should fix**, and **Could** (taste).
7. Offer to apply the fixes. If asked, apply them, re-run the linter and layout check, and report before/after.

Remember that the brief wins. A default the brief explicitly asks for is not a finding.
