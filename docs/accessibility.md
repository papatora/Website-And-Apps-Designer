# Accessibility baseline

Accessibility isn't a separate phase; it's most of what "well made" means.
This is the floor every template in this repo meets.

## Must

- [ ] Text contrast ≥ 4.5:1 (≥ 3:1 for 24px+ or 19px bold). UI boundaries and focus rings ≥ 3:1. → `npm run check:contrast`
- [ ] Visible `:focus-visible` style on everything interactive. Never `outline: none` without a replacement.
- [ ] Every interactive thing is a `<button>` or `<a href>`. No clickable `<div>`.
- [ ] Every input has a `<label>` (visually hidden is OK). Placeholders aren't labels.
- [ ] Images: meaningful `alt`, or `alt=""` if decorative. SVG charts get `role="img"` + `aria-label`.
- [ ] One `<h1>`; heading levels don't skip.
- [ ] Landmarks: `<header>`, `<nav aria-label>`, `<main id="main">`, `<footer>`, plus a skip link.
- [ ] `<html lang>` set.
- [ ] Touch targets ≥ 44×44px.
- [ ] Color never the only signal (status badges have text; links are underlined).
- [ ] Works at 200% zoom and 320px width without horizontal scroll.
- [ ] `prefers-reduced-motion` respected.

## Should

- [ ] Full keyboard pass: Tab through the page; order matches visual order; nothing traps focus except open dialogs.
- [ ] Screen reader pass with VoiceOver (⌘F5) or NVDA on the main flow.
- [ ] Form errors announced (`aria-invalid`, `aria-describedby` pointing at the message).
- [ ] `aria-current="page"` on the current nav item.

## Tools

[WebAIM contrast checker](https://webaim.org/resources/contrastchecker/) ·
[axe DevTools](https://www.deque.com/axe/devtools/) ·
[WAVE](https://wave.webaim.org) ·
[A11y Project checklist](https://www.a11yproject.com/checklist/) ·
[Inclusive Components](https://inclusive-components.design)
