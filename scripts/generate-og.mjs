/**
 * Renders the Open Graph card at `public/og.png` — the 1200×630 preview image
 * used when the site is shared on Slack, iMessage, LinkedIn or X.
 *
 *   node scripts/generate-og.mjs
 *
 * Re-run it after changing the name, role or accent colour in `src/data/site.ts`.
 * The values below are duplicated rather than imported because this is a plain
 * node script with no TypeScript transform in front of it.
 */

import { mkdir } from 'node:fs/promises';
import sharp from 'sharp';

const NAME = 'Jordan Thrash';
const ROLE = 'Game Developer';
const TAGLINE = 'Unity · C# · VR · Procedural generation';
const SITE = 'jordanthrash.netlify.app';

const WIDTH = 1200;
const HEIGHT = 630;
const HUE = 42;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="hsl(${HUE} 14% 11%)"/>
      <stop offset="60%" stop-color="hsl(${HUE + 10} 12% 8%)"/>
      <stop offset="100%" stop-color="hsl(${HUE - 12} 16% 6%)"/>
    </linearGradient>
    <radialGradient id="glow" cx="82%" cy="14%" r="65%">
      <stop offset="0%" stop-color="hsl(${HUE} 92% 58%)" stop-opacity="0.26"/>
      <stop offset="100%" stop-color="hsl(${HUE} 92% 58%)" stop-opacity="0"/>
    </radialGradient>
    <pattern id="grid" width="56" height="56" patternUnits="userSpaceOnUse">
      <path d="M 56 0 L 0 0 0 56" fill="none" stroke="hsl(0 0% 100%)" stroke-opacity="0.04" stroke-width="1"/>
    </pattern>
  </defs>

  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#bg)"/>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#grid)"/>

  <g opacity="0.5">
    ${Array.from({ length: 8 }, (_, i) => {
      const r = 170 + i * 96;
      return `<circle cx="${WIDTH - 90}" cy="${HEIGHT + 60}" r="${r}" fill="none" stroke="hsl(${HUE} 90% 62%)" stroke-width="1.5" opacity="${(0.32 - i * 0.035).toFixed(3)}"/>`;
    }).join('\n    ')}
  </g>

  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#glow)"/>

  <!-- monogram -->
  <rect x="80" y="80" width="72" height="72" rx="18" fill="none" stroke="hsl(${HUE} 80% 55%)" stroke-width="2"/>
  <text x="116" y="128" text-anchor="middle" font-family="ui-monospace, monospace" font-size="30" font-weight="700" fill="hsl(${HUE} 92% 62%)">JT</text>

  <text x="80" y="352" font-family="Inter, ui-sans-serif, system-ui, sans-serif" font-size="88" font-weight="700" fill="hsl(0 0% 98%)" letter-spacing="-3">
    ${NAME}
  </text>

  <text x="80" y="424" font-family="Inter, ui-sans-serif, system-ui, sans-serif" font-size="42" font-weight="600" fill="hsl(${HUE} 92% 62%)" letter-spacing="-1">
    ${ROLE}
  </text>

  <text x="80" y="486" font-family="ui-monospace, monospace" font-size="24" fill="hsl(0 0% 68%)" letter-spacing="1">
    ${TAGLINE}
  </text>

  <rect x="80" y="536" width="70" height="4" rx="2" fill="hsl(${HUE} 90% 60%)"/>

  <text x="${WIDTH - 80}" y="${HEIGHT - 56}" text-anchor="end" font-family="ui-monospace, monospace" font-size="22" fill="hsl(0 0% 52%)">
    ${SITE}
  </text>
</svg>`;

await mkdir('public', { recursive: true });
await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toFile('public/og.png');
console.log('wrote public/og.png');
