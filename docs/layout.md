# Layout & spacing

## Spacing is hierarchy

Things that belong together sit closer than things that don't. Use the scale in
`tokens/base.css` and follow three tiers:

| Tier | Tokens | Use |
|---|---|---|
| Inside components | `--space-1`–`--space-3` | Icon to label, label to input |
| Between components | `--space-4`–`--space-6` | Card to card, paragraph to button |
| Between sections | `--section-y` (64–128px) | Clearly bigger than anything inside |

If section spacing is the same as component spacing, the page reads as one long soup.

## Break the centered column

Generated layouts are almost always one centered column. Designed layouts use:

- **Asymmetric splits** — `.sidebar-layout` gives a 5/7 grid; put the heading on the narrow side and the content on the wide side.
- **A consistent left edge** — every section's text starts on the same vertical line.
- **Lists and tables** instead of card grids when content is comparable.
- **Density where it's useful** — dashboards and pricing tables should be dense; marketing sections can breathe.
- **One moment of scale** per page — an oversized number, headline, or image.

## Layout primitives in `components.css`

| Class | What it does |
|---|---|
| `.container` / `--wide` / `--narrow` | Max-width with a fluid gutter |
| `.stack` | Vertical flow; set `--stack` for the gap |
| `.cluster` | Wrapping horizontal group (buttons, tags) |
| `.split` | Two things pushed to opposite ends |
| `.grid` | Responsive auto-fit grid; set `--grid-min` |
| `.sidebar-layout` | 5/7 asymmetric columns above 60rem |
| `.section` | Vertical section rhythm with a hairline between sections |

These are intrinsic: they respond to their container, not just the viewport,
so they need very few media queries. Background: [every-layout.dev](https://every-layout.dev).

## Structure that reads as generated (H, A)

- **The AI nav:** logo left, 4–5 links right, a button, a hairline under a white bar. Try links grouped with the logo (`templates/landing`), a two-tier masthead (`templates/article`), or no bar (`templates/portfolio`).
- **The AI footer:** four link columns, a social row and a tiny copyright. Most sites need one line.
- **Equal rhythm:** every section padded the same with nothing between them. Vary it: a rule, a colour shift, a `.section--field`.
- **Hero fit:** bottom padding ≥ 1.3× top, and headline, lede and primary action visible at 1280×800 without scrolling.
- **Card grids as structure:** cards are the lazy container, and cards inside cards are always wrong (I).

## Responsive checklist

- Test at **390px**, 768px, 1280px, 1920px.
- No horizontal scroll at any width.
- Touch targets ≥ 44×44px.
- Nav collapses without hiding the primary action.
- Tables scroll inside `.table-wrap` rather than breaking the page.
- Grid tracks that hold tables, code, images or `nowrap` text use `minmax(0, 1fr)`, not `1fr` (H).
- Mobile media queries come *after* the rules they override, or out-specify them. Both mistakes caused real overflow bugs in this repo.
- A second sticky element sits below the sticky header (`top: calc(header + gap)`), not at `top: 0` (H).
- Buttons and nav links never wrap to two lines; shorten the label instead (H).
- `npm run check:layout` opens every template in every skin at 390px and 1440px.
