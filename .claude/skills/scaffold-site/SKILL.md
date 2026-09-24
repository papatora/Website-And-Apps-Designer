---
name: scaffold-site
description: Start a new website or app prototype from this kit — pick a template (landing, dashboard, mobile-app, portfolio, article, docs, shop, auth) and a skin, copy them into a standalone folder, then replace the sample copy with the user's real content. Use when the user wants a new site, page or prototype.
---

# Scaffold a site

1. Find 2–3 real references for the subject first: `node tools/find-reference.mjs "<subject>"`.
   Then ask (or infer) the **template** and the **voice**, and map the voice to the skin whose
   reference (`skins/registry.js` → `reference`) is closest:
   editorial (aeon.co), swiss (asml.com), brutalist (almost-pearfect.com), terminal (ampcode.com),
   studio (bugster.dev), noir (closdessens.com), clarity (column.com), riso (247artists.com).
   If none fits, make a custom skin from `skins/_template.css` instead of forcing one. Run `node tools/new-project.mjs --list` to see options.
2. Scaffold:
   ```bash
   node tools/new-project.mjs --template <t> --skin <s> --out <folder>
   ```
3. Replace **all** sample copy (Ledgerline, Hollis & Oke, Handover, Margins, Van Heusden, Pressroom) with the
   user's content. Keep the structure only where it serves their content; delete
   sections that don't apply rather than filling them with filler.
4. Follow the `anti-slop-design` skill for any new sections.
5. Remove every sample figure you can't replace with a real one. Don't ship invented metrics.
6. Run `node tools/slop-lint.mjs <folder>` and fix every error before handing back.
