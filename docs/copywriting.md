# Copywriting for interfaces

Copy is design material. Generic copy makes good design look generic.

## Headlines

Formula that works: **concrete outcome + for whom (+ contrast)**.

| Generic | Specific |
|---|---|
| Unlock your team's potential | Close the month in an afternoon, not a weekend |
| The all-in-one platform for modern teams | Shared site-visit notes for building inspectors |
| Build faster with AI | Turn a Figma frame into a pull request |

Test: could a competitor put your headline on their site unchanged? Then rewrite it.

## Buttons

Verb + object. Say what happens after the click.

- ✗ Get started → ✓ Start a 30-day trial
- ✗ Submit → ✓ Send invoice
- ✗ Learn more → ✓ See pricing / Read the case study
- Destructive actions name the thing: **Delete 3 invoices**, not **Confirm**.

## Proof

Numbers need a denominator, a unit and a time period.

- ✗ Trusted by thousands → ✓ Used by 1,240 studios in 31 countries
- ✗ 10x faster → ✓ Median month-end: 47 minutes (was 6 hours)
- Testimonials: full name, role, company and size, and one specific result.

## Voice (A)

- Write from the user's side. People manage *notifications*, not *webhook config*.
- Sentence case, plain verbs, active voice. No filler.
- One name per action through the whole flow: a **Publish** button produces a "Published" confirmation.
- Describe what something does; don't sell it.

## Honest numbers (H)

Don't invent metrics to fill a stat-shaped layout. If the user hasn't given you
the number, leave a clearly marked placeholder, ask, or cut the section. Every
template in this repo opens with a comment marking its figures as fictional.

## Microcopy

- **Empty states** explain what goes here and offer the first action: *"No invoices yet. Create one, or import from Xero."*
- **Errors** say what happened and how to fix it, in the interface's voice. They don't apologise and are never vague: *"That IBAN is 2 characters short."*
- **Placeholders** are examples, not labels. Always keep a visible `<label>`.
- **Confirmations** repeat what was done: *"Invoice 0142 sent to maren@hollis-oke.nl"*.

## Words to cut

unlock, elevate, seamless, supercharge, empower, revolutionize, next-level,
cutting-edge, world-class, best-in-class, state-of-the-art, all-in-one,
robust, effortless, streamline, harness, leverage, delve, synergy, game-changer.
`slop-lint` flags them.
