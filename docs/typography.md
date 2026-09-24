# Typography

Typography is 90% of how an interface feels. It's also where default choices
are most visible.

## Pick a pairing with a reason

A pairing = one **display** face (headlines, numbers, brand) + one **text**
face (body, UI). Sometimes they're the same family. Pick for the *voice*
you need, then check it has the weights and language support you need.

| Voice | Display | Text | Used in skin |
|---|---|---|---|
| Literary, trustworthy | Fraunces | Source Serif 4 | editorial |
| Authoritative, neutral | Archivo (800) | Archivo | swiss |
| Loud, structural | Anton (caps) | IBM Plex Sans | brutalist |
| Technical, dense | JetBrains Mono | JetBrains Mono | terminal |
| Warm, crafted | Bricolage Grotesque | Figtree | studio |
| Premium, quiet | Cormorant Garamond | Manrope | noir |
| Calm, precise | Public Sans | Public Sans | clarity |
| Playful, printed | Syne | Work Sans | riso |

More pairings that work (all free):

- **Instrument Serif** + **Instrument Sans** — contemporary editorial
- **Newsreader** + **Inter Tight** — news product
- **Space Grotesk** + **Space Mono** — technical but friendly (overused in 2024; use sparingly)
- **Syne** + **DM Sans** — art/culture
- **Playfair Display** + **Lato** — classic, safe (often *too* safe)
- **Geist** + **Geist Mono** — developer product
- **General Sans** / **Satoshi** / **Cabinet Grotesk** (Fontshare) — characterful grotesks

## Rules that fix most problems

1. **Size contrast.** h1 should be ≥ 2.5× body on desktop. Timid scales look generated.
2. **Tighten big type.** Display sizes need negative tracking (−0.02 to −0.04em) and tight leading (1.0–1.1). Body stays at 0 tracking, 1.5–1.65 leading.
3. **Loosen small caps.** Uppercase labels need +0.06 to +0.12em tracking.
4. **Measure.** Body text 45–75 characters per line. `max-width: var(--measure)`.
5. **Two weights for body.** Regular and one bold (600 or 700). Not five.
6. **`text-wrap: balance`** on headings, **`text-wrap: pretty`** on paragraphs (already in components.css).
7. **Tabular figures** anywhere numbers line up: tables, prices, stats.
8. **Real punctuation.** Curly quotes “ ”, apostrophes ’, en dash – for ranges (1–30), em dash — for breaks, × for multiplication, … ellipsis.
9. **Don't fake bold or italic.** Load the real weights; synthetic bold smears.
10. **Load only what you use.** Each weight is a request. Variable fonts help.

## Fluid type scale

`tokens/base.css` defines `--text-xs` … `--text-5xl` with `clamp()` so type
scales smoothly between 360px and 1440px without breakpoints. To build your
own, use [utopia.fyi/type/calculator](https://utopia.fyi/type/calculator).

## Font loading

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=...&display=swap">
```

For production, self-host with `woff2` and `font-display: swap`, and give the
fallback stack similar metrics (see [modern-font-stacks.com](https://modernfontstacks.com)) to reduce layout shift.
