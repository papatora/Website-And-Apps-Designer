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

## Responsive checklist

- Test at **390px**, 768px, 1280px, 1920px.
- No horizontal scroll at any width.
- Touch targets ≥ 44×44px.
- Nav collapses without hiding the primary action.
- Tables scroll inside `.table-wrap` rather than breaking the page.
