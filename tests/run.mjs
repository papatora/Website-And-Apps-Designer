#!/usr/bin/env node
/* Zero-dependency tests for the tools. Run: npm test */
import { readFileSync, readdirSync, mkdtempSync, rmSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { execFileSync } from "node:child_process";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import assert from "node:assert/strict";
import { lintText } from "../tools/slop-lint.mjs";
import { contrast, parseSkin } from "../tools/contrast-check.mjs";
import { parseIndex, search } from "../tools/find-reference.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const fixture = (n) => join(here, "fixtures", n);
let passed = 0;
const test = (name, fn) => { fn(); passed++; console.log(`  ✓ ${name}`); };

console.log("slop-lint");
test("flags every tell in the sloppy fixture", () => {
  const ids = new Set(lintText(readFileSync(fixture("sloppy.html"), "utf8"), "sloppy.html").map((f) => f.rule));
  for (const id of ["purple-gradient", "gradient-text", "buzzword", "emoji-heading", "lorem-ipsum", "emoji-bullets",
    "img-no-alt", "generic-cta", "div-button", "placeholder-names", "vague-proof", "transition-all", "overused-font", "outline-removed",
    "eyebrow-label", "middot-meta", "em-dash-label", "arrow-suffix", "glyph-icon", "numbered-markers", "accent-word-headline",
    "fake-chrome", "side-stripe", "hard-offset-shadow", "bouncy-ease", "near-black", "claude-palette", "ellipsis-dots",
    "z-index-9999", "width-100vw", "caps-tracked-labels", "fade-up-everywhere", "hover-scale"]) {
    assert.ok(ids.has(id), `expected rule ${id}`);
  }
});
test("clean fixture has no findings", () => {
  assert.deepEqual(lintText(readFileSync(fixture("clean.html"), "utf8"), "clean.html"), []);
});
test("slop-ok silences a line", () => {
  assert.equal(lintText("<p>Unlock it <!-- slop-ok --></p>", "a.html").length, 0);
});
test("near-black is allowed inside skin files", () => {
  assert.equal(lintText(".x { color: #000000; }", "skins/editorial.css").filter((f) => f.rule === "near-black").length, 0);
});
test("caps labels scoped to a skin are allowed", () => {
  assert.equal(lintText('[data-skin="brutalist"] .btn { text-transform: uppercase; letter-spacing: 0.04em; }', "a.css").length, 0);
});
test("middot inside <title> is fine", () => {
  assert.equal(lintText("<title>Overview · Ledgerline</title>", "a.html").length, 0);
});
test("buzzwords ignored in code identifiers", () => {
  assert.equal(lintText("const elevate = 1;", "a.js").length, 0);
});

console.log("contrast-check");
test("black on white is 21:1", () => assert.equal(Math.round(contrast("#000000", "#ffffff")), 21));
test("parses light-dark() and var() references", () => {
  const [s] = parseSkin(`[data-skin="t"] { --bg: light-dark(#ffffff, #000000); --accent: #123456; --focus: var(--accent); }`);
  assert.equal(s.vars.light["--bg"], "#ffffff");
  assert.equal(s.vars.dark["--bg"], "#000000");
  assert.equal(s.vars.dark["--focus"], "#123456");
  assert.equal(s.vars.light["--link"], "#123456");
});

console.log("find-reference");
test("parses the Fudge index and ranks by subject", () => {
  const index = parseIndex(readFileSync(fixture("fudge-readme-sample.md"), "utf8"));
  assert.equal(index.length, 3);
  assert.equal(index[0].path, "design-md/aeon.co.md");
  assert.equal(search(index, "bakery")[0].domain, "banjos.com.au");
  assert.equal(search(index, "bank developers")[0].domain, "column.com");
  assert.equal(search(index, "spaceship").length, 0);
});

console.log("new-project");
const root = join(here, "..");
const templates = readdirSync(join(root, "templates")).filter((d) => !d.startsWith("_"));
for (const t of templates) {
  test(`scaffolds ${t} into a standalone folder`, () => {
    const out = mkdtempSync(join(tmpdir(), "wad-"));
    try {
      execFileSync("node", [join(root, "tools/new-project.mjs"), "--template", t, "--skin", "clarity", "--out", out, "--force"], { stdio: "pipe" });
      const html = readFileSync(join(out, "index.html"), "utf8");
      assert.ok(!html.includes("../"), "no paths back into the kit");
      assert.ok(!/registry\.js|skin-switcher/.test(html), "preview scripts removed");
      assert.ok(html.includes('data-skin="clarity"'), "skin applied");
      assert.ok(html.includes("fonts.googleapis.com/css2?family=Public+Sans"), "skin fonts linked");
      for (const f of ["base.css", "skin.css", "components.css"]) assert.ok(existsSync(join(out, "css", f)), f);
      assert.deepEqual(lintText(html, "index.html").filter((f) => f.severity === "error"), []);
    } finally {
      rmSync(out, { recursive: true, force: true });
    }
  });
}

console.log(`\n${passed} passed`);
