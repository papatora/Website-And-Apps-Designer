# Anti-slop: what makes an interface look generated, and what to do instead

"AI slop" isn't about who made the site. It's the **absence of decisions**:
every choice left at the statistical default of the training data, so the
result looks like the average of every template ever published. People
recognise it in under a second, and they trust it less.

Everything below comes from published sources, not taste. See
[research.md](research.md) for the sources, where they disagree, and what we
decided. `[rule-id]` is the `slop-lint` rule that catches the tell. Source keys:
**A** Anthropic · **I** Impeccable · **H** Hallmark · **F** Fudge real-site guides.

> None of these is forbidden. Real, well-designed sites use several of them
> (Aeon uses pure black and caps labels). They are **defaults, not choices**.
> Use one when the brief or the subject gives you a reason, never because
> it's what comes out first. (A, I)

---

## 1. Start from the subject, not from a template

The single biggest fix happens before any code (A, I, H):

1. **Name the subject, audience and job** of the page.
2. **Pick the visitor mode** (I): *Persuade* (landing, pricing), *Operate* (app, dashboard, settings), *Read* (docs, articles), *Experience* (portfolio, gallery).
3. **Study 2–3 real references**: `node tools/find-reference.mjs "<subject>"`, then `--show <domain>`. Take the DNA, not the hexes.
4. **Plan**: 4–6 named hex values, typefaces and their roles, a layout sketch, one sentence on what makes this page unlike others.
5. **Review the plan against the default clusters below.** If it lands on one without a reason, revise it and say what changed.
6. Build → `slop-lint` → screenshot at 390px and 1440px → fix everything in one pass → stop (A, I).

## 2. The default clusters (A)

If your plan looks like one of these, you haven't made a choice yet:

1. **Cream + serif + terracotta.** Background near `#F4F1EA`, a high-contrast serif, and a clay accent near `#D97757` (Anthropic's own accent) `[claude-palette]`.
2. **Near-black + one acid green or vermilion.**
3. **Broadsheet.** Hairline rules, zero radius, dense newspaper columns.
4. **SaaS card kit.** Identical rounded cards, one radius everywhere, the same `rgba(0,0,0,.1)` shadow, gradient washes.
5. **Template chrome.** ALL-CAPS eyebrows `[eyebrow-label]`, `A · B · C` meta `[middot-meta]`, `WORD — fragment` labels `[em-dash-label]`, `#0B0B0B` standing in for black `[near-black]`, monospace on small labels, `→` on links `[arrow-suffix]`.

## 3. Visual tells

| Tell | Instead | Rule | Src |
|---|---|---|---|
| Purple/indigo → pink/cyan gradients (Tailwind's `indigo-500` legacy) | One flat accent from the skin | `purple-gradient` | A H W |
| Gradient-filled headline text | Weight, size, a better face | `gradient-text` | I H |
| Inter, Roboto, Open Sans, Lato, Poppins, Montserrat, Arial as the voice | A face chosen for the subject; see [typography.md](typography.md) | `overused-font` | A H |
| Kicker/eyebrow above every heading; tracked capital labels | Delete it and let the heading speak | `eyebrow-label` `caps-tracked-labels` | A I H |
| One word of a headline in italic, bold or a colour | Let the whole line carry the weight | `accent-word-headline` | A H |
| Identical icon + heading + two-line text cards as the page | Numbered steps (only if it's a sequence), a comparison table, one feature in depth | *(review)* | A I H |
| Big number + small label + stats as the hero | A headline that says what it is; real UI | *(review)* | A I H |
| 01 / 02 / 03 markers | Only for real sequences, as plain numerals | `numbered-markers` | A I |
| Glass and blur as decoration | Flat surfaces; blur only on something that truly overlaps | `glassmorphism` | I H |
| Thick coloured stripe on one side of a card or callout | A full hairline or a tinted well | `side-stripe` | I H |
| A 1px border *and* a soft shadow on the same card ("ghost card") | Declare elevation once | *(review)* | I |
| Zero-blur block shadow outside a neobrutalist world | No shadow, or a real soft one for floating layers | `hard-offset-shadow` | I |
| Emoji or ★ ▲ ● glyphs as icons | One drawn icon set at one stroke weight | `emoji-*` `glyph-icon` | I H |
| Hand-drawn phone frames, browser bars, traffic lights | Show the screen itself or a real screenshot | `fake-chrome` | H |
| Monospace as a "technical" costume | Mono for code, data and measurements only | *(review)* | A I H |
| Accent colour filling half the screen | Accent at ~5%; use `--field` for a dominant brand section | *(review)* | H A |
| Aurora blobs, floating orbs, decoration with no meaning | Decoration that encodes something, or none | *(review)* | H |
| Light or dark picked by category ("dev tool = dark") | Pick it from the use scene: who, where, what light | *(review)* | I |

## 4. Structure tells

| Tell | Instead | Src |
|---|---|---|
| Hero → 3 features → testimonial → CTA → 4-column footer | Order sections by the reader's questions | A H |
| The "AI nav": logo left, 4–5 links right, button right, hairline under a white bar | Group links with the logo, a two-tier masthead, or no bar at all | H |
| Everything centred | Flush-left; asymmetric columns; at most two centred elements | H |
| Sections separated by identical whitespace | Vary rhythm; a rule, a colour shift, a field section | H |
| Hero padding equal top and bottom | Bottom ≥ 1.3× top, and it fits a 1280×800 screen | H |
| A second sticky element at `top: 0` under a sticky header | Offset it by the header height | H |

## 5. Motion tells

| Tell | Instead | Rule | Src |
|---|---|---|---|
| Fade-and-slide-up entrance on every section | One orchestrated moment, or motion that answers an action | `fade-up-everywhere` | A I H |
| Hover transitions on every card; the same `scale-105` everywhere | Feedback that fits each control | `hover-scale` | A H |
| Bouncy/overshoot easing on buttons, menus, dialogs | Exponential ease-out; overshoot only for drag and throw | `bouncy-ease` | H |
| `transition: all`; animating width, height, padding | Name the properties; animate transform and opacity | `transition-all` | H |
| Focus rings that fade in | Focus appears instantly | | H |
| Celebratory toast for something already visible | Silent success, or change the button label in place | | H |

## 6. Copy tells

| Tell | Instead | Rule | Src |
|---|---|---|---|
| unlock, elevate, seamless, supercharge, empower… | The concrete outcome, for whom, by how much | `buzzword` | |
| "Trusted by thousands", "10× faster", invented stats | A real, sourced number with its denominator, or no number | `vague-proof` | H |
| Get started / Learn more / Submit | Verb + object; the same name through the flow (Publish → Published) | `generic-cta` | A |
| John Doe, Acme, Nexus | Specific, plausible names; mark samples as samples | `placeholder-names` | H |
| Lorem ipsum | Real copy first; layout depends on it | `lorem-ipsum` | |
| Errors that apologise or stay vague | Say what happened and how to fix it | | A I |
| Three periods, straight quotes, double hyphens | … “ ” ’ — | `ellipsis-dots` | H |

More in [copywriting.md](copywriting.md).

## 7. The craft floor (I, H)

These are not style; they're the minimum:

- Body text 4.5:1, large text and focus rings 3:1 → `npm run check:contrast`
- Body measure 45–75ch; display tracking no tighter than −0.04em
- Every interactive element has hover, focus-visible, active and disabled states; forms have error and empty states
- Error text has a reserved line so it doesn't push the page when it appears
- Text selection, caret, scrollbar, focus ring and tabular numerals are themed from the palette
- No horizontal scroll at any width; `minmax(0, 1fr)` on grid tracks holding tables, code or images; buttons never wrap to two lines → `npm run check:layout`
- `prefers-reduced-motion` respected

## 8. A 15-minute de-slop pass

1. `npm run lint:slop -- <folder>` and fix every error.
2. Remove every eyebrow, `·` meta string and `→` suffix. Read the page again without them.
3. Delete every gradient. Add one back only if you can say what it's for.
4. Replace the hero illustration or stat block with the real product or a real photo.
5. Rewrite the headline so it names a concrete outcome; rewrite every button as verb + object.
6. Turn the identical card grid into a list, a table, or one thing shown properly.
7. Check the palette against the five clusters; find one real reference and borrow its logic.
8. Collapse radii to two values; declare elevation once.
9. Remove invented numbers or mark them as samples.
10. Look at it at 390px and 1440px. Fix what breaks, once, and stop.
