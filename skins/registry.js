/* Skin registry — single source of truth for skin metadata.
   Used by the gallery, the template skin switcher, and the tools.
   Plain script (no modules) so it works from file:// too.
   `reference` is the real website whose design DNA the skin is built on,
   documented in the Fudge DESIGN.md collection (see docs/research.md). */
(function (root) {
  const gf = (q) => `https://fonts.googleapis.com/css2?${q}&display=swap`;
  const fudge = (d) => `https://github.com/scroobius-pip/fudge-design-md/blob/main/design-md/${d}.md`;
  root.DESIGN_SKINS = [
    {
      id: "editorial",
      label: "Editorial",
      mood: "Black-and-white reading base, serif display, one deep red action.",
      goodFor: "Publications, essays, research, cultural institutions",
      reference: { site: "aeon.co", guide: fudge("aeon.co") },
      fonts: gf("family=Fraunces:opsz,wght@9..144,400..700&family=Instrument+Sans:wght@400..700&family=JetBrains+Mono:wght@400;600"),
    },
    {
      id: "swiss",
      label: "Swiss",
      mood: "Big bold grotesk, white canvas, deep blue fields, a yellow mark.",
      goodFor: "Engineering, architecture, B2B with real authority",
      reference: { site: "asml.com", guide: fudge("asml.com") },
      fonts: gf("family=Archivo:wght@400;500;700;800&family=JetBrains+Mono:wght@400;600"),
    },
    {
      id: "brutalist",
      label: "Brutalist",
      mood: "Poster wall: white sheets, a red field, condensed caps, ink borders.",
      goodFor: "Indie brands, events, record labels, product drops",
      reference: { site: "almost-pearfect.com", guide: fudge("almost-pearfect.com") },
      fonts: gf("family=Anton&family=IBM+Plex+Sans:wght@400;500;700&family=IBM+Plex+Mono:wght@400;600"),
    },
    {
      id: "terminal",
      label: "Terminal",
      mood: "Teal-tinted dark stage, amber action, mono only for code.",
      goodFor: "Dev tools, infra dashboards, APIs, changelogs",
      reference: { site: "ampcode.com", guide: fudge("ampcode.com") },
      fonts: gf("family=Chivo:wght@400..800&family=Chivo+Mono:wght@400;600"),
    },
    {
      id: "studio",
      label: "Studio",
      mood: "Cool paper, navy ink, electric blue action, lime highlights.",
      goodFor: "Consumer apps, creator tools, small businesses",
      reference: { site: "bugster.dev", guide: fudge("bugster.dev") },
      fonts: gf("family=Bricolage+Grotesque:opsz,wght@12..96,400..800&family=Figtree:wght@400..700&family=JetBrains+Mono:wght@400;600"),
    },
    {
      id: "noir",
      label: "Noir",
      mood: "Forest-black ground, high-contrast serif, ochre, section panels.",
      goodFor: "Restaurants, hotels, fashion, premium portfolios",
      reference: { site: "closdessens.com", guide: fudge("closdessens.com") },
      fonts: gf("family=Cormorant+Garamond:wght@400;500;600&family=Manrope:wght@400..700&family=IBM+Plex+Mono:wght@400;600"),
    },
    {
      id: "clarity",
      label: "Clarity",
      mood: "Grey canvas, navy ink, deep teal action, navy feature sections.",
      goodFor: "Fintech, banking, healthcare, public services",
      reference: { site: "column.com", guide: fudge("column.com") },
      fonts: gf("family=Public+Sans:wght@400..800&family=IBM+Plex+Mono:wght@400;600"),
    },
    {
      id: "riso",
      label: "Riso",
      mood: "Real Riso inks: Federal Blue text, Fluoro Pink action, Yellow field.",
      goodFor: "Events, print fairs, community projects, education",
      reference: { site: "247artists.com", guide: fudge("247artists.com") },
      fonts: gf("family=Syne:wght@600..800&family=Hanken+Grotesk:wght@400..700&family=Space+Mono:wght@400;700"),
    },
  ];
})(typeof window !== "undefined" ? window : globalThis);
