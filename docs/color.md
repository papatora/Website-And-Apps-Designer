# Color

## The palette is small on purpose

Every skin uses the same eleven roles:

| Role | Job |
|---|---|
| `--bg` | Page background |
| `--surface` | Cards, inputs — one step off the background |
| `--surface-2` | Wells, hovers, code blocks, table row hover |
| `--ink` | Body text. ≥ 7:1 on `--bg` ideally, ≥ 4.5:1 required |
| `--ink-muted` | Secondary text. ≥ 4.5:1 on `--bg` and `--surface` |
| `--line` | Hairlines and borders |
| `--accent` | The one thing you want clicked. Primary buttons, links, highlights |
| `--accent-ink` | Text on top of `--accent` |
| `--link` *(optional)* | Link text, when the accent can't carry text (e.g. yellow) |
| `--focus` | Focus ring. Usually blue — it's a convention, not a brand moment |
| `--success` `--warning` `--danger` | Status only. Never decoration |

If you want a second accent, you probably want more contrast in your neutrals.

## Building a palette

1. **Start with neutrals.** Tint them 2–4% toward your accent's hue. Pure grey (`#808080`) looks like a default; warm or cool greys look chosen.
2. **Avoid pure black and pure white.** `#0b0b0b` on `#f7f7f5` reads crisper and calmer than `#000` on `#fff`.
3. **Pick one accent** that works as a button fill *and* has ≥ 4.5:1 contrast with its label.
4. **Check it.** `npm run check:contrast` verifies every pair in both modes.

Tools: [oklch.com](https://oklch.com), [Huetone](https://huetone.ardov.me), [Realtime Colors](https://www.realtimecolors.com), [Leonardo](https://leonardocolor.io).

## Dark mode is a second palette, not an inversion

- Background around `#0c`–`#1a` lightness, not `#000`. Pure black makes surfaces impossible to layer.
- **Surfaces get lighter as they rise**, instead of getting shadows.
- **Desaturate and lighten the accent.** A brand color at full saturation vibrates on dark.
- Body text slightly off-white (`#e8e4dc`), not `#fff`.
- Re-check contrast; muted text usually needs to be *lighter* than you'd guess.

Skins write both values side by side with `light-dark(LIGHT, DARK)`, so the
two palettes stay in sync. Force a mode with `<html data-mode="dark">`.

## Rules

- Color is never the *only* signal. Pair status color with text or an icon.
- Links must be distinguishable from body text by more than color — keep the underline.
- Don't put text on photos without a scrim or a solid band.
- Gradients: if you must, same hue family, small lightness change, large area. Never purple → pink.
