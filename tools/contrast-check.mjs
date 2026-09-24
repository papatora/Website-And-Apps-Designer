#!/usr/bin/env node
/**
 * contrast-check — verifies every skin's color pairs against WCAG 2.2
 * in both light and dark mode.
 *
 *   node tools/contrast-check.mjs            # all skins in /skins
 *   node tools/contrast-check.mjs path.css   # specific files
 *
 * Colors must be written as light-dark(#hex, #hex) or plain #hex.
 * Exits 1 if any required pair fails.
 */
import { readFileSync, readdirSync } from "node:fs";
import { join, dirname, basename } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

// [foreground, background, minimum ratio, "error" | "warn", why]
const PAIRS = [
  ["--ink", "--bg", 7, "warn", "body text (AAA)"],
  ["--ink", "--bg", 4.5, "error", "body text (AA)"],
  ["--ink", "--surface", 4.5, "error", "text on cards"],
  ["--ink", "--surface-2", 4.5, "error", "text on wells/code"],
  ["--ink-muted", "--bg", 4.5, "error", "secondary text"],
  ["--ink-muted", "--surface", 4.5, "error", "secondary text on cards"],
  ["--ink-muted", "--surface-2", 4.5, "warn", "secondary text on wells"],
  ["--link", "--bg", 4.5, "error", "link text"],
  ["--accent-ink", "--accent", 4.5, "error", "label on primary button"],
  ["--accent", "--bg", 3, "warn", "accent as non-text UI"],
  ["--focus", "--bg", 3, "error", "focus ring (non-text UI)"],
  ["--danger", "--bg", 4.5, "error", "error messages"],
  ["--danger", "--surface", 4.5, "error", "error messages on cards"],
  ["--success", "--bg", 4.5, "warn", "success text"],
  ["--warning", "--bg", 4.5, "warn", "warning text"],
  ["--field-ink", "--field", 4.5, "error", "text on a brand field section"],
];

const hexToRgb = (hex) => {
  let h = hex.replace("#", "");
  if (h.length === 3 || h.length === 4) h = [...h].map((c) => c + c).join("");
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
};
const luminance = ([r, g, b]) => {
  const f = (c) => {
    c /= 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
};
export const contrast = (a, b) => {
  const [l1, l2] = [luminance(hexToRgb(a)), luminance(hexToRgb(b))].sort((x, y) => y - x);
  return (l1 + 0.05) / (l2 + 0.05);
};

export function parseSkin(css) {
  const blocks = [];
  const re = /\[data-skin="([\w-]+)"\]\s*\{([^}]*)\}/g;
  let m;
  while ((m = re.exec(css))) {
    const vars = { light: {}, dark: {} };
    const decl = /(--[\w-]+)\s*:\s*([^;]+);/g;
    let d;
    while ((d = decl.exec(m[2]))) {
      const [, name, raw] = d;
      const value = raw.trim();
      const ld = value.match(/^light-dark\(\s*(#[0-9a-f]{3,8})\s*,\s*(#[0-9a-f]{3,8})\s*\)$/i);
      const plainHex = value.match(/^#[0-9a-f]{3,8}$/i);
      const ref = value.match(/^var\((--[\w-]+)\)$/);
      if (ld) { vars.light[name] = ld[1]; vars.dark[name] = ld[2]; }
      else if (plainHex) { vars.light[name] = vars.dark[name] = value; }
      else if (ref) { vars.light[name] = { ref: ref[1] }; vars.dark[name] = { ref: ref[1] }; }
    }
    for (const mode of ["light", "dark"]) {
      const v = vars[mode];
      for (const k of Object.keys(v)) if (typeof v[k] === "object") v[k] = v[v[k].ref];
      v["--link"] ??= v["--accent"];
    }
    blocks.push({ skin: m[1], vars });
  }
  return blocks;
}

function main() {
  const args = process.argv.slice(2).filter((a) => !a.startsWith("-"));
  const files = args.length
    ? args
    : readdirSync(join(root, "skins"))
        .filter((f) => f.endsWith(".css") && !f.startsWith("_"))
        .map((f) => join(root, "skins", f));

  let errors = 0, warnings = 0;
  for (const file of files) {
    for (const { skin, vars } of parseSkin(readFileSync(file, "utf8"))) {
      const lines = [];
      for (const mode of ["light", "dark"]) {
        for (const [fg, bg, min, level, why] of PAIRS) {
          const a = vars[mode][fg], b = vars[mode][bg];
          if (!a || !b) {
            if (level === "error") { lines.push(`  ✗ ${mode.padEnd(5)} ${fg} / ${bg} missing`); errors++; }
            continue;
          }
          const r = contrast(a, b);
          if (r < min) {
            const mark = level === "error" ? "✗" : "△";
            level === "error" ? errors++ : warnings++;
            lines.push(`  ${mark} ${mode.padEnd(5)} ${fg} ${a} on ${bg} ${b} = ${r.toFixed(2)}:1 (needs ${min}) — ${why}`);
          }
        }
      }
      const status = lines.some((l) => l.includes("✗")) ? "FAIL" : lines.length ? "ok (with notes)" : "ok";
      console.log(`${skin.padEnd(12)} ${status}  ${basename(file)}`);
      lines.forEach((l) => console.log(l));
    }
  }
  console.log(`\n${errors} error(s), ${warnings} warning(s)`);
  process.exit(errors ? 1 : 0);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) main();
