---
name: anti-slop-design
description: Design and build a website, landing page, dashboard or app screen that looks deliberately designed rather than AI-generated. Use whenever creating or restyling UI (HTML/CSS, React, Vue, Svelte, Tailwind). Grounds the design in real reference sites, plans before building, checks the plan against the known default clusters, then lints and screenshots.
---

# Anti-slop design

Generated UI looks generated because every choice is the statistical default
of its training data (docs/research.md). The fix is a process: ground the
design in the subject, study real references, plan, review the plan against
the defaults, then build and verify. Sources: Anthropic `frontend-design`,
Impeccable, Hallmark, Fudge DESIGN.md.

**The brief wins.** If the user pins a look, font or palette, follow it
exactly, even when it matches a default cluster.

## 1. Subject and mode

State in a few lines:
- the **subject** (industry, materials, vernacular), the **audience**, and the page's **one job**;
- the **visitor mode**: Persuade (landing, pricing), Operate (app, dashboard, settings), Read (docs, articles) or Experience (portfolio, gallery);
- the **real content**: names, claims, numbers. If the user gave none, invent plausible ones and mark them as samples. Never Lorem ipsum, John Doe or Acme, and never invented metrics presented as real.

## 2. Study real references (don't design from memory)

```bash
node tools/find-reference.mjs "<subject or mood>"      # real sites in this space
node tools/find-reference.mjs --show <domain>          # their palette, type, avoid-list
```

Pick 2–3. Note their DNA: how they use colour (a reading key? section
panels? one field colour?), their type roles, and their layout idea. Don't
copy hex values or clone a site. If the network is unavailable, say so and
reason from the skins' documented references in `skins/registry.js`.

## 3. Plan

- **Colour:** 4–6 named hex values, each with a job. Say whether there's a dominant `--field` colour.
- **Type:** one or two families with distinct roles. Mono only for code and data.
- **Layout:** one sentence plus an ASCII sketch; alignment (default flush-left).
- **Principle:** one sentence on what makes this page unlike others in its category. Spend boldness in one place.

Map it to the closest skin in `skins/registry.js`, or copy `skins/_template.css` for a custom one.

## 4. Review the plan before building

Check it against the default clusters (docs/anti-slop.md §2):
1. cream + serif + terracotta;
2. near-black + one acid green or vermilion;
3. hairline broadsheet, zero radius, dense columns;
4. identical rounded cards + grey shadow + gradient washes;
5. template chrome: caps eyebrows, `A · B · C`, `WORD — fragment`, `#0B0B0B`, mono labels, `→` on links.

If any part lands on a cluster without a reason from the brief, revise it and
say what you changed and why.

## 5. Build on the system

- Load order: `tokens/base.css` → `skins/<skin>.css` → `components/components.css`. Start from the closest template in `templates/`.
- Only tokens for colour, space, radius, type and motion. No mid-build hex values.
- **Tailwind:** `adapters/tailwind` (`bg-accent`, `text-ink-muted`, `font-heading`, `rounded-skin`), never palette utilities. **React:** `adapters/react/index.jsx`.
- No eyebrow above headings. No emoji or ★▲ glyph icons. No fake device or browser chrome. No gradient text. No side-stripe callouts. Elevation is declared once (border *or* shadow).
- One orchestrated motion moment at most; no fade-up on every section; no toast for an effect that's already visible.
- Real UI or real imagery in the hero, never a stock illustration or a stat block by default.

## 6. Verify, fix once, stop

```bash
node tools/slop-lint.mjs <changed files or folder>   # 0 errors; justify any warning you keep
node tools/contrast-check.mjs                        # if you touched a skin
npm run check:layout                                 # templates in this repo (needs Playwright)
```

Screenshot at 390px and 1440px if a browser is available. Fix everything the
screenshots show in one batch, confirm once, and stop polishing (I). Report
what you checked, the lint result, and which references you drew on.
