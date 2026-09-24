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
- **One orchestrated moment.** A single page-load sequence or one reveal lands better than scattered effects. A fade-and-slide-up on every section, and hover transitions on every card, read as generated (A, I, H).
- **Motion that answers an action is welcome** (opening, expanding, confirming) when it shows what changed (A).
- **No overshoot on UI state.** Keep bouncy easing (`--ease-spring`) for physical interactions like drag and throw (H).
- **Focus rings appear instantly.** Never transition them in (H).
- **Silent success.** If the result is already visible (a count goes up, a row appears), don't add a celebratory toast (H). If you confirm, reuse the action's name: Publish → "Published" (A).
- **Respect `prefers-reduced-motion`.** The tokens drop to 0ms automatically; don't hardcode durations.
- **Loading:** skeletons for layout-shaped content (`.skeleton`), spinners only for short, unknown waits.

Tools: [cubic-bezier.com](https://cubic-bezier.com), [easings.net](https://easings.net), [Motion](https://motion.dev) for JS-driven animation, the View Transitions API for page transitions.
