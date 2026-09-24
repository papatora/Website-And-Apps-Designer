# Motion

Motion should explain *what happened*, not decorate. If you can't say what an
animation communicates, remove it.

## Durations and easing (from `tokens/base.css`)

| Token | Value | Use |
|---|---|---|
| `--dur-1` | 120ms | Hover, press, color changes |
| `--dur-2` | 200ms | Toggles, small reveals, tooltips |
| `--dur-3` | 320ms | Drawers, panels, dialogs |
| `--dur-4` | 500ms | Page-level transitions (rare) |
| `--ease-out` | fast start, soft landing | Things entering |
| `--ease-in-out` | symmetric | Things moving from A to B |
| `--ease-spring` | slight overshoot | Playful confirmation (sparingly) |

## Rules

- **Animate `transform` and `opacity`.** Not `width`, `height`, `top`, or `all`.
- **Exit faster than enter** (~70% of the duration).
- **Distance small.** 4–12px slide-ins, not 100px.
- **No scroll-triggered fade-up on every section.** It's the motion equivalent of the purple gradient. Reveal only what benefits from sequencing.
- **Respect `prefers-reduced-motion`.** The tokens drop to 0ms automatically; don't hardcode durations.
- **Loading:** skeletons for layout-shaped content (`.skeleton`), spinners only for short, unknown waits.

Tools: [cubic-bezier.com](https://cubic-bezier.com), [easings.net](https://easings.net), [Motion](https://motion.dev) for JS-driven animation, the View Transitions API for page transitions.
