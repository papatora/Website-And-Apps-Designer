# Celengan (demo)

A finance landing page built with this kit, to test the process end to end.
Celengan is not a real product; every figure is an example.

**Process followed** (docs/anti-slop.md §1):
1. Subject: freelancers in Indonesia with irregular income, who split each client payment into tax, emergency and savings pockets. Mode: Persuade.
2. References via `node tools/find-reference.mjs "fintech"` / `"freelancer"`: mellow.io, wero-wallet.eu and lead.bank. What was taken from each is in `public/css/skin.css`.
3. Plan: pocket colours from Rupiah banknotes (colour = pocket everywhere); Plus Jakarta Sans (Tokotype, made for Jakarta); pill controls; flat colour blocks, no shadows; the hero is an interactive splitter instead of an illustration.
4. Reviewed against the five default clusters: none matched.
5. Verified with `slop-lint`, `contrast-check` (including the pocket colours) and a browser check at 320, 390, 768 and 1440px.

## Deploy

```bash
cd examples/celengan
npx wrangler@latest deploy --temporary   # no account: live 60 minutes, claim link printed
```

With an account: `npx wrangler@latest login`, then `npx wrangler@latest deploy`.
