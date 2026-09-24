# Typography

Typography is 90% of how an interface feels. It's also where default choices
are most visible.

## Pick a pairing with a reason

A pairing = one **display** face (headlines, numbers, brand) + one **text**
face (body, UI). One family is fine when the family has range; if two, make
them clearly distinct (A). Pick for the *voice* of the subject: look at what
real sites in that field use (`node tools/find-reference.mjs "<subject>" --show <domain>`),
then choose a free face with the same character.

| Skin | Display | Text | Mono (code only) | Grounded in |
|---|---|---|---|---|
| editorial | Fraunces | Instrument Sans | JetBrains Mono | aeon.co (serif essay voice over a sober grotesk) |
| swiss | Archivo | Archivo | JetBrains Mono | asml.com (one Neue-Haas-style grotesk, bold and big) |
| brutalist | Anton (caps) | IBM Plex Sans | IBM Plex Mono | almost-pearfect.com (oversized poster display) |
| terminal | Chivo | Chivo | Chivo Mono | ampcode.com (mono only for code; prose in a sans) |
| studio | Bricolage Grotesque | Figtree | JetBrains Mono | bugster.dev (Figtree interface, playful display) |
| noir | Cormorant Garamond | Manrope | IBM Plex Mono | closdessens.com (large display serif, light sans labels) |
| clarity | Public Sans | Public Sans | IBM Plex Mono | column.com (one Swiss-leaning grotesk) |
| riso | Syne | Hanken Grotesk | Space Mono | 247artists.com (tight poster headlines) |

### On-distribution defaults

Every model reaches for these first. Don't use one as the voice of a page
unless the brief asks for it (A, H). `slop-lint` warns on them as the first
family in a `font-family`:

- **Sans:** Inter, Roboto, Open Sans, Lato, Poppins, Montserrat, Nunito, Raleway, DM Sans, Work Sans, Source Sans, Arial, Helvetica, system-ui
- **Serif:** Merriweather, Lora, Source Serif, Playfair Display as body, Georgia as a default
- **Mono:** Courier New, Consolas as a default

Sources disagree at the edges. The Anthropic blog recommends IBM Plex, Source
Sans 3 and Space Grotesk, while Hallmark bans Source Sans. Treat the list as
"needs a reason", not "forbidden".

Free faces with character that the sources recommend: Fraunces, Newsreader,
Instrument Serif/Sans, Bricolage Grotesque, Geist, Syne, IBM Plex, JetBrains
Mono, Chivo, Public Sans, Hanken Grotesk. On Fontshare: Cabinet Grotesk,
General Sans, Satoshi, Sentient.

### Typographic tells (A, H)

- Accenting a single word in a headline (italic, bold, or a colour).
- Italic display headings.
- All-caps labels, and labels above content that doesn't need them.
- Monospace for small labels to look "technical".
- More than three families on a page. Mono counts if used outside code.

## Rules that fix most problems

1. **Size contrast.** h1 should be ≥ 2.5× body on desktop; the Anthropic blog suggests jumps of 3× and weights at the extremes (200 vs 800, not 400 vs 600). Cap display around 5.5rem (H).
2. **Tighten big type.** Display sizes need negative tracking (−0.02 to −0.04em) and tight leading (1.0–1.1). Body stays at 0 tracking, 1.5–1.65 leading.
3. **If you do set capitals** (a skin built on them), give them +0.04 to +0.1em tracking and a line-height of at least 1.0.
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
