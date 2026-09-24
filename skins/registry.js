/* Skin registry — single source of truth for skin metadata.
   Used by the gallery, the template skin switcher, and tools/new-project.mjs.
   Plain script (no modules) so it works from file:// too. */
(function (root) {
  const gf = (q) => `https://fonts.googleapis.com/css2?${q}&display=swap`;
  root.DESIGN_SKINS = [
    {
      id: "editorial",
      label: "Editorial",
      mood: "Serif-led, paper tones, oxblood accent, hairline rules.",
      goodFor: "Publications, essays, law & finance, bookish brands",
      fonts: gf("family=Fraunces:opsz,wght@9..144,400..700&family=Source+Serif+4:opsz,wght@8..60,400..700&family=JetBrains+Mono:wght@400;600"),
    },
    {
      id: "swiss",
      label: "Swiss",
      mood: "One grotesk, hard grid, black/white and a signal red.",
      goodFor: "Agencies, architecture, product sites that want authority",
      fonts: gf("family=Archivo:wght@400;500;700;800&family=JetBrains+Mono:wght@400;600"),
    },
    {
      id: "brutalist",
      label: "Brutalist",
      mood: "Thick borders, hard shadows, condensed caps, hazard yellow.",
      goodFor: "Indie tools, zines, events, dev products with attitude",
      fonts: gf("family=Anton&family=IBM+Plex+Sans:wght@400;500;700&family=IBM+Plex+Mono:wght@400;600"),
    },
    {
      id: "terminal",
      label: "Terminal",
      mood: "Dark-first, monospace everywhere, phosphor green.",
      goodFor: "Dev tools, CLIs, infra dashboards, API docs",
      fonts: gf("family=JetBrains+Mono:wght@400;500;700"),
    },
    {
      id: "studio",
      label: "Studio",
      mood: "Warm cream, characterful grotesk, terracotta, soft radius.",
      goodFor: "Consumer apps, small businesses, human-feeling SaaS",
      fonts: gf("family=Bricolage+Grotesque:opsz,wght@12..96,400..800&family=Figtree:wght@400..700&family=JetBrains+Mono:wght@400;600"),
    },
    {
      id: "noir",
      label: "Noir",
      mood: "Dark luxury, high-contrast serif, brass, lots of air.",
      goodFor: "Fashion, hospitality, premium portfolios",
      fonts: gf("family=Cormorant+Garamond:wght@400;500;600&family=Manrope:wght@400..700&family=IBM+Plex+Mono:wght@400;600"),
    },
    {
      id: "clarity",
      label: "Clarity",
      mood: "Calm cool greys, one confident blue, quiet precision.",
      goodFor: "Fintech, healthcare, B2B SaaS, public services",
      fonts: gf("family=Public+Sans:wght@400..800&family=IBM+Plex+Mono:wght@400;600"),
    },
    {
      id: "riso",
      label: "Riso",
      mood: "Risograph print: blue-black ink, fluoro pink, offset shadows.",
      goodFor: "Creative events, community projects, education, zines",
      fonts: gf("family=Syne:wght@600..800&family=Work+Sans:wght@400..700&family=Space+Mono:wght@400;700"),
    },
  ];
})(typeof window !== "undefined" ? window : globalThis);
