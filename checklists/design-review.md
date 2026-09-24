# Design review checklist

Go in order: earlier problems make later ones irrelevant.

## 0. Subject and defaults
- [ ] Could this page belong to a different company in a different field? If yes, it isn't grounded in its subject yet
- [ ] Palette and layout avoid the five default clusters (docs/anti-slop.md §2), or the brief gives a reason
- [ ] No template chrome: caps eyebrows, `A · B · C` meta, `WORD — fragment`, `#0B0B0B` as black, mono labels, `→` on links
- [ ] At least one real reference informed it (`node tools/find-reference.mjs`)

## 1. Hierarchy
- [ ] In 3 seconds, can you tell what this page is and what to do?
- [ ] Exactly one primary action per view, visually dominant
- [ ] Squint test: the important things are still the biggest/darkest

## 2. Typography
- [ ] Deliberate pairing that matches the voice, not an on-distribution default (Inter, Roboto, Lato, Poppins…)
- [ ] No single accented word in a headline; no italic display headings; mono only for code and data
- [ ] h1 ≥ 2.5× body; display sizes tightly tracked and leaded
- [ ] Body 45–75ch per line; line-height 1.5–1.65
- [ ] ≤ 2 weights in body text; tabular numbers where numbers align

## 3. Color
- [ ] Tinted neutrals + one accent; status colors only for status
- [ ] Contrast passes (text 4.5:1, UI 3:1)
- [ ] No gradients / gradient text / glass stacks
- [ ] Accent ≈ 5% of a screen; any dominant colour lives in a `--field` section
- [ ] Black is chosen (pure, or a hued dark), not an unconsidered near-black

## 4. Layout & spacing
- [ ] Values from the spacing scale only
- [ ] Clear tiers: inside component < between components < between sections
- [ ] Shared left edge; not everything centered
- [ ] Density matches the task (dense for tools, airy for reading)
- [ ] Not the default nav (logo left, links right, hairline) or the 4-column footer, unless it's a docs hub
- [ ] Cards aren't the page structure; no cards in cards; elevation declared once
- [ ] No fake device or browser chrome

## 5. Copy
- [ ] Specific headline, verb+object buttons, numbers with context
- [ ] No invented metrics; sample figures are marked or removed
- [ ] No buzzwords, placeholder names, emoji decoration
- [ ] Empty/error/confirmation messages written

## 6. Motion
- [ ] At most one orchestrated moment; no fade-up on every section; no overshoot on UI state
- [ ] No celebratory toast for something already visible

## 7. States
- [ ] hover · focus-visible · active · disabled · loading · empty · error

## 8. Accessibility
- [ ] See `docs/accessibility.md` → Must

## 9. Responsive
- [ ] 390px: nothing overflows, primary action reachable, tap targets ≥ 44px
