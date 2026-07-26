/**
 * Bundles the built homepage into one self-contained HTML file, so it can be
 * shared as a preview link without a server behind it.
 *
 *   npm run build && node scripts/inline-preview.mjs [out.html]
 *
 * Everything the page loads — stylesheets, the Latin subset of each font, the
 * module scripts, and one size of each cover image — is embedded as a data URI.
 * Non-Latin font subsets and the unused srcset entries are dropped, which is
 * what keeps the result to a sane size.
 *
 * Links to project pages are neutralised, since those pages aren't in the
 * bundle. This is a preview of the homepage, not a working copy of the site.
 */

import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const DIST = 'dist';
const out = process.argv[2] ?? 'preview.html';

const mime = {
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.woff2': 'font/woff2',
  '.webp': 'image/webp',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
};

const asset = (url) => path.join(DIST, url.replace(/^\//, '').split('?')[0]);

async function dataUri(url) {
  const file = asset(url);
  const buffer = await readFile(file);
  const type = mime[path.extname(file)] ?? 'application/octet-stream';
  return `data:${type};base64,${buffer.toString('base64')}`;
}

let html = await readFile(path.join(DIST, 'index.html'), 'utf8');

/* ---- stylesheets ------------------------------------------------------- */

const sheets = [...html.matchAll(/<link rel="stylesheet" href="([^"]+)"\s*\/?>/g)];
let css = '';
for (const [tag, href] of sheets) {
  css += await readFile(asset(href), 'utf8');
  html = html.replace(tag, '');
}

/* ---- fonts ------------------------------------------------------------- */

// Keep only the Latin subsets. The Vietnamese and latin-ext files would roughly
// double the payload for glyphs this copy never uses.
const fontUrls = [...new Set([...css.matchAll(/url\(([^)]*\.woff2)\)/g)].map((m) => m[1]))];
let dropped = 0;
for (const url of fontUrls) {
  if (!/-latin-standard-/.test(url)) {
    // Remove the whole @font-face block that references a subset we're dropping.
    css = css.replace(new RegExp(`@font-face\\{[^}]*${url.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}[^}]*\\}`, 'g'), '');
    dropped++;
    continue;
  }
  css = css.replaceAll(url, await dataUri(url));
}

html = html.replace('</head>', `<style>${css}</style></head>`);

/* ---- images ------------------------------------------------------------ */

// Drop srcset so the browser cannot ask for a variant we haven't embedded,
// then inline whatever each `src` points at.
html = html.replace(/\s(?:srcset|sizes)="[^"]*"/g, '');

const imgUrls = [...new Set([...html.matchAll(/(?:src|href)="(\/_astro\/[^"]+\.(?:webp|png))"/g)].map((m) => m[1]))];
for (const url of imgUrls) {
  html = html.replaceAll(`"${url}"`, `"${await dataUri(url)}"`);
}

const favicon = html.match(/href="(\/favicon\.svg)"/);
if (favicon) html = html.replaceAll(favicon[1], await dataUri(favicon[1]));

/* ---- scripts ----------------------------------------------------------- */

const scripts = [...html.matchAll(/<script type="module" src="([^"]+)"><\/script>/g)];
for (const [tag, src] of scripts) {
  const code = await readFile(asset(src), 'utf8');
  html = html.replace(tag, `<script type="module">${code}</script>`);
}

/* ---- neutralise off-page links ----------------------------------------- */

let neutralised = 0;
html = html.replace(/href="(\/work\/[^"]*)"/g, () => {
  neutralised++;
  return 'href="#work" data-preview-disabled="true"';
});

// Anything still pointing at the origin would 404 in a standalone file.
html = html.replace(/(?:href|src)="\/(?!\/)[^"]*"/g, (match) =>
  match.startsWith('href') ? 'href="#"' : match
);

await writeFile(out, html);

const kb = (await readFile(out)).length / 1024;
console.log(`wrote ${out} — ${kb.toFixed(0)} kB`);
console.log(`  ${fontUrls.length - dropped} font subsets inlined, ${dropped} dropped`);
console.log(`  ${imgUrls.length} images inlined, ${neutralised} project links neutralised`);
