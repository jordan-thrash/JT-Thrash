/**
 * Renders the Open Graph card at `public/og.png` — the 1200×630 preview image
 * used when the site is shared on Slack, iMessage, LinkedIn or X.
 *
 *   node scripts/generate-og.mjs
 *
 * Re-run it after changing the name, role or tagline in `src/data/site.ts`.
 * The values below are duplicated rather than imported because this is a plain
 * node script with no TypeScript transform in front of it.
 */

import { mkdir } from 'node:fs/promises';
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
  <g clip-path="url(#frame)" opacity="0.55">
    ${Array.from({ length: 9 }, (_, i) => {
      const r = 150 + i * 78;
      return `<circle cx="${WIDTH - 60}" cy="${HEIGHT + 40}" r="${r}" fill="none" stroke="${INK}" stroke-width="1.25" opacity="0.5"/>`;
    }).join('\n    ')}
    <circle cx="${WIDTH - 60}" cy="${HEIGHT + 40}" r="${150 + 4 * 78}" fill="none" stroke="${ACCENT}" stroke-width="2.5"/>
  </g>

  <!-- Masthead rule -->
  <line x1="80" y1="118" x2="${WIDTH - 80}" y2="118" stroke="${INK}" stroke-width="1.5"/>
  <text x="80" y="102" font-family="ui-monospace, monospace" font-size="21" letter-spacing="3" fill="${INK}">
    ${NAME.toUpperCase()} — ${ROLE.toUpperCase()}
  </text>

  <!-- Display line, serif to match the site -->
  <text x="80" y="360" font-family="'Instrument Serif', Georgia, serif" font-size="132" fill="${INK}" letter-spacing="-2">
    Systems
  </text>
  <text x="80" y="474" font-family="'Instrument Serif', Georgia, serif" font-size="132" fill="${INK}" letter-spacing="-2">
    you can <tspan fill="${ACCENT}" font-style="italic">play.</tspan>
  </text>

  <line x1="80" y1="536" x2="${WIDTH - 80}" y2="536" stroke="${INK}" stroke-opacity="0.18" stroke-width="1"/>

  <text x="80" y="576" font-family="ui-monospace, monospace" font-size="20" fill="${MUTED}">
    ${SPEC}
  </text>
  <text x="${WIDTH - 80}" y="576" text-anchor="end" font-family="ui-monospace, monospace" font-size="20" fill="${MUTED}">
    ${SITE}
  </text>
</svg>`;

await mkdir('public', { recursive: true });
await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toFile('public/og.png');
console.log('wrote public/og.png');
