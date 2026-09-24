#!/usr/bin/env node
/**
 * slop-lint — flags the patterns that make an interface look machine-made.
 *
 *   node tools/slop-lint.mjs [paths...] [--md] [--json] [--max-warnings N] [--rules]
 *
 * Scans .html .css .scss .js .jsx .ts .tsx .vue .svelte .astro (and .md/.mdx
 * with --md). Exit code 1 when there are errors or more than --max-warnings
 * warnings.
 *
 * Silence a line with a trailing comment containing `slop-ok`, or a whole file
 * with `slop-lint-disable-file`. Every rule is explained in docs/anti-slop.md,
 * and its sources are in docs/research.md. Source keys in `src`:
 *   A = Anthropic frontend-design skill   I = Impeccable (pbakaus/impeccable)
 *   H = Hallmark (nutlope/hallmark)        W = Adam Wathan / Tailwind indigo-500
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, extname, relative, basename } from "node:path";

const CODE_EXT = [".html", ".htm", ".css", ".scss", ".js", ".mjs", ".jsx", ".ts", ".tsx", ".vue", ".svelte", ".astro"];
const MD_EXT = [".md", ".mdx"];
const SKIP_DIRS = new Set(["node_modules", ".git", "dist", "build", ".next", ".nuxt", ".svelte-kit", "out", "coverage", "vendor"]);
const MARKUP = /\.(html?|jsx|tsx|vue|svelte|astro|mdx?)$/;
const STYLE = /\.(s?css|html?|jsx|tsx|vue|svelte|astro)$/;

const BUZZWORDS = [
  "unlock(?:s|ing)?", "elevate(?:s|d)?", "seamless(?:ly)?", "supercharg(?:e|es|ed|ing)",
  "revolutioni[sz](?:e|es|ing)", "game[- ]?chang(?:er|ing)", "cutting[- ]edge", "harness the power",
  "unleash(?:es|ed)?", "empower(?:s|ing)?", "next[- ]level", "effortless(?:ly)?", "streamline(?:s|d)?",
  "in today'?s (?:fast[- ]paced|digital|ever[- ]changing)", "look no further", "delve", "synerg(?:y|ies)",
  "world[- ]class", "best[- ]in[- ]class", "state[- ]of[- ]the[- ]art", "all[- ]in[- ]one", "reimagin(?:e|ed|ing)",
  "transform (?:your|the way)", "boost your", "blazing(?:ly)? fast", "take (?:your|it) .{0,20}to the next level",
  "your (?:ultimate|one[- ]stop)", "ever[- ]evolving", "robust (?:and|solution)", "unparalleled",
];
const BUZZ_RE = new RegExp(`\\b(${BUZZWORDS.join("|")})\\b`, "i");
const EMOJI = /\p{Extended_Pictographic}/u;

/** Line rules: run on every line of matching files. */
const LINE_RULES = [
  {
    id: "lorem-ipsum", severity: "error", files: /./,
    re: /\blorem ipsum\b|\bdolor sit amet\b/i,
    msg: "Placeholder Latin shipped. Write the real copy — layout decisions depend on it.",
  },
  {
    id: "purple-gradient", severity: "error", files: STYLE,
    re: /(?:(?:linear|radial|conic)-gradient\([^)]*(?:#(?:7c3aed|8b5cf6|a855f7|a78bfa|6366f1|4f46e5|818cf8|ec4899|d946ef|c026d3|9333ea|6d28d9|db2777)\b|purple|violet|indigo|fuchsia|magenta))|\b(?:from|via|to)-(?:purple|violet|indigo|fuchsia|pink)-\d{2,3}\b/i,
    msg: "Purple/indigo→pink gradient: the single most recognisable generated-UI tell. Use one flat accent from your skin.",
  },
  {
    id: "gradient-text", severity: "warn", files: STYLE,
    re: /\bbg-clip-text\b|background-clip:\s*text/i,
    msg: "Gradient-filled headline text. Let type do the work: weight, size, a better face.",
  },
  {
    id: "buzzword", severity: "warn", files: MARKUP,
    test: (line) => !/^\s*(?:import|export|const|let|var|function|\/\/|\*)/.test(line) && BUZZ_RE.test(line),
    detail: (line) => `"${line.match(BUZZ_RE)[1]}"`,
    msg: "Marketing filler. Replace with the concrete outcome: what changes, for whom, by how much.",
  },
  {
    id: "emoji-heading", severity: "error", files: MARKUP,
    test: (line, ext) => {
      const h = line.match(/<h[1-6][^>]*>(.*?)(?:<\/h[1-6]>|$)/i);
      if (h && EMOJI.test(h[1].replace(/<[^>]+>/g, ""))) return true;
      return MD_EXT.includes(ext) && /^#{1,6}\s/.test(line) && EMOJI.test(line);
    },
    msg: "Emoji in a heading. Headings carry hierarchy through type, not decoration.",
  },
  {
    id: "emoji-bullets", severity: "warn", files: MARKUP,
    re: /<li[^>]*>\s*(?:✅|✔️|✨|🚀|⚡|🔥|💡|🎯|👉)|^\s*[-*]\s*(?:✅|✨|🚀|⚡|🔥|💡|🎯)/u,
    msg: "Emoji used as bullet points. Use a real list marker or a purposeful icon set.",
  },
  {
    id: "sparkle-rocket", severity: "warn", files: MARKUP,
    test: (line) => /[✨🚀]/u.test(line) && !/<li/.test(line),
    msg: "✨/🚀 in UI copy reads as template filler.",
  },
  {
    id: "placeholder-names", severity: "warn", files: MARKUP,
    re: /\b(?:John|Jane) (?:Doe|Smith)\b|\bAcme(?: (?:Corp|Inc|Co))?\b|\bYour Company\b|\bCompany Name\b|\bexample user\b/i,
    msg: "Placeholder names. Invent specific, plausible people and companies — it changes how the design is judged.",
  },
  {
    id: "vague-proof", severity: "warn", files: MARKUP,
    re: /\btrusted by (?:thousands|millions|teams|the world|leading)\b|\b10x (?:faster|better|more)\b|\bloved by (?:thousands|millions|developers|teams)\b/i,
    msg: "Unverifiable social proof. Give a real number with its denominator and time period.",
  },
  {
    id: "generic-cta", severity: "warn", files: MARKUP,
    re: />\s*(?:Get Started|Learn More|Click Here|Submit|Read More)\s*</i,
    msg: "Generic button label. Say what happens: “Start a 30-day trial”, “Download the PDF”.",
  },
  {
    id: "transition-all", severity: "warn", files: STYLE,
    re: /transition(?:-property)?:\s*all\b|\btransition-all\b/,
    msg: "transition: all animates layout properties and causes jank. List the properties you mean.",
  },
  {
    id: "img-no-alt", severity: "error", files: MARKUP,
    re: /<img(?![^>]*\balt\s*=)[^>]*>/i,
    msg: "Image without alt. Use alt=\"\" for decorative images, a description otherwise.",
  },
  {
    id: "div-button", severity: "warn", files: MARKUP,
    re: /<(?:div|span)\b[^>]*\bon(?:click|Click)\s*=/,
    msg: "Clickable div/span. Use <button> (keyboard, focus and screen readers come free).",
  },
  {
    id: "overused-font", severity: "warn", files: STYLE, src: "A H",
    re: /font-family:\s*["']?(?:Inter|Poppins|Montserrat|Roboto|Open Sans|Lato|Nunito|Raleway|DM Sans|Work Sans|Source Sans(?: 3| Pro)?|Merriweather|Lora|Arial|Helvetica)\b|fonts\.googleapis\.com\/css2?\?family=(?:Inter|Poppins|Montserrat|Roboto|Open\+Sans|Lato|Nunito|Raleway|DM\+Sans|Work\+Sans)\b/i,
    msg: "An on-distribution default as the lead face (Anthropic and Hallmark both list it). Pick a face for this brief: node tools/find-reference.mjs \"<subject>\" shows what real sites use.",
  },
  {
    id: "eyebrow-label", severity: "warn", files: MARKUP, src: "A I H",
    re: /class="[^"]*\b(?:eyebrow|kicker|overline|pretitle|supertitle)\b|class="[^"]*\buppercase\b[^"]*\btracking-(?:wide|wider|widest|\[)/,
    msg: "Small caps label above a heading. All three sources flag it as the commonest generated-page tell; Impeccable bans it outright. Let the heading speak.",
  },
  {
    id: "middot-meta", severity: "warn", files: MARKUP, src: "A",
    test: (line) => !/<title/.test(line) && />[^<]*\s·\s[^<]*</.test(line),
    msg: "Meta string joined with middle dots (\"A · B · C\"). Anthropic lists it as template chrome. Write it as a phrase, or lay the items out.",
  },
  {
    id: "em-dash-label", severity: "warn", files: MARKUP, src: "A",
    re: /<(?:strong|span|a|h[1-6]|dt|th|button|label|small|b|figcaption)\b[^>]*>[^<]{1,30}\s—\s[^<]{1,40}<\//,
    msg: "Label built as \"WORD — fragment\" with a spaced em dash. Anthropic lists it as template chrome. Use a colon, a comma, or two elements.",
  },
  {
    id: "arrow-suffix", severity: "warn", files: MARKUP, src: "A",
    re: /(?:→|&rarr;|->)\s*<\/(?:a|button)>/,
    msg: "An arrow appended to link or button text. Anthropic lists it as template chrome. The label should say where it goes.",
  },
  {
    id: "glyph-icon", severity: "warn", files: MARKUP, src: "I H",
    re: /[★☆▲▼►◄●✓✔✗✘⭐]/u,
    msg: "A Unicode glyph standing in for an icon. Use one drawn icon set (Lucide, Phosphor, Tabler) or authored SVG at one stroke weight.",
  },
  {
    id: "numbered-markers", severity: "warn", files: MARKUP, src: "A I",
    re: />\s*0[1-9]\s*(?:<|\/|\.|—)/,
    msg: "01 / 02 / 03 markers. Only use numbering when the content really is a sequence, and then plain numerals are enough.",
  },
  {
    id: "accent-word-headline", severity: "warn", files: MARKUP, src: "A H",
    re: /<h[1-6][^>]*>[^<]*<(?:em|i|span)\b[^>]*>[^<]{1,24}<\/(?:em|i|span)>[^<]*<\/h[1-6]>/,
    msg: "One word in a headline set in italic, bold or a different color. Anthropic and Hallmark both call it a top tell. Let the whole line carry the weight.",
  },
  {
    id: "fake-chrome", severity: "warn", files: MARKUP, src: "H",
    re: /class="[^"]*\b(?:traffic-lights?|window-dots|mac-dots|browser-(?:bar|chrome|frame)|phone-frame|device-frame|notch|status-?bar)\b/,
    msg: "Hand-drawn device or browser chrome. Hallmark calls re-drawn chrome one of the strongest tells. Show the screen itself, or a real screenshot.",
  },
  {
    id: "side-stripe", severity: "warn", files: STYLE, src: "I H",
    re: /border-(?:left|right)(?:-width)?:\s*(?:[2-9]|\d{2,})px|\bborder-[lr]-(?:[2-8]|\[)/,
    msg: "Thick colored stripe on one side of a card, callout or list item. Use a full hairline or a tinted background.",
  },
  {
    id: "hard-offset-shadow", severity: "warn", files: STYLE, src: "I",
    re: /box-shadow:\s*-?\d+px\s+-?\d+px\s+0(?:px)?\s|\bshadow-\[-?\d+px_-?\d+px_0/,
    msg: "Zero-blur block shadow. Only earned in a world that is actually neobrutalist; elsewhere it's a costume.",
  },
  {
    id: "bouncy-ease", severity: "warn", files: STYLE, src: "H",
    // x values must sit in 0..1, so any value above 1 or below 0 is an overshoot on y.
    re: /cubic-bezier\([^)]*(?:\b1\.[1-9]|-\s*\d)/,
    msg: "Overshoot easing. Keep it for physical interactions (drag, throw), not buttons, menus or dialogs.",
  },
  {
    id: "near-black", severity: "warn", files: STYLE, src: "A H",
    test: (line, ext, file) => !/(?:^|[\\/])skins[\\/]|tokens?|theme/i.test(file) && /(?:color|background(?:-color)?|fill|stroke|border(?:-color)?)\s*:[^;]*#(?:000|000000|0a0a0a|0b0b0b|111|111111|121212)\b/i.test(line),
    msg: "An unconsidered black: Hallmark flags pure #000, Anthropic flags #0B0B0B/#111 standing in for it. Choose black on purpose or a clearly hued dark from your palette, as a token.",
  },
  {
    id: "claude-palette", severity: "warn", files: STYLE, src: "A",
    test: (line) => (line.match(/#[0-9a-f]{6}\b/gi) || []).some((h) => nearAny(h, ["#d97757", "#f4f1ea"], 24)),
    msg: "Cream near #F4F1EA or clay near #D97757: Anthropic's own accent palette, which it lists as the #1 generated-design cluster.",
  },
  {
    id: "ellipsis-dots", severity: "warn", files: MARKUP, src: "H",
    test: (line) => !/^\s*(?:import|export|const|let|var|return|\{|\/\/)/.test(line) && /[A-Za-z]\.\.\.(?:\s|<|"|$)/.test(line),
    msg: "Three periods. Use the ellipsis character (…).",
  },
  {
    id: "z-index-9999", severity: "warn", files: STYLE, src: "H",
    re: /z-index:\s*9{3,}/,
    msg: "z-index: 9999. Use a named layer scale (see --z-* in tokens/base.css).",
  },
  {
    id: "width-100vw", severity: "warn", files: STYLE, src: "H",
    re: /\bwidth:\s*100vw|\bw-screen\b/,
    msg: "100vw includes the scrollbar and causes sideways scroll on desktop. Use 100% or a container.",
  },
  {
    id: "stock-illustration", severity: "warn", files: MARKUP,
    re: /undraw|storyset|blush\.design|humaaans|open-peeps/i,
    msg: "Stock illustration set. Show the actual product, real photography, or nothing.",
  },
];

/** File rules: run once per file on the full text. */
const FILE_RULES = [
  {
    id: "outline-removed", severity: "error", files: STYLE,
    test: (t) => /outline:\s*(?:none|0)\b|\boutline-none\b/.test(t) && !/focus-visible/.test(t),
    msg: "Focus outline removed with no :focus-visible replacement. Keyboard users can't see where they are.",
  },
  {
    id: "glassmorphism", severity: "warn", files: STYLE,
    test: (t) => (t.match(/backdrop-filter|backdrop-blur/g) || []).length >= 3,
    msg: "Frosted glass on 3+ elements. One sticky header, fine; a whole page of it reads as a theme demo.",
  },
  {
    id: "radius-soup", severity: "warn", files: STYLE,
    test: (t) => {
      const tw = new Set(t.match(/\brounded(?:-[a-z]{1,2})?-(?:none|sm|md|lg|xl|2xl|3xl|full)\b/g) || []);
      const css = new Set((t.match(/border-radius:\s*[\d.]+(?:px|rem|em)/g) || []).map((s) => s.replace(/\s/g, "")));
      return tw.size + css.size >= 5;
    },
    msg: "5+ different corner radii. Pick one radius (and one larger variant) and use it everywhere.",
  },
  {
    id: "heavy-shadows", severity: "warn", files: STYLE,
    test: (t) => (t.match(/\bshadow-(?:xl|2xl)\b/g) || []).length >= 3,
    msg: "Big soft shadows everywhere. Most surfaces need a border or nothing; save elevation for things that float.",
  },
  {
    id: "center-everything", severity: "warn", files: STYLE,
    test: (t) => (t.match(/\btext-center\b|text-align:\s*center/g) || []).length >= 8,
    msg: "Centered text all over. Centered works for one short headline; everything else reads better flush-left.",
  },
  {
    id: "rainbow-utilities", severity: "warn", files: MARKUP,
    test: (t) => new Set([...t.matchAll(/\b(?:bg|text|border|from|to|via)-(red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-\d{2,3}\b/g)].map((m) => m[1])).size >= 5,
    msg: "5+ hue families in one file. One accent plus neutrals; status colors only for status.",
  },
  {
    id: "caps-tracked-labels", severity: "warn", files: STYLE, src: "A I H",
    // Rules scoped to a skin ([data-skin="…"]) are that world's deliberate choice.
    test: (t) => [...t.matchAll(/([^{}]*)\{([^}]*)\}/g)].some(([, sel, b]) => !/data-skin/.test(sel) && /text-transform:\s*uppercase/.test(b) && /letter-spacing:\s*0?\.\d*[1-9]/.test(b)),
    msg: "A CSS rule sets text in tracked-out capitals — the eyebrow/label style every source flags. Use sentence case (or scope it to a skin that is built on caps).",
  },
  {
    id: "fade-up-everywhere", severity: "warn", files: MARKUP, src: "A I H",
    test: (t) => (t.match(/fade-?up|fadeInUp|data-aos=|whileInView|animate-on-scroll|reveal-on-scroll/gi) || []).length >= 3,
    msg: "Scroll-triggered fade-up on several sections. One orchestrated moment lands better than an entrance on everything.",
  },
  {
    id: "hover-scale", severity: "warn", files: STYLE, src: "H",
    test: (t) => (t.match(/hover:scale-1\d\d|:hover[^{]*\{[^}]*scale\(1\.0[2-9]/g) || []).length >= 2,
    msg: "The same hover-scale on several unrelated elements. Give each control the feedback that fits it.",
  },
  {
    id: "hex-sprawl", severity: "warn", files: STYLE,
    skip: (file) => /(?:skin|token|theme|palette|colors?)[^/]*$/i.test(file) || /(?:^|[\\/])skins[\\/]/.test(file),
    test: (t) => new Set((t.match(/#[0-9a-f]{6}\b|#[0-9a-f]{3}\b/gi) || []).map((h) => h.toLowerCase())).size >= 12,
    msg: "12+ raw hex colors in one file. Move colors to tokens so the palette stays small and intentional.",
  },
];

const rgb = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
function nearAny(hex, targets, tolerance) {
  const a = rgb(hex.toLowerCase());
  return targets.some((t) => Math.hypot(...rgb(t).map((v, i) => v - a[i])) <= tolerance);
}

function walk(p, exts, out = []) {
  const st = statSync(p);
  if (st.isFile()) { if (exts.includes(extname(p).toLowerCase())) out.push(p); return out; }
  for (const name of readdirSync(p)) {
    if (SKIP_DIRS.has(name) || name.startsWith(".")) continue;
    walk(join(p, name), exts, out);
  }
  return out;
}

export function lintText(text, file) {
  const ext = extname(file).toLowerCase();
  const findings = [];
  if (text.includes("slop-lint-disable-file")) return findings;
  const lines = text.split("\n");
  lines.forEach((line, i) => {
    if (line.includes("slop-ok")) return;
    for (const r of LINE_RULES) {
      if (!r.files.test(file)) continue;
      const hit = r.test ? r.test(line, ext, file) : r.re.test(line);
      if (hit) {
        const detail = r.detail ? ` ${r.detail(line)}` : "";
        findings.push({ file, line: i + 1, rule: r.id, severity: r.severity, message: r.msg + detail });
      }
    }
  });
  for (const r of FILE_RULES) {
    if (!r.files.test(file) || r.skip?.(file)) continue;
    if (r.test(text)) findings.push({ file, line: 1, rule: r.id, severity: r.severity, message: r.msg });
  }
  return findings;
}

function main() {
  const argv = process.argv.slice(2);
  if (argv.includes("--rules")) {
    for (const r of [...LINE_RULES, ...FILE_RULES]) console.log(`${r.severity.padEnd(5)} ${r.id.padEnd(22)} [${r.src || "-"}] ${r.msg}`);
    return;
  }
  const json = argv.includes("--json");
  const exts = argv.includes("--md") ? [...CODE_EXT, ...MD_EXT] : CODE_EXT;
  const mwIdx = argv.indexOf("--max-warnings");
  const maxWarnings = mwIdx >= 0 ? Number(argv[mwIdx + 1]) : Infinity;
  const paths = argv.filter((a, i) => !a.startsWith("--") && !(mwIdx >= 0 && i === mwIdx + 1));
  const targets = (paths.length ? paths : ["."]).flatMap((p) => walk(p, exts));

  const findings = targets.flatMap((f) => lintText(readFileSync(f, "utf8"), f));
  const errors = findings.filter((f) => f.severity === "error").length;
  const warnings = findings.length - errors;

  if (json) {
    console.log(JSON.stringify({ files: targets.length, errors, warnings, findings }, null, 2));
  } else {
    let current = "";
    for (const f of findings) {
      const rel = relative(process.cwd(), f.file) || basename(f.file);
      if (rel !== current) { console.log(`\n${rel}`); current = rel; }
      const mark = f.severity === "error" ? "✗ error" : "△ warn ";
      console.log(`  ${String(f.line).padStart(4)}  ${mark}  ${f.rule.padEnd(18)} ${f.message}`);
    }
    const score = Math.max(0, 100 - errors * 10 - warnings * 2);
    console.log(`\n${targets.length} file(s) · ${errors} error(s) · ${warnings} warning(s) · slop score ${score}/100`);
  }
  process.exit(errors || warnings > maxWarnings ? 1 : 0);
}

if (import.meta.url === `file://${process.argv[1]}`) main();
