# Research: what makes a UI look generated

The first version of this kit was written from memory. When we checked it
against published research, it turned out to sit right on the defaults that
research describes. Five of eight skins used a cream background. `studio` was
cream with a terracotta accent. `terminal` was near-black with acid green. Every
template had tracked-out capital labels above its headings. This page records
what we read, what the sources agree and disagree on, and what we changed.

Source keys used across the repo (`slop-lint --rules`, `docs/anti-slop.md`):
**A** Anthropic · **I** Impeccable · **H** Hallmark · **F** Fudge DESIGN.md · **W** Adam Wathan.

## Primary sources (read in full)

| Key | Source | What it is |
|---|---|---|
| A | [anthropics/skills, `frontend-design/SKILL.md`](https://github.com/anthropics/skills/blob/main/skills/frontend-design/SKILL.md) | Anthropic's own design skill. It lists the five clusters generated design falls into and the typographic treatments it calls "the commonest tells". |
| A | [Improving frontend design through Skills](https://claude.com/blog/improving-frontend-design-through-skills) (Anthropic blog) | The fonts to avoid and the recommended families, colour and motion guidance, and the "generic AI patterns". |
| I | [pbakaus/impeccable](https://github.com/pbakaus/impeccable), especially `skill/reference/craft-floor.md` | Paul Bakaus's design skill (40k+ stars). It has a quality floor, a "Refuse" list, and four visitor modes: Persuade, Operate, Read, Experience. |
| H | [nutlope/hallmark](https://github.com/Nutlope/hallmark), especially `references/slop-test.md`, `anti-patterns.md`, `typography.md`, `color.md` | Together AI's anti-slop skill: 58 gates covering visual, structure, microinteraction, contrast, chrome, honesty, token and mobile rules. |
| F | [scroobius-pip/fudge-design-md](https://github.com/scroobius-pip/fudge-design-md) (MIT) | 1,160 DESIGN.md guides reverse-engineered from real websites. We read aeon.co, asml.com, almost-pearfect.com, ampcode.com, bugster.dev, closdessens.com, column.com, 247artists.com and banjos.com.au. |
| W | [Adam Wathan on X](https://x.com/adamwathan/status/1953510802159219096), August 2025 | Tailwind's creator apologised for making every Tailwind UI button `bg-indigo-500`, "leading to every AI generated UI on earth also being indigo." |

## Secondary sources (search results only)

Our sandbox's network policy blocked dev.to, medium.com, 925studios.co,
developersdigest.tech and prg.sh, so we saw only their search summaries. They
agree with the primary sources and add nothing we rely on:
[The Purple Gradient Problem](https://dev.to/james_anderson_h/the-purple-gradient-problem-why-ai-ui-all-looks-alike-and-how-to-fix-it-3j65),
[AI Slop Fonts and Gradients](https://www.925studios.co/blog/ai-slop-design-tells),
[AI Design Slop: 16 Patterns](https://www.developersdigest.tech/blog/ai-design-slop-and-how-to-spot-it),
[Why AI Websites All Look the Same](https://axe-web.com/insights/ai-website-design-sameness/).

## The central finding

All of the primary sources describe the same underlying problem. Generated UI is
**the statistical default of its training data**: Tailwind examples, templates
and component-library demos. The individual choices aren't wrong. The problem
is that nobody chose them.

> "All traits are legitimate for some briefs, but they are defaults rather than choices, and they appear regardless of subject." (A)

> "The brief wins. Honor pinned aesthetics, eras, materials, fonts, and palettes even when they conflict with a saturated-pattern warning." (I)

The real sites in Fudge confirm this. Aeon uses pure black and tracked capital
utility labels. Column uses uppercase section labels. ASML and Almost Pearfect
fill whole sections with one saturated color. The sources flag every one of
these as a tell, yet on those sites they work, because each one comes from the
subject rather than from a default.

So the fix is a **process**, not a list of bans:

1. **Ground the design in its subject** (A): its industry, materials and vernacular.
2. **Study real references** (F, H `study`): `node tools/find-reference.mjs "<subject>"`.
3. **Write a short plan**: 4–6 named hex values, typefaces and their roles, a layout sketch, principles (A).
4. **Review the plan against the default clusters** before building, and revise anything generic (A).
5. **Build, then screenshot at phone and desktop width, fix once, and stop** (A, I).

## The default clusters (A, verbatim summary)

Generated design currently clusters around:

1. a warm cream background (near `#F4F1EA`) with a high-contrast serif and a terracotta accent (near `#D97757`);
2. a near-black background with one bright acid-green or vermilion accent;
3. a broadsheet layout with hairline rules, zero radius and dense columns;
4. the SaaS card kit: identical rounded cards, one radius, the same grey shadow, gradient washes;
5. template chrome: an ALL-CAPS eyebrow above every heading, meta joined with middle dots (`A · B · C`), `WORD — fragment` labels, tinted near-black (`#0B0B0B`) standing in for black, monospace for small data labels, and `→` appended to links.

## What the sources agree on

| Tell | A | I | H | Lint rule |
|---|:-:|:-:|:-:|---|
| Purple/indigo gradients, gradient text | ✓ | ✓ | ✓ | `purple-gradient`, `gradient-text` |
| Inter / Roboto / Open Sans / Lato / system font as the voice | ✓ |  | ✓ | `overused-font` |
| Eyebrow or kicker above headings, all-caps labels | ✓ | ✓ (ban) | ✓ | `eyebrow-label`, `caps-tracked-labels` |
| Identical icon + heading + text card grids, cards in cards | ✓ | ✓ | ✓ | *(review)* |
| Hero-metric template (big number, small label, stats) | ✓ | ✓ | ✓ | *(review)* |
| 01 / 02 / 03 markers on non-sequences | ✓ | ✓ | ✓ | `numbered-markers` |
| One word in the headline set in italic or a colour | ✓ |  | ✓ | `accent-word-headline` |
| Fade-up entrance on every section | ✓ | ✓ | ✓ | `fade-up-everywhere` |
| Thick coloured side-stripe on cards and callouts |  | ✓ | ✓ | `side-stripe` |
| Glassmorphism as decoration |  | ✓ | ✓ | `glassmorphism` |
| Emoji or Unicode glyphs as icons | ✓ | ✓ | ✓ | `emoji-*`, `glyph-icon` |
| Re-drawn chrome (fake phone frame, browser bar, traffic lights) |  |  | ✓ | `fake-chrome` |
| Monospace as a "technical" costume | ✓ | ✓ | ✓ | *(review)* |
| Hard offset shadows outside a neobrutalist world |  | ✓ |  | `hard-offset-shadow` |
| Bouncy easing on UI state changes |  |  | ✓ | `bouncy-ease` |
| `transition: all`, animating layout properties |  |  | ✓ | `transition-all` |
| Invented metrics ("10×", "trusted by thousands") |  | ✓ | ✓ | `vague-proof` |
| Celebratory toast for an effect already visible |  |  | ✓ | *(review)* |
| Generic CTAs; errors that apologise or are vague | ✓ | ✓ | ✓ | `generic-cta` |
| Horizontal scroll, two-line buttons, `1fr` tracks that won't shrink |  |  | ✓ | `check:layout` |

## Where the sources disagree, and what we decided

**Pure black and white.** Hallmark bans pure `#000` and `#fff`. Anthropic flags
tinted near-black (`#0B0B0B`, `#111`) *standing in for* black. Aeon, ASML and
Column use pure black. **Our rule:** use pure black on purpose, or pick a clearly
hued dark from the palette (navy ink, pine, teal-black). Never an unconsidered
`#0b0b0b`. `near-black` warns only outside skin files.

**How much colour.** Hallmark keeps the accent to about 5% of a screen. The
Anthropic blog says "dominant colors with sharp accents outperform timid
palettes". ASML, Almost Pearfect and Clos des Sens fill whole sections with one
colour. **Our rule:** these are two different jobs. The skin contract now has
`--field`/`--field-ink` for a dominant brand colour on whole sections, used once
or twice a page. `--accent` stays small and marks the action.

**Fonts.** The Anthropic blog recommends IBM Plex, Source Sans 3 and Space
Grotesk. Hallmark lists Source Sans, Work Sans and DM Sans among its banned
defaults. **Our rule:** `overused-font` is a warning, not an error. Skins avoid
both lists, and we swapped Source Serif 4 and Work Sans out of `editorial` and
`riso`.

**Uppercase labels.** All three skills flag them, and Impeccable bans the
eyebrow outright. Aeon, ASML and Column use uppercase labels. **Our rule:** off
by default. A skin built on capitals (brutalist) may use them, scoped to
`[data-skin]`, and the linter allows that scope.

## What we changed in this repo

**Skins.** All eight were rebuilt, each from a real reference's DNA (how it uses
colour, its type roles and its layout idea), never its exact values. None sits
in a default cluster:

| Skin | Before | After | Reference |
|---|---|---|---|
| editorial | cream, serif, oxblood, serif body | black on white, serif display over Instrument Sans, one deep red, a black "stage" field | aeon.co |
| swiss | near-black + signal red | white canvas, deep ultramarine fields, yellow marks; dark mode is the blue field | asml.com |
| brutalist | cream + yellow | white sheets, one red field, browser-blue links, block shadows (earned here) | almost-pearfect.com |
| terminal | near-black + acid green, mono everywhere | teal-tinted dark, amber action, mint for status only, mono for code only | ampcode.com |
| studio | cream + terracotta | cool paper, navy ink, electric blue, lime highlight field | bugster.dev |
| noir | near-black + brass | forest-black ground, ochre, deep-green section field | closdessens.com |
| clarity | generic blue SaaS | grey canvas, navy ink, deep teal, navy feature sections | column.com |
| riso | cream + pink + offset shadows | real Riso inks (Federal Blue, Fluorescent Pink, Yellow), no fake shadows | 247artists.com |

**Templates.**
- Removed every decorative eyebrow, middle-dot meta string, `WORD — fragment` label and ★/▲ glyph icon.
- Removed the fake phone frame and status bar.
- Removed the celebratory toast.
- Replaced the half-screen accent panel and the side-stripe callouts.
- Varied the navigation away from the default "logo left, links right, hairline" bar.
- Marked all sample figures as fictional.
- Hero padding is now heavier at the bottom, sticky panels sit below the sticky header, and display text wraps long words.

**Tools.**
- 19 new `slop-lint` rules (41 in total), each tagged with its sources.
- `find-reference.mjs` searches the Fudge guides by subject.
- A `field` pair in the contrast check and the token export.

## Limits

- Fudge guides are reverse-engineered from screenshots. Treat their values as approximate, and check font licences before use.
- The Adam Wathan quote is cited from reporting of the post; x.com was not fetched directly.
- The sources are skills written for AI agents in 2025–2026. They describe *today's* defaults, which will move.
