#!/usr/bin/env node
/**
 * new-project — copy a template + one skin into a standalone folder,
 * with the preview-only switcher removed and the skin's fonts wired in.
 *
 *   node tools/new-project.mjs --template landing --skin editorial --out ../my-site [--force]
 *   node tools/new-project.mjs --list
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync, copyFileSync } from "node:fs";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const sandbox = {};
new Function("window", readFileSync(join(root, "skins/registry.js"), "utf8"))(sandbox);
const SKINS = sandbox.DESIGN_SKINS;
const TEMPLATES = readdirSync(join(root, "templates")).filter((d) => !d.startsWith("_"));

const args = process.argv.slice(2);
const opt = (k) => { const i = args.indexOf(`--${k}`); return i >= 0 ? args[i + 1] : undefined; };
const die = (m) => { console.error(`✗ ${m}`); process.exit(1); };

if (args.includes("--list") || args.length === 0) {
  console.log("Templates:\n" + TEMPLATES.map((t) => `  ${t}`).join("\n"));
  console.log("\nSkins:\n" + SKINS.map((s) => `  ${s.id.padEnd(10)} ${s.mood}`).join("\n"));
  console.log("\nUsage: node tools/new-project.mjs --template landing --skin editorial --out ../my-site");
  process.exit(0);
}

const template = opt("template"), skinId = opt("skin"), out = opt("out");
if (!TEMPLATES.includes(template)) die(`Unknown template "${template}". Options: ${TEMPLATES.join(", ")}`);
const skin = SKINS.find((s) => s.id === skinId);
if (!skin) die(`Unknown skin "${skinId}". Options: ${SKINS.map((s) => s.id).join(", ")}`);
if (!out) die("Missing --out <folder>");
const dest = resolve(out);
if (existsSync(dest) && readdirSync(dest).length && !args.includes("--force")) die(`${dest} is not empty (use --force to write anyway)`);

mkdirSync(join(dest, "css"), { recursive: true });
copyFileSync(join(root, "tokens/base.css"), join(dest, "css/base.css"));
copyFileSync(join(root, `skins/${skin.id}.css`), join(dest, "css/skin.css"));
copyFileSync(join(root, "components/components.css"), join(dest, "css/components.css"));

let html = readFileSync(join(root, "templates", template, "index.html"), "utf8");
html = html
  .replace(/<html([^>]*)data-skin="[^"]*"/, `<html$1data-skin="${skin.id}"`)
  .replace(/\.\.\/\.\.\/tokens\/base\.css/, "css/base.css")
  .replace(/<link rel="stylesheet" id="skin-css" href="[^"]*">/, `<link rel="stylesheet" href="css/skin.css">`)
  .replace(/\.\.\/\.\.\/components\/components\.css/, "css/components.css")
  .replace(/\s*<script src="[^"]*registry\.js"><\/script>/, "")
  .replace(/\s*<script src="[^"]*skin-switcher\.js"><\/script>/, "")
  .replace(/(<link rel="preconnect" href="https:\/\/fonts\.gstatic\.com" crossorigin>)/, `$1\n  <link rel="stylesheet" href="${skin.fonts}">`);
writeFileSync(join(dest, "index.html"), html);

writeFileSync(join(dest, "README.md"), `# ${template} · ${skin.label}

Scaffolded from Website-And-Apps-Designer.

- \`css/base.css\` — spacing, type, radius and motion scales
- \`css/skin.css\` — the ${skin.label} skin (colors, fonts, shape). Edit this to rebrand.
- \`css/components.css\` — components that read only skin variables

Before you ship, replace every piece of sample copy with your own and run:

    node <path-to-kit>/tools/slop-lint.mjs .
`);

console.log(`✓ ${template} + ${skin.label} → ${dest}`);
console.log("  Next: replace the sample copy, then run slop-lint on the folder.");
