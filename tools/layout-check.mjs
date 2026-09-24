#!/usr/bin/env node
/**
 * layout-check — opens every template in every skin at phone and desktop
 * width in a real browser and fails on JS errors, horizontal scrolling, or a
 * skin that didn't apply.
 *
 *   npm i --no-save playwright && npx playwright install chromium
 *   node tools/layout-check.mjs
 *
 * Fonts are skipped (fallback stacks are used) so it runs offline.
 */
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { readdirSync, readFileSync, existsSync } from "node:fs";
import { join, extname, normalize, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import { execSync } from "node:child_process";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

async function loadPlaywright() {
  try { return await import("playwright"); } catch {}
  try {
    const globalRoot = execSync("npm root -g", { stdio: ["ignore", "pipe", "ignore"] }).toString().trim();
    return createRequire(join(globalRoot, "noop.js"))("playwright");
  } catch {
    console.error("Playwright not found. Install it with:\n  npm i --no-save playwright && npx playwright install chromium");
    process.exit(2);
  }
}

const TYPES = { ".html": "text/html", ".css": "text/css", ".js": "text/javascript" };
const server = createServer(async (req, res) => {
  try {
    let file = join(root, normalize(decodeURIComponent(new URL(req.url, "http://x").pathname)));
    if (!file.startsWith(root)) throw 0;
    if ((await stat(file)).isDirectory()) file = join(file, "index.html");
    res.writeHead(200, { "content-type": TYPES[extname(file)] || "application/octet-stream" }).end(await readFile(file));
  } catch { res.writeHead(404).end(); }
});
await new Promise((r) => server.listen(0, r));
const origin = `http://localhost:${server.address().port}`;

const sandbox = {};
new Function("window", readFileSync(join(root, "skins/registry.js"), "utf8"))(sandbox);
const skins = sandbox.DESIGN_SKINS.map((s) => s.id);
const templates = readdirSync(join(root, "templates")).filter((d) => !d.startsWith("_"));
const examples = existsSync(join(root, "examples"))
  ? readdirSync(join(root, "examples")).filter((d) => existsSync(join(root, "examples", d, "public", "index.html"))).map((d) => `examples/${d}/public/`)
  : [];

const { chromium } = await loadPlaywright();
const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
const problems = [];
let checked = 0;
for (const width of [390, 1440]) {
  const page = await browser.newPage({ viewport: { width, height: 900 } });
  await page.route(/fonts\.(googleapis|gstatic)\.com/, (r) => r.abort());
  let current = "";
  page.on("pageerror", (e) => problems.push(`${current}: ${e.message}`));
  for (const t of ["", ...examples, ...templates.map((t) => `templates/${t}/`)]) {
    for (const s of t.startsWith("templates/") ? skins : [null]) {
      current = `/${t}${s ? `?skin=${s}` : ""} @${width}px`;
      await page.goto(origin + current.split(" ")[0], { waitUntil: "load" });
      if (await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)) problems.push(`${current}: page scrolls sideways`);
      if (s && (await page.evaluate(() => document.documentElement.dataset.skin)) !== s) problems.push(`${current}: skin not applied`);
      checked++;
    }
  }
  await page.close();
}
await browser.close();
server.close();

if (problems.length) {
  console.error(problems.map((p) => `✗ ${p}`).join("\n") + `\n\n${problems.length} problem(s) in ${checked} pages`);
  process.exit(1);
}
console.log(`✓ ${checked} pages (${templates.length} templates × ${skins.length} skins × 2 widths, gallery, ${examples.length} example(s)): no errors, no sideways scroll`);
