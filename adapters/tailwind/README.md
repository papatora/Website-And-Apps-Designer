# Tailwind adapter

Use any skin from this kit in a Tailwind project.

| You write | You get |
|---|---|
| `bg-bg` `bg-surface` `bg-surface-2` | Skin backgrounds |
| `text-ink` `text-ink-muted` `text-link` | Skin text colors |
| `bg-accent text-accent-ink` | Primary button |
| `border-line` | Hairlines |
| `text-danger` `text-success` `text-warning` | Status |
| `font-heading` `font-copy` `font-code` | Skin fonts |
| `rounded-skin` `rounded-skin-lg` | Skin radius |
| `shadow-skin` `shadow-skin-lg` | Skin depth |

Tailwind's default palette (`bg-purple-500`, `text-pink-400` …) is removed on
purpose. One accent plus neutrals is the whole point.

## Tailwind v4

```css
/* app.css */
@import "tailwindcss";
@import "../design-kit/tokens/base.css";
@import "../design-kit/skins/studio.css";
@import "../design-kit/adapters/tailwind/theme.css";
```

## Tailwind v3

```js
// tailwind.config.js
module.exports = {
  presets: [require("../design-kit/adapters/tailwind/preset.cjs")],
  content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
};
```

and import `tokens/base.css` + one skin in your global CSS.

In both cases, set the skin on the page: `<html data-skin="studio">`.
