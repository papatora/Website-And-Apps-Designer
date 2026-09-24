# Website-And-Apps-Designer

A kit for building websites and apps that look designed, not generated:
skins (design tokens), templates, a component layer, reference docs, and
zero-dependency Node tools.

## Layout
- `tokens/base.css` — scales (space, type, radius, motion). No colors.
- `skins/*.css` — one file per skin, scoped to `[data-skin="id"]`, colors as `light-dark(#light, #dark)`. Contract in `skins/_template.css`. Metadata in `skins/registry.js`.
- `components/components.css` — reads only skin variables + tokens. No raw colors.
- `templates/<name>/index.html` — plain HTML; preview any skin with `?skin=<id>`.
- `docs/` — design guidance; `docs/anti-slop.md` is the core.
- `tools/` — `slop-lint.mjs`, `contrast-check.mjs`, `new-project.mjs`, `serve.mjs`.
- `.claude/skills/` — `anti-slop-design`, `design-review`, `scaffold-site`.

## Commands
- `npm run dev` — preview server at http://localhost:4321
- `npm run check` — tests + contrast + slop-lint (must pass before committing)
- `npm run new -- --template landing --skin studio --out ../site`

## Conventions
- No build step, no runtime dependencies. Node ≥ 18 for tools.
- Adding a skin: copy `_template.css`, fill every variable, add it to `registry.js`, run `npm run check:contrast`.
- Adding a template: link tokens → skin (`id="skin-css"`) → components, include `registry.js` and `_shared/skin-switcher.js`, write real copy, and add it to the gallery in `index.html`.
- New slop-lint rules need a case in `tests/fixtures/sloppy.html` and must not fire on `tests/fixtures/clean.html`.
- Templates must lint at 0 errors and 0 warnings.
