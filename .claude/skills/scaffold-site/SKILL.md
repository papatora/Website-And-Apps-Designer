---
name: scaffold-site
description: Start a new website or app prototype from this kit — pick a template (landing, dashboard, mobile-app, portfolio, article) and a skin, copy them into a standalone folder, then replace the sample copy with the user's real content. Use when the user wants a new site, page or prototype.
---

# Scaffold a site

1. Ask (or infer from the request) the **template** and the **voice**. Map voice to a skin:
   editorial (literary), swiss (authoritative), brutalist (loud), terminal (technical),
   studio (warm), noir (premium). Run `node tools/new-project.mjs --list` to see options.
2. Scaffold:
   ```bash
   node tools/new-project.mjs --template <t> --skin <s> --out <folder>
   ```
3. Replace **all** sample copy (Ledgerline, Hollis & Oke, Handover, Margins) with the
   user's content. Keep the structure only where it serves their content; delete
   sections that don't apply rather than filling them with filler.
4. Follow the `anti-slop-design` skill for any new sections.
5. Run `node tools/slop-lint.mjs <folder>` and fix every error before handing back.
