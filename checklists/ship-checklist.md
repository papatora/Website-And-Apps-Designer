# Ship checklist

Run through this before anything goes live.

## Automated
- [ ] `node tools/slop-lint.mjs <site>` → 0 errors
- [ ] `node tools/contrast-check.mjs` passes for your skin
- [ ] Lighthouse: Accessibility ≥ 95, Best Practices ≥ 95, CLS < 0.1

## Content
- [ ] No sample copy left (search for Ledgerline, Hollis, Handover, Margins, example.com)
- [ ] Every headline names a concrete outcome; every button is verb + object
- [ ] Every number has a unit, denominator or comparison
- [ ] Spelling checked; real punctuation (’ “ ” – — …)
- [ ] `<title>` and `<meta name="description">` written per page; Open Graph image set

## Design
- [ ] One accent color; neutrals do the structural work
- [ ] One radius, borders over shadows
- [ ] Section spacing clearly larger than component spacing
- [ ] Hover, focus-visible, active, disabled, loading, empty, error states exist
- [ ] Looks right at 390, 768, 1280 and 1920px; no horizontal scroll
- [ ] Dark mode checked (or explicitly disabled with `data-mode="light"`)

## Technical
- [ ] Only the fonts and weights you use are loaded; `display=swap`
- [ ] Images sized, compressed (AVIF/WebP), `loading="lazy"` below the fold, with `width`/`height`
- [ ] Preview-only scripts removed (`registry.js`, `skin-switcher.js`)
- [ ] Favicon, 404 page, `robots.txt`
- [ ] Keyboard-only pass of the main flow
