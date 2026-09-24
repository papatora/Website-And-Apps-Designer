#!/usr/bin/env node
/**
 * find-reference — search 1,160+ DESIGN.md guides of real websites
 * (the Fudge collection, MIT licensed) so a design starts from real
 * references instead of a model's memory.
 *
 *   node tools/find-reference.mjs "bakery warm"          # top matches
 *   node tools/find-reference.mjs "bank" --limit 15
 *   node tools/find-reference.mjs --show aeon.co          # colors, type, avoid-list
 *   node tools/find-reference.mjs --show aeon.co --full   # the whole guide
 *
 * Study the DNA (how color is used, type roles, layout idea); don't copy
 * hexes or clone a site. The index is cached in .cache/ for 7 days.
 * Source: https://github.com/scroobius-pip/fudge-design-md
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync, statSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const RAW = "https://raw.githubusercontent.com/scroobius-pip/fudge-design-md/main";
const BLOB = "https://github.com/scroobius-pip/fudge-design-md/blob/main";
const cacheDir = join(root, ".cache");
const cacheFile = join(cacheDir, "fudge-index.json");
const WEEK = 7 * 24 * 60 * 60 * 1000;

async function get(url) {
  let res;
  try {
    res = await fetch(url);
  } catch (e) {
    throw new Error(`Couldn't reach ${new URL(url).host} (${e.cause?.code || e.message}). Behind a proxy? Try NODE_USE_ENV_PROXY=1 on Node 22+.`);
  }
  if (!res.ok) throw new Error(`${res.status} for ${url}`);
  return res.text();
}

export function parseIndex(markdown) {
  const re = /^### (\S+)\n\n\[!\[[^\]]*\]\([^)]*\)\]\(([^)]*)\)\n\n([\s\S]*?)\n\n\[Open guide\]/gm;
  const out = [];
  let m;
  while ((m = re.exec(markdown))) out.push({ domain: m[1], path: m[2], summary: m[3].trim() });
  return out;
}

async function loadIndex() {
  if (existsSync(cacheFile) && Date.now() - statSync(cacheFile).mtimeMs < WEEK) {
    return JSON.parse(readFileSync(cacheFile, "utf8"));
  }
  const index = parseIndex(await get(`${RAW}/README.md`));
  if (!index.length) throw new Error("Fudge index format changed; no guides parsed.");
  mkdirSync(cacheDir, { recursive: true });
  writeFileSync(cacheFile, JSON.stringify(index));
  return index;
}

export function search(index, query, limit = 8) {
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  return index
    .map((e) => {
      const hay = `${e.domain} ${e.summary}`.toLowerCase();
      const score = terms.reduce((n, t) => n + (hay.split(t).length - 1) + (e.domain.includes(t) ? 3 : 0), 0);
      const all = terms.every((t) => hay.includes(t));
      return { ...e, score: score + (all ? 5 : 0) };
    })
    .filter((e) => e.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

function section(md, name) {
  const m = md.match(new RegExp(`## ${name}\\n([\\s\\S]*?)(?=\\n## |$)`));
  return m ? m[1].trim() : "";
}

async function main() {
  const args = process.argv.slice(2);
  const flag = (k) => args.includes(`--${k}`);
  const opt = (k) => { const i = args.indexOf(`--${k}`); return i >= 0 ? args[i + 1] : undefined; };

  const show = opt("show");
  if (show) {
    const md = await get(`${RAW}/design-md/${show}.md`);
    if (flag("full")) return console.log(md);
    const avoid = md.match(/### Avoid\n([\s\S]*?)(?=\n### |\n## |$)/);
    console.log(`# ${show}\n${BLOB}/design-md/${show}.md\n`);
    console.log(section(md, "Overview").split("\n\n")[0], "\n");
    for (const name of ["Colors", "Typography"]) {
      const body = section(md, name);
      if (body) console.log(`## ${name}\n` + body.split("\n").filter((l) => l.startsWith("|")).join("\n") + "\n");
    }
    if (avoid) console.log(`## Avoid\n${avoid[1].trim()}\n`);
    console.log("Take the DNA (how color is used, type roles, layout idea), not the exact values.");
    return;
  }

  const query = args.filter((a, i) => !a.startsWith("--") && args[i - 1] !== "--limit").join(" ");
  if (!query) {
    console.log('Usage: node tools/find-reference.mjs "<industry or mood>" [--limit N]\n       node tools/find-reference.mjs --show <domain> [--full]');
    process.exit(1);
  }
  const index = await loadIndex();
  const hits = search(index, query, Number(opt("limit")) || 8);
  if (!hits.length) return console.log(`No guides match "${query}". Try a broader word (e.g. "food", "finance", "magazine").`);
  console.log(`${hits.length} of ${index.length} real-site guides matching "${query}":\n`);
  for (const h of hits) {
    const first = h.summary.split(/(?<=\.)\s/)[0];
    console.log(`${h.domain}\n  ${first}\n  ${BLOB}/${h.path}\n`);
  }
  console.log(`Next: node tools/find-reference.mjs --show ${hits[0].domain}`);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  main().catch((e) => { console.error(`✗ ${e.message}`); process.exit(1); });
}
