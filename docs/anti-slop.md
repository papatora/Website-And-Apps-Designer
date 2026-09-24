# Anti-slop: what makes an interface look generated, and what to do instead

"AI slop" isn't about who made the site. It's the **absence of decisions**: every
choice left at its default, so the result looks like the average of every site
ever made. People recognise it in under a second, and they trust it less.

The fix is never "add more". It's making the few decisions that the defaults
were making for you, on purpose.

`tools/slop-lint.mjs` flags most of the items below. The rule id is in brackets.

---

## 1. Visual tells

| Tell | Why it reads as generated | Do this instead |
|---|---|---|
| Purple/indigo → pink gradient hero `[purple-gradient]` | It's the default of half the component libraries and AI builders since 2023. | One flat accent from your skin. If you need depth, use a photo of the real thing. |
| Gradient-filled headline text `[gradient-text]` | Decoration standing in for typographic hierarchy. | A better display face, a heavier weight, or more size contrast. |
| Frosted glass on every card `[glassmorphism]` | Theme-demo aesthetic; hurts contrast. | Borders or flat surfaces. Blur only on one thing that actually overlaps content (a sticky header). |
| Everything has `rounded-2xl` + `shadow-xl` `[radius-soup]` `[heavy-shadows]` | Soft, puffy, weightless — nothing sits on the page. | One radius scale per skin. Most surfaces get a 1px line; shadows only for things that float (menus, dialogs). |
| Everything centered `[center-everything]` | Centered text is hard to scan and signals "template". | Flush-left. Asymmetric two-column layouts (5/7 split). Center at most one short headline. |
| The 3-card feature grid with an icon in a tinted circle | The single most repeated section on the internet. | A numbered list, a comparison table, an annotated screenshot, or one feature explained properly. |
| Rainbow of utility colors `[rainbow-utilities]` | Each color was added to "make it pop"; together nothing does. | Neutrals + one accent. Status colors (red/amber/green) only for status. |
| Blob shapes, abstract 3D spheres, stock illustrations `[stock-illustration]` | Filler that says "we had nothing to show". | Show the product. Real UI in the hero beats any illustration. |
| Inter/Poppins/Montserrat as the only face `[overused-font]` | Nothing wrong with them — which is the problem: no point of view. | Pick a display face with character; keep a workhorse for UI text. See [typography.md](typography.md). |
| Emoji as section icons or bullets `[emoji-heading]` `[emoji-bullets]` `[sparkle-rocket]` | ✨🚀 are the house style of generated READMEs and landing pages. | Plain list markers, numbers, or a single consistent icon set drawn at the same stroke width. |
| Dark mode = invert colors | Pure black backgrounds, neon accents at full saturation. | Dark mode is its own palette: lifted blacks, desaturated accents. See [color.md](color.md). |

## 2. Copy tells

| Tell | Instead |
|---|---|
| **Buzzwords** `[buzzword]`: unlock, elevate, seamless, supercharge, empower, revolutionize, next-level, cutting-edge, harness the power | Say the concrete outcome. *"Unlock your team's potential"* → *"Close the month in an afternoon"*. |
| **Vague proof** `[vague-proof]`: "Trusted by thousands", "10x faster" | A real number with its denominator and period: *"1,240 studios in 31 countries"*, *"median 47 minutes, down from 6 hours"*. |
| **Generic CTAs** `[generic-cta]`: Get Started, Learn More, Submit | Say what happens next: *"Start a 30-day trial"*, *"See a sample month-end"*. |
| **Placeholder people** `[placeholder-names]`: John Doe, Acme Inc | Invent specific, plausible names, roles and places. It changes how the design is judged. |
| **Lorem ipsum** `[lorem-ipsum]` | Write the real copy first. Layout depends on real line lengths. |
| Headline → subhead → 3 features → testimonial → CTA, in that order, every time | Order sections by the reader's questions: what is it, is it for me, how does it work, what does it cost, what's the catch. |
| Testimonials with no specifics | Name, role, company size, and one specific result. |

See [copywriting.md](copywriting.md).

## 3. Craft tells (the ones people feel but can't name)

- **No rhythm.** Random spacing values. → Use the spacing scale in `tokens/base.css`, and make section spacing clearly larger than component spacing.
- **Line length too long.** Paragraphs running 120+ characters. → `max-width: var(--measure)` (≈66ch).
- **Weak hierarchy.** Headings only slightly bigger than body. → At least a 2× jump between body and h1; use weight *and* size.
- **Default states only.** No hover, focus, empty, loading or error states. → See [components.md](components.md).
- **`transition: all`** `[transition-all]` and everything eased with the default `ease`. → Name the properties; use `--ease-out` for entrances.
- **Focus outlines removed** `[outline-removed]`. → Keep a visible `:focus-visible` ring.
- **Unaligned edges.** Text in cards not aligned with text outside them. → Shared container and gutter.
- **Stats without context.** "99.9%" of what? → Label, unit, comparison.
- **Numbers in proportional figures in tables.** → `font-variant-numeric: tabular-nums` (`.tabular`).

## 4. A 10-minute de-slop pass

1. Run `npm run lint:slop -- <your-folder>` and fix every error.
2. Delete every gradient. Add back at most one if you miss it.
3. Replace the hero illustration with a real screenshot or a real UI mock built in HTML.
4. Replace every CTA label with a verb + specific object.
5. Rewrite the headline so it names a concrete outcome for a specific person.
6. Turn the 3-card feature grid into a numbered list or a table.
7. Left-align everything except (maybe) one headline.
8. Collapse your radii to one value and your shadows to zero or one.
9. Swap the typeface pairing for one from [typography.md](typography.md).
10. Look at it at 390px wide. Fix what breaks.
