/**
 * Renders the Open Graph card at `public/og.png` — the 1200×630 preview image
 * used when the site is shared on Slack, iMessage, LinkedIn or X.
 *
 *   node scripts/generate-og.mjs
 *
 * Re-run it after changing the name, role or tagline in `src/data/site.ts`.
 * The values below are duplicated rather than imported because this is a plain
 * node script with no TypeScript transform in front of it.
 *
 * The rasteriser resolves fonts through the operating system, not through
 * node_modules — so it needs Archivo installed locally to match the site. If it
 * is missing the card still renders, just in a fallback grotesque. Install it
 * from https://fonts.google.com/specimen/Archivo (on Linux, drop the .ttf in
 * ~/.fonts and run `fc-cache -f`).
 */

import { mkdir } from 'node:fs/promises';
import { execSync } from 'node:child_process';
import sharp from 'sharp';

const NAME = 'Jordan Thrash';
const ROLE = 'Game Developer';
const SPEC = 'Unity · C# · VR · Procedural generation';
const SITE = 'jordanthrash.netlify.app';

const WIDTH = 1200;
const HEIGHT = 630;

const PAPER = '#f7f5f1';
const INK = '#2a2722';
const MUTED = '#6b6459';
const ACCENT = '#c2410c';

const DISPLAY = "Archivo, 'DejaVu Sans', sans-serif";
const MONO = "'DejaVu Sans Mono', ui-monospace, monospace";

// Warn rather than fail — a fallback card is better than no card.
try {
  const families = execSync('fc-list : family', { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });
  if (!/archivo/i.test(families)) {
    console.warn('note: Archivo is not installed locally — falling back to a system grotesque.');
  }
} catch {
  // fc-list is unavailable (likely not Linux); carry on regardless.
}

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
  <defs>
    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="${INK}" stroke-opacity="0.05" stroke-width="1"/>
    </pattern>
    <clipPath id="frame"><rect width="${WIDTH}" height="${HEIGHT}"/></clipPath>
  </defs>

  <rect width="${WIDTH}" height="${HEIGHT}" fill="${PAPER}"/>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#grid)"/>

  <!-- Arc motif, echoing the project covers -->
  <g clip-path="url(#frame)">
    ${Array.from({ length: 9 }, (_, i) => {
      const r = 150 + i * 78;
      return `<circle cx="${WIDTH - 60}" cy="${HEIGHT + 40}" r="${r}" fill="none" stroke="${INK}" stroke-width="1.25" opacity="0.28"/>`;
    }).join('\n    ')}
    <circle cx="${WIDTH - 60}" cy="${HEIGHT + 40}" r="${150 + 4 * 78}" fill="none" stroke="${ACCENT}" stroke-width="2.5" opacity="0.85"/>
  </g>

  <!-- Masthead rule -->
  <line x1="80" y1="118" x2="${WIDTH - 80}" y2="118" stroke="${INK}" stroke-width="1.5"/>
  <text x="80" y="102" font-family="${MONO}" font-size="20" letter-spacing="3" fill="${INK}">
    ${NAME.toUpperCase()} — ${ROLE.toUpperCase()}
  </text>

  <!-- Display lines, matching the site's wide/heavy register -->
  <text x="78" y="352" font-family="${DISPLAY}" font-size="122" font-weight="800" font-stretch="expanded" fill="${INK}" letter-spacing="-4">
    Systems
  </text>
  <text x="78" y="466" font-family="${DISPLAY}" font-size="122" font-weight="800" font-stretch="expanded" fill="${INK}" letter-spacing="-4">
    you can <tspan fill="${ACCENT}">play.</tspan>
  </text>

  <line x1="80" y1="534" x2="${WIDTH - 80}" y2="534" stroke="${INK}" stroke-opacity="0.18" stroke-width="1"/>

  <text x="80" y="574" font-family="${MONO}" font-size="19" fill="${MUTED}">
    ${SPEC}
  </text>
  <text x="${WIDTH - 80}" y="574" text-anchor="end" font-family="${MONO}" font-size="19" fill="${MUTED}">
    ${SITE}
  </text>
</svg>`;

await mkdir('public', { recursive: true });
await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toFile('public/og.png');
console.log('wrote public/og.png');
