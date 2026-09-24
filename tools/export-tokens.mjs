#!/usr/bin/env node
/**
 * export-tokens — writes every skin as a W3C Design Tokens (DTCG) JSON file
 * to tokens/figma/<skin>.json, ready for Figma via the Tokens Studio plugin
 * or for Style Dictionary.
 *
 *   node tools/export-tokens.mjs           # write files
 *   node tools/export-tokens.mjs --check   # exit 1 if files are out of date
 */
import { readFileSync, writeFileSync, readdirSync, mkdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { parseSkin } from "./contrast-check.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(root, "tokens", "figma");
const base = readFileSync(join(root, "tokens/base.css"), "utf8");

const baseVar = (name) => base.match(new RegExp(`${name}:\\s*([^;]+);`))?.[1].trim();
const toPx = (v) => {
  if (v === "0") return "0px";
  const m = v?.match(/^([\d.]+)(rem|px)$/);
  return m ? `${m[2] === "rem" ? +m[1] * 16 : +m[1]}px` : v;
};
const resolve = (v) => {
  const ref = v?.match(/^var\((--[\w-]+)\)$/);
  return ref ? baseVar(ref[1]) : v;
};

const COLOR_ROLES = ["bg", "surface", "surface-2", "ink", "ink-muted", "line", "accent", "accent-ink", "link", "focus", "success", "warning", "danger"];

function build(file) {
  const css = readFileSync(file, "utf8");
  const [{ skin, vars }] = parseSkin(css);
  const raw = (name) => css.match(new RegExp(`${name}:\\s*([^;]+);`))?.[1].trim();
  const family = (name) => raw(name)?.split(",")[0].replace(/["']/g, "").trim();
  const color = (mode) => Object.fromEntries(COLOR_ROLES.map((r) => [r, { $type: "color", $value: vars[mode][`--${r}`] }]));

  const space = {};
  for (const m of base.matchAll(/--space-(\d+):\s*([^;]+);/g)) space[m[1]] = { $type: "dimension", $value: toPx(m[2].trim()) };

  return {
    $description: `${skin} skin — generated from skins/${skin}.css by tools/export-tokens.mjs. Do not edit by hand.`,
    color: { light: color("light"), dark: color("dark") },
    font: {
      display: { $type: "fontFamily", $value: family("--font-display") },
      body: { $type: "fontFamily", $value: family("--font-body") },
      mono: { $type: "fontFamily", $value: family("--font-mono") },
      "display-weight": { $type: "fontWeight", $value: Number(raw("--display-weight")) },
      "display-tracking": { $type: "dimension", $value: raw("--display-tracking") },
    },
    radius: {
      default: { $type: "dimension", $value: toPx(resolve(raw("--radius"))) },
      large: { $type: "dimension", $value: toPx(resolve(raw("--radius-lg"))) },
    },
    border: { width: { $type: "dimension", $value: raw("--border-w") } },
    space,
  };
}

const skins = readdirSync(join(root, "skins")).filter((f) => f.endsWith(".css") && !f.startsWith("_"));
const check = process.argv.includes("--check");
let stale = [];
if (!check) mkdirSync(outDir, { recursive: true });
for (const f of skins) {
  const json = JSON.stringify(build(join(root, "skins", f)), null, 2) + "\n";
  const out = join(outDir, f.replace(/\.css$/, ".json"));
  if (check) {
    if (!existsSync(out) || readFileSync(out, "utf8") !== json) stale.push(out);
  } else {
    writeFileSync(out, json);
    console.log(`✓ tokens/figma/${f.replace(/\.css$/, ".json")}`);
  }
}
if (check) {
  if (stale.length) { console.error(`Out of date — run: node tools/export-tokens.mjs\n  ${stale.join("\n  ")}`); process.exit(1); }
  console.log(`tokens/figma up to date (${skins.length} skins)`);
}
