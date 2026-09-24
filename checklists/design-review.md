# Design review checklist

Go in order — earlier problems make later ones irrelevant.

## 1. Hierarchy
- [ ] In 3 seconds, can you tell what this page is and what to do?
- [ ] Exactly one primary action per view, visually dominant
- [ ] Squint test: the important things are still the biggest/darkest

## 2. Typography
- [ ] Deliberate pairing that matches the voice
- [ ] h1 ≥ 2.5× body; display sizes tightly tracked and leaded
- [ ] Body 45–75ch per line; line-height 1.5–1.65
- [ ] ≤ 2 weights in body text; tabular numbers where numbers align

## 3. Color
- [ ] Tinted neutrals + one accent; status colors only for status
- [ ] Contrast passes (text 4.5:1, UI 3:1)
- [ ] No gradients / gradient text / glass stacks

## 4. Layout & spacing
- [ ] Values from the spacing scale only
- [ ] Clear tiers: inside component < between components < between sections
- [ ] Shared left edge; not everything centered
- [ ] Density matches the task (dense for tools, airy for reading)

## 5. Copy
- [ ] Specific headline, verb+object buttons, numbers with context
- [ ] No buzzwords, placeholder names, emoji decoration
- [ ] Empty/error/confirmation messages written

## 6. States
- [ ] hover · focus-visible · active · disabled · loading · empty · error

## 7. Accessibility
- [ ] See `docs/accessibility.md` → Must

## 8. Responsive
- [ ] 390px: nothing overflows, primary action reachable, tap targets ≥ 44px
