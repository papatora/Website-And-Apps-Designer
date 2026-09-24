# Color

## Roles, not swatches

Every skin fills the same roles (contract in `skins/_template.css`):

| Role | Job |
|---|---|
| `--bg` | Page background |
| `--surface` | Cards and inputs, one step off the background |
| `--surface-2` | Wells, hovers, code blocks, table row hover |
| `--ink` | Body text. Aim for ≥ 7:1 on `--bg`; ≥ 4.5:1 is required |
| `--ink-muted` | Secondary text. ≥ 4.5:1 on `--bg` and `--surface` |
| `--line` | Hairlines and borders |
| `--accent` | The one thing you want clicked. Keep it to ~5% of any screen (H) |
| `--accent-ink` | Text on `--accent` |
| `--link` *(optional)* | Link text, when the accent can't carry text (yellow, fluoro pink) |
| `--field` / `--field-ink` | A **dominant** brand colour for whole sections: a hero stage, a closing band. Used once or twice per page |
| `--focus` | Focus ring |
| `--success` `--warning` `--danger` | Status only, never decoration |

The split between `--accent` and `--field` settles a disagreement in the
sources. Hallmark wants the accent small. The Anthropic blog says "dominant
colors with sharp accents outperform timid palettes". Real sites do both:
ASML uses deep blue as whole surfaces and yellow as a small mark, and Almost
Pearfect uses a full red field with black type. So a small accent is for
action and a big field is for identity.

## Start from references, not from a hue picker

1. `node tools/find-reference.mjs "<your subject>"` and open two or three guides with `--show`.
2. Look at *how* each uses colour, not *which* colours. Aeon uses colour as a reading key (one hue per subject). Clos des Sens gives each section its own panel colour. Column switches to navy for feature sections.
3. Write your palette as 4–6 named hex values with a job each (A).
4. Check it against the default clusters (A): cream + terracotta; near-black + acid green or vermilion; anything within reach of `#F4F1EA` or `#D97757` (`slop-lint` rule `claude-palette`).
5. `npm run check:contrast` verifies every pair in both modes.

Tools: [oklch.com](https://oklch.com), [Huetone](https://huetone.ardov.me), [Leonardo](https://leonardocolor.io), [Realtime Colors](https://www.realtimecolors.com).

## Black and white

The sources disagree. Hallmark bans pure `#000`/`#fff`. Anthropic flags tinted
near-black (`#0B0B0B`, `#111`) *standing in for* black. Aeon, ASML and Column use
pure black. Our rule: **pure black on purpose, or a clearly hued dark** from the
palette (navy ink `#151a33`, pine `#17261b`, teal-black `#09191a`). Never an
unconsidered near-black. `slop-lint` warns on `#000`/`#0b0b0b`/`#111` outside skin
files (`near-black`).

## Neutrals

Tint neutrals slightly toward the palette's anchor hue. Pure zero-chroma grey
reads as a default (H). A hue shift of a few degrees of chroma is enough; more
than that and the "neutral" becomes a colour.

## Dark mode

- Pick light or dark from the **use scene**: who, where, under what light. Don't pick it by category (I). A dev tool used at night earns dark; a finance dashboard used in an office may not.
- Dark is its own palette. Lift the darkest value, give it a hue, and let surfaces get lighter as they rise instead of adding shadows.
- Desaturate and lighten the accent. Full-saturation brand colours vibrate on dark.
- Re-check contrast. Muted text usually needs to be lighter than you'd guess.
- Skins write both values side by side with `light-dark(LIGHT, DARK)`. Force a mode with `<html data-mode="dark">`.

## Rules

- Colour is never the *only* signal. Pair status colour with text or an icon.
- Links need more than colour. Keep the underline.
- No text on photos without a scrim or a solid band.
- Gradients: only with a reason (a real light source, a map, a data scale), same hue family, never on text, never purple → pink (A, H, W).
