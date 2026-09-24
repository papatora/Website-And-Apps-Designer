# Component states

Generated UIs ship the happy path. Designed UIs ship every state. For each
component, design and build:

| Component | States to cover |
|---|---|
| Button | default · hover · active/pressed · focus-visible · disabled · loading |
| Input | empty · placeholder · filled · focus · invalid + message · disabled · read-only |
| List / table | loading (skeleton) · empty (with first action) · one item · many items · error · overflowing text |
| Card | default · hover (if clickable) · selected · long title · missing image |
| Page | first visit · returning · no permission · offline · 404 · 500 |
| Async action | idle · pending · success confirmation · failure with retry |

## Classes in `components/components.css`

Buttons `.btn` `.btn--primary` `.btn--ghost` `.btn--sm` `.btn--lg` ·
Forms `.field` `.input` `.select` `.textarea` `.check` `.hint` `.error` ·
Surfaces `.card` `.card--flat` `.card--well` ·
Labels `.badge` `.badge--accent|success|warning|danger` `.dot` `.meta` (a date, byline or breadcrumb, never a decorative label above a heading) ·
Data `.table` `.table-wrap` `.num` `.stat` `.stat__value` `.stat__delta--up|down` ·
Feedback `.callout` `.callout--danger` `.skeleton` ·
Navigation `.nav` `.nav__inner` `.nav__brand` `.nav__links` `.skip-link` ·
Text `.display` `.lead` `.muted` `.mono` `.tabular` `.prose` `kbd` ·
Sections `.section--field` (the skin's dominant brand colour, once or twice per page) ·
Icons `.icon` (sizes an inline SVG to the text)

### Elevation

Cards declare elevation once: a border. Only a world built on block shadows
(brutalist) sets `--card-shadow`. A 1px border under a wide soft shadow is the
"ghost card" (I). `--shadow-2` is for things that float: menus, popovers.

Every component reads only skin variables, so it adapts to all six skins.
Skin-specific overrides (e.g. brutalist's pressed-button offset) live at the
bottom of each component block as `[data-skin="…"] .component`.

## Icons

Pick one set and stay in it: same stroke width, same corner style, same size grid. Never Unicode glyphs (★ ▲ ●) or emoji in place of icons (I, H); `slop-lint` flags them.
[Lucide](https://lucide.dev) · [Phosphor](https://phosphoricons.com) · [Tabler](https://tabler.io/icons) · [Heroicons](https://heroicons.com).
Size icons to the text they sit next to (16px beside 14px text, 20px beside 16px).
