# Website & Apps Designer

Skins, templates, references and tools for building websites and apps that
**look designed, not generated**.

Most "AI slop" isn't caused by AI. It comes from decisions nobody made: the
default font, the default gradient, the default three-card section, the
default copy. This kit makes those decisions for you, explains why, and gives
you a linter that catches them when they creep back in.

- **8 skins**: complete visual identities (type pairing, palette, shape, depth) in light and dark, all passing WCAG AA
- **8 templates** (landing, dashboard, mobile app, portfolio, article, docs, product page, sign-in), written with real copy
- **1 component layer** that restyles itself to any skin
- **`slop-lint`**: flags the patterns that make a UI look machine-made
- **`contrast-check`**: verifies every skin's color pairs in both modes
- **Adapters** for Tailwind (v3 and v4), React, and Figma (design tokens JSON)
- **Claude Code skills**, prompts and checklists so AI tools follow the same rules

Plain HTML and CSS. No build step, no runtime dependencies.

## Quick start

```bash
npm run dev                  # gallery at http://localhost:4321
npm run new -- --list        # see templates and skins
npm run new -- --template landing --skin editorial --out ../my-site
npm run lint:slop -- ../my-site
```

Open any template with `?skin=<id>` to preview it in another skin, e.g.
`/templates/dashboard/?skin=brutalist`. The floating switcher also toggles light and dark.

## Skins

| Skin | Voice | Type | Good for |
|---|---|---|---|
| `editorial` | Literary, trustworthy | Fraunces + Source Serif 4 | Publications, essays, law & finance |
| `swiss` | Authoritative, neutral | Archivo | Agencies, architecture, serious products |
| `brutalist` | Loud, structural | Anton + IBM Plex Sans | Indie tools, zines, events |
| `terminal` | Technical, dense (dark-first) | JetBrains Mono | Dev tools, infra dashboards, docs |
| `studio` | Warm, crafted | Bricolage Grotesque + Figtree | Consumer apps, small businesses |
| `noir` | Premium, quiet (dark-first) | Cormorant Garamond + Manrope | Fashion, hospitality, portfolios |
| `clarity` | Calm, precise | Public Sans | Fintech, healthcare, B2B, public services |
| `riso` | Playful, printed | Syne + Work Sans | Creative events, community, education |

Every skin implements the same contract (`skins/_template.css`), so any
template or component works with any skin. Colors are written once as
`light-dark(#light, #dark)`. Force a mode with `<html data-mode="dark">`.

## Structure

```
tokens/base.css            spacing, fluid type, radius, motion, z-index scales
skins/*.css                one identity per file, scoped to [data-skin="…"]
skins/registry.js          skin metadata + font URLs
components/components.css  buttons, forms, cards, badges, nav, tables, stats, prose, layout primitives
templates/*/index.html     landing · dashboard · mobile-app · portfolio · article · docs · shop · auth
tokens/figma/*.json        every skin as W3C design tokens (generated)
adapters/tailwind/         Tailwind v4 theme.css + v3 preset.cjs
adapters/react/            SkinProvider, Button, Badge, Card, Field, Stat, Callout, Eyebrow
docs/                      anti-slop guide, typography, color, layout, motion, copy, a11y, components, references
checklists/                design review + ship checklists
prompts/                   system prompt, design brief, section recipes for any AI tool
tools/                     slop-lint · contrast-check · export-tokens · new-project · serve
.claude/skills/            anti-slop-design · design-review · scaffold-site
```

## Using it in other stacks

- **Tailwind**: see [`adapters/tailwind`](adapters/tailwind/README.md). You get classes like `bg-accent`, `text-ink-muted`, `font-heading` and `rounded-skin`, and the default rainbow palette is removed.
- **React**: see [`adapters/react`](adapters/react/README.md). `<SkinProvider skin="studio">`, `<Button variant="primary">`, `<Field label error>` and more.
- **Figma**: import `tokens/figma/<skin>.json` with the Tokens Studio plugin. Regenerate after editing a skin with `npm run tokens`.

## Using it with AI tools

- **Claude Code**: open this repo and the skills in `.claude/skills/` are available. Ask it to
  *"build a pricing page for X"*, *"review this page for slop"*, or *"scaffold a portfolio in the noir skin"*.
  To use the skills in other projects, copy them to `~/.claude/skills/`.
- **Cursor, v0, Lovable, Bolt, ChatGPT**: paste `prompts/system-prompt.md` into the tool's custom instructions,
  and fill in `prompts/design-brief.md` before your first prompt.
- **Any agent**: `AGENTS.md` points it at the rules.

## slop-lint

```bash
node tools/slop-lint.mjs src/ --max-warnings 10
node tools/slop-lint.mjs --rules          # list all rules
```

It catches purple gradients, gradient text, emoji headings and bullets, buzzwords
("unlock", "seamless", "elevate"…), Lorem ipsum, placeholder names, vague proof
("trusted by thousands"), generic CTAs, `transition: all`, removed focus outlines,
images without alt, clickable divs, radius soup, glassmorphism stacks, rainbow
utility palettes and raw-hex sprawl. Each rule is explained in [`docs/anti-slop.md`](docs/anti-slop.md).
Silence a line with a `slop-ok` comment.

## Contributing

`npm run check` runs the tests, the contrast check, the token freshness check and the linter. It must pass.
`npm run check:layout` opens every template in every skin at phone and desktop width in a real browser
(needs Playwright: `npm i --no-save playwright && npx playwright install chromium`). CI runs both.
See [`CLAUDE.md`](CLAUDE.md) for conventions on adding skins, templates and lint rules.
