---
name: anti-slop-design
description: Design and build a website, landing page, dashboard or app screen that looks deliberately designed rather than AI-generated. Use whenever creating or restyling UI (HTML/CSS, React, Vue, Svelte, Tailwind) — pick a skin, write real copy, apply tokens, then lint for slop.
---

# Anti-slop design

You are building UI with the Website-And-Apps-Designer kit. The goal is an
interface where every visible choice was made on purpose.

## 1. Brief first (do not skip)

Before writing markup, state in 3–5 lines:
- **Who** it's for and **what they must do** on this screen.
- The **one primary action**.
- The **voice** (e.g. literary, technical, warm, premium, loud).
- **Real content**: product name, concrete claims, numbers, people. If the user
  gave none, invent specific and plausible ones — never Lorem ipsum, John Doe or Acme.

## 2. Choose a skin

Read `skins/registry.js`. Match the voice to a skin (editorial, swiss,
brutalist, terminal, studio, noir). If none fits, copy `skins/_template.css`
and fill every variable; then run `node tools/contrast-check.mjs`.

## 3. Build on the system

- Load order: `tokens/base.css` → `skins/<skin>.css` → `components/components.css`.
- Use only tokens for color, space, radius, type size and motion. No raw hex in components.
- Start from the closest template in `templates/` rather than a blank file.
- For React/Tailwind projects: map the skin variables into the theme
  (`colors: { bg: 'var(--bg)', ink: 'var(--ink)', accent: 'var(--accent)' … }`) instead of using palette utilities.

## 4. Hard rules

Follow `docs/anti-slop.md`. In short:
- No gradients (especially purple→pink), no gradient text, no glassmorphism stacks.
- No emoji in headings, bullets or buttons.
- No centered-everything; use asymmetric layouts (`.sidebar-layout`) and a shared left edge.
- No 3-icon-card feature grid by default — prefer numbered steps, tables, or a real UI mock.
- Button labels are verb + object. Headlines name a concrete outcome.
- One accent color. Status colors only for status.
- Every interactive element has hover, focus-visible and disabled states.
- Real UI in the hero (built in HTML) instead of illustrations.

## 5. Verify before you say it's done

```bash
node tools/slop-lint.mjs <changed files or folder>     # must be 0 errors
node tools/contrast-check.mjs                          # if you touched a skin
```

Then view it at 390px and 1440px (use the `run` skill or Playwright if available)
and fix anything that overflows, wraps badly, or loses hierarchy.
Report what you checked and the lint result.
