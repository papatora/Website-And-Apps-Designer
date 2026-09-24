# Website & Apps Designer

Skins, templates, references and tools for building websites and apps that
**look designed, not generated**.

Most "AI slop" isn't caused by AI. It comes from decisions nobody made: the
statistical defaults of the training data. This kit is built on published
research into those defaults (Anthropic's `frontend-design` skill, Impeccable,
Hallmark) and on 1,160 design guides of real websites (Fudge DESIGN.md). See
[`docs/research.md`](docs/research.md) for the sources and where they disagree.

- **8 skins**, each built on the design DNA of a real website, in light and dark, all passing WCAG AA
- **8 templates** (landing, dashboard, mobile app, portfolio, article, docs, product page, sign-in), written with real copy
- **1 component layer** that restyles itself to any skin
- **`slop-lint`**: 41 rules for the patterns that make a UI look machine-made, each tagged with its source
- **`find-reference`**: searches 1,160 real-site design guides by subject, so a design starts from real references instead of memory
- **`contrast-check`**: verifies every skin's color pairs in both modes
- **Adapters** for Tailwind (v3 and v4), React, and Figma (design tokens JSON)
- **Claude Code skills**, prompts and checklists so AI tools follow the same rules

Plain HTML and CSS. No build step, no runtime dependencies.

## Quick start

```bash
npm run dev                  # gallery at http://localhost:4321
node tools/find-reference.mjs "bakery"      # real sites to learn from
npm run new -- --list        # see templates and skins
npm run new -- --template landing --skin editorial --out ../my-site
npm run lint:slop -- ../my-site
```

Open any template with `?skin=<id>` to preview it in another skin, e.g.
`/templates/dashboard/?skin=brutalist`. The floating switcher also toggles light and dark.

## Skins

| Skin | Built on | Type | Good for |
|---|---|---|---|
| `editorial` | aeon.co: black on white, serif essay voice, one deep red | Fraunces + Instrument Sans | Publications, essays, research |
| `swiss` | asml.com: deep blue fields, bold grotesk, yellow marks | Archivo | Engineering, architecture, B2B |
| `brutalist` | almost-pearfect.com: poster wall, red field, caps | Anton + IBM Plex Sans | Indie brands, events, labels |
| `terminal` | ampcode.com: teal-tinted dark, amber action, mono for code | Chivo + Chivo Mono | Dev tools, infra, APIs |
| `studio` | bugster.dev: cool paper, electric blue, lime highlights | Bricolage Grotesque + Figtree | Consumer apps, creator tools |
| `noir` | closdessens.com: forest-black, ochre, section panels | Cormorant Garamond + Manrope | Restaurants, hotels, fashion |
| `clarity` | column.com: grey canvas, navy ink, deep teal | Public Sans | Fintech, banking, healthcare |
| `riso` | 247artists.com + real Riso inks | Syne + Hanken Grotesk | Events, print fairs, education |

Each skin takes a reference's *logic* (how it uses colour, type roles, layout
idea), never its exact values. The links to each reference's guide are in
`skins/registry.js` and on the gallery page.

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
docs/                      research (sources), anti-slop guide, typography, color, layout, motion, copy, a11y, components, references
checklists/                design review + ship checklists
prompts/                   system prompt, design brief, section recipes for any AI tool
tools/                     slop-lint · find-reference · contrast-check · export-tokens · new-project · layout-check · serve
.claude/skills/            anti-slop-design · design-review · scaffold-site
```

## Example: a finance site built with the kit

[`examples/celengan`](examples/celengan) is a finance landing page (in Indonesian) built by following
the process end to end: a subject, real references found with `find-reference`, a written plan, a
review against the default clusters, then lint, contrast and browser checks. It includes a
Cloudflare Workers config, so `npx wrangler@latest deploy --temporary` puts it online for 60 minutes
without an account.

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
