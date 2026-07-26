/**
 * Generates a placeholder cover image for every project that does not already
 * have a real screenshot.
 *
 *   node scripts/generate-covers.mjs          # only fills in missing covers
 *   node scripts/generate-covers.mjs --force  # regenerate everything
 *
 * Each cover is deterministic: the same slug always produces the same artwork,
 * so the grid stays stable between builds. Hue is derived from the project's
 * `kind` so the covers agree with the category chips on the cards, and the
 * geometric motif is seeded from the slug so no two look alike.
 *
 * These exist so the site never renders a broken or empty card. Replace them
 * with real screenshots as they become available — `scripts/fetch-weebly-images.mjs`
 * does that automatically for the images still hosted on the old Weebly site.
 */

import { readdir, readFile, writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const PROJECTS_DIR = 'src/content/projects';
const COVERS_DIR = path.join(PROJECTS_DIR, 'covers');
const WIDTH = 1200;
const HEIGHT = 800;

const force = process.argv.includes('--force');

/** Hue per category, matching the chip colours used on the project cards. */
const HUE_BY_KIND = {
  Game: 42, // amber
  Tool: 190, // cyan
  Web: 280, // violet
  Backend: 150, // green
};

/** Deterministic 32-bit hash — same slug in, same artwork out. */
function hash(input) {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** Small seeded PRNG so motifs are varied but reproducible. */
function rng(seed) {
  let state = seed || 1;
  return () => {
    state ^= state << 13;
    state ^= state >>> 17;
    state ^= state << 5;
    state >>>= 0;
    return state / 4294967296;
  };
}

/**
 * Six motifs, chosen by seed. Each is drawn in the accent hue at low opacity so
 * the title stays the dominant element.
 */
function motif(index, random, hue) {
  const stroke = `hsl(${hue} 90% 62%)`;
  const parts = [];

  if (index === 0) {
    // Concentric arcs radiating from the lower-right.
    for (let i = 0; i < 9; i++) {
      const r = 140 + i * 88;
      parts.push(
        `<circle cx="${WIDTH - 120}" cy="${HEIGHT + 40}" r="${r}" fill="none" stroke="${stroke}" stroke-width="1.5" opacity="${(0.36 - i * 0.035).toFixed(3)}"/>`
      );
    }
  } else if (index === 1) {
    // Diagonal bars of varying weight.
    for (let i = 0; i < 22; i++) {
      const x = i * 74 - 300;
      const w = 4 + Math.floor(random() * 22);
      parts.push(
        `<rect x="${x}" y="-200" width="${w}" height="${HEIGHT + 400}" fill="${stroke}" opacity="${(0.05 + random() * 0.16).toFixed(3)}" transform="rotate(22 ${WIDTH / 2} ${HEIGHT / 2})"/>`
      );
    }
  } else if (index === 2) {
    // Dot field with a density gradient.
    for (let row = 0; row < 14; row++) {
      for (let col = 0; col < 21; col++) {
        if (random() > 0.55 + row * 0.028) continue;
        const r = 2 + random() * 4.5;
        parts.push(
          `<circle cx="${col * 60 + 30}" cy="${row * 60 + 30}" r="${r.toFixed(2)}" fill="${stroke}" opacity="${(0.14 + random() * 0.4).toFixed(3)}"/>`
        );
      }
    }
  } else if (index === 3) {
    // A wandering path — a nod to the maze and generation projects.
    let x = 80;
    let y = HEIGHT / 2;
    let d = `M ${x} ${y}`;
    for (let i = 0; i < 26; i++) {
      x += 40 + random() * 40;
      y += (random() - 0.5) * 300;
      y = Math.max(90, Math.min(HEIGHT - 90, y));
      d += ` L ${x.toFixed(1)} ${y.toFixed(1)}`;
      if (x > WIDTH + 60) break;
    }
    parts.push(
      `<path d="${d}" fill="none" stroke="${stroke}" stroke-width="2.5" opacity="0.5" stroke-linejoin="round"/>`
    );
    parts.push(`<path d="${d}" fill="none" stroke="${stroke}" stroke-width="14" opacity="0.09"/>`);
  } else if (index === 4) {
    // Stacked waveform.
    for (let i = 0; i < 6; i++) {
      const amp = 26 + random() * 60;
      const yBase = 150 + i * 100;
      let d = `M -50 ${yBase}`;
      for (let x = 0; x <= WIDTH + 100; x += 40) {
        d += ` Q ${x + 20} ${(yBase + (x / 40) % 2 === 0 ? amp : -amp).toFixed(1)} ${x + 40} ${yBase}`;
      }
      parts.push(
        `<path d="${d}" fill="none" stroke="${stroke}" stroke-width="2" opacity="${(0.34 - i * 0.04).toFixed(3)}"/>`
      );
    }
  } else {
    // Nested rotated squares.
    for (let i = 0; i < 10; i++) {
      const size = 120 + i * 78;
      parts.push(
        `<rect x="${(WIDTH - size) / 2}" y="${(HEIGHT - size) / 2}" width="${size}" height="${size}" fill="none" stroke="${stroke}" stroke-width="1.5" opacity="${(0.34 - i * 0.031).toFixed(3)}" transform="rotate(${i * 6} ${WIDTH / 2} ${HEIGHT / 2})"/>`
      );
    }
  }

  return parts.join('\n    ');
}

function buildSvg({ kind, slug }) {
  const seed = hash(slug);
  const random = rng(seed);
  const hue = HUE_BY_KIND[kind] ?? 42;
  const motifIndex = seed % 6;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="hsl(${hue} 18% 12%)"/>
      <stop offset="55%" stop-color="hsl(${hue + 8} 14% 9%)"/>
      <stop offset="100%" stop-color="hsl(${hue - 10} 20% 7%)"/>
    </linearGradient>
    <radialGradient id="glow" cx="78%" cy="18%" r="70%">
      <stop offset="0%" stop-color="hsl(${hue} 92% 58%)" stop-opacity="0.3"/>
      <stop offset="100%" stop-color="hsl(${hue} 92% 58%)" stop-opacity="0"/>
    </radialGradient>
    <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
      <path d="M 60 0 L 0 0 0 60" fill="none" stroke="hsl(0 0% 100%)" stroke-opacity="0.035" stroke-width="1"/>
    </pattern>
    <linearGradient id="scrim" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="hsl(${hue} 20% 5%)" stop-opacity="0"/>
      <stop offset="45%" stop-color="hsl(${hue} 20% 5%)" stop-opacity="0.55"/>
      <stop offset="100%" stop-color="hsl(${hue} 20% 5%)" stop-opacity="0.88"/>
    </linearGradient>
  </defs>

  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#bg)"/>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#grid)"/>

  <g>
    ${motif(motifIndex, random, hue)}
  </g>

  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#glow)"/>

  <!-- Bottom scrim, so the card's own title has a settled area to sit against -->
  <rect x="0" y="${HEIGHT - 430}" width="${WIDTH}" height="430" fill="url(#scrim)"/>

  <!-- Deliberately no title text: the card and the detail page already render
       the title, and repeating it here reads as a mistake. -->
  <rect x="72" y="${HEIGHT - 96}" width="86" height="4" rx="2" fill="hsl(${hue} 90% 60%)" opacity="0.85"/>
</svg>`;
}

/** Minimal frontmatter reader — enough for the handful of fields we need. */
function readFrontmatter(raw) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return {};
  const fields = {};
  for (const line of match[1].split(/\r?\n/)) {
    const kv = line.match(/^(\w+):\s*(.+)$/);
    if (!kv) continue;
    fields[kv[1]] = kv[2].trim().replace(/^['"]|['"]$/g, '');
  }
  return fields;
}

async function main() {
  await mkdir(COVERS_DIR, { recursive: true });

  const files = (await readdir(PROJECTS_DIR)).filter((f) => f.endsWith('.md'));
  let written = 0;
  let skipped = 0;

  for (const file of files) {
    const slug = file.replace(/\.md$/, '');
    const raw = await readFile(path.join(PROJECTS_DIR, file), 'utf8');
    const fm = readFrontmatter(raw);

    const target = path.join(COVERS_DIR, `${slug}.png`);

    // Never overwrite a real screenshot that has been dropped in.
    if (!force && existsSync(target)) {
      skipped++;
      continue;
    }

    const svg = buildSvg({ kind: fm.kind ?? 'Game', slug });

    await sharp(Buffer.from(svg)).png({ quality: 90, compressionLevel: 9 }).toFile(target);
    written++;
  }

  console.log(`covers: ${written} generated, ${skipped} left alone`);
  if (skipped && !force) {
    console.log('pass --force to regenerate the ones that already exist');
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
