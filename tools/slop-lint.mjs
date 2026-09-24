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
 * with `slop-lint-disable-file`. Every rule is explained in docs/anti-slop.md.
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
    id: "overused-font", severity: "warn", files: STYLE,
    re: /font-family:\s*["']?(?:Inter|Poppins|Montserrat|Roboto|Open Sans)\b|fonts\.googleapis\.com\/css2?\?family=(?:Inter|Poppins|Montserrat)\b/i,
    msg: "Default-of-the-decade typeface as the lead face. Fine for UI text, but pair it with something with a point of view.",
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
    id: "hex-sprawl", severity: "warn", files: STYLE,
    skip: (file) => /(?:skin|token|theme|palette|colors?)[^/]*$/i.test(file) || /\/skins\//.test(file),
    test: (t) => new Set((t.match(/#[0-9a-f]{6}\b|#[0-9a-f]{3}\b/gi) || []).map((h) => h.toLowerCase())).size >= 12,
    msg: "12+ raw hex colors in one file. Move colors to tokens so the palette stays small and intentional.",
  },
];

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
      const hit = r.test ? r.test(line, ext) : r.re.test(line);
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
    for (const r of [...LINE_RULES, ...FILE_RULES]) console.log(`${r.severity.padEnd(5)} ${r.id.padEnd(20)} ${r.msg}`);
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
