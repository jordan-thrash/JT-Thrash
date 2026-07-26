/**
 * Generates a placeholder cover image for every project that does not already
 * have a real screenshot.
 *
 *   node scripts/generate-covers.mjs          # only fills in missing covers
 *   node scripts/generate-covers.mjs --force  # regenerate everything
 *
 * Each cover is deterministic: the same slug always produces the same artwork,
 * so the index stays stable between builds. The motif is seeded from the slug,
 * so no two look alike.
 *
 * These are drawn as ink linework on paper to match the site — technical
 * drawings rather than decorative gradients. They exist so no row in the index
 * previews an empty frame; replace them with real screenshots as they arrive
 * (`scripts/fetch-weebly-images.mjs` does that for the images still on Weebly).
 */

import { readdir, readFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const PROJECTS_DIR = 'src/content/projects';
const COVERS_DIR = path.join(PROJECTS_DIR, 'covers');
const WIDTH = 1200;
const HEIGHT = 800;

const force = process.argv.includes('--force');

// Matches the site's tokens: warm paper, near-black ink, vermillion accent.
const PAPER = '#f4f1eb';
const INK = '#2a2722';
const ACCENT = '#c2410c';

/** Deterministic 32-bit hash — same slug in, same artwork out. */
function hash(input) {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** Seeded PRNG so motifs are varied but reproducible. */
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
 * Six motifs, chosen by seed. All are thin ink linework with a single accent
 * element, so they read as plate figures rather than as decoration.
 */
function motif(index, random) {
  const parts = [];
  const line = (extra = '') =>
    `fill="none" stroke="${INK}" stroke-width="1.25" opacity="0.55" ${extra}`;

  if (index === 0) {
    // Concentric arcs from the lower right.
    for (let i = 0; i < 11; i++) {
      parts.push(
        `<circle cx="${WIDTH - 140}" cy="${HEIGHT + 30}" r="${130 + i * 84}" ${line()}/>`
      );
    }
    parts.push(`<circle cx="${WIDTH - 140}" cy="${HEIGHT + 30}" r="${130 + 4 * 84}" fill="none" stroke="${ACCENT}" stroke-width="2.5"/>`);
  } else if (index === 1) {
    // Ruled diagonal hatching with one accent rule.
    const accentAt = 6 + Math.floor(random() * 10);
    for (let i = 0; i < 26; i++) {
      const x = i * 62 - 260;
      const isAccent = i === accentAt;
      parts.push(
        `<line x1="${x}" y1="-160" x2="${x}" y2="${HEIGHT + 160}" fill="none" stroke="${isAccent ? ACCENT : INK}" stroke-width="${isAccent ? 3 : 1.25}" opacity="${isAccent ? 1 : 0.42}" transform="rotate(20 ${WIDTH / 2} ${HEIGHT / 2})"/>`
      );
    }
  } else if (index === 2) {
    // Dot matrix with a scattering of accent nodes.
    for (let row = 0; row < 11; row++) {
      for (let col = 0; col < 17; col++) {
        const isAccent = random() > 0.94;
        const r = isAccent ? 6 : 3;
        parts.push(
          `<circle cx="${col * 70 + 55}" cy="${row * 70 + 55}" r="${r}" fill="${isAccent ? ACCENT : INK}" opacity="${isAccent ? 1 : 0.34}"/>`
        );
      }
    }
  } else if (index === 3) {
    // A wandering path — the maze and generation projects.
    let x = 60;
    let y = HEIGHT / 2;
    let d = `M ${x} ${y}`;
    for (let i = 0; i < 30; i++) {
      x += 30 + random() * 46;
      y += (random() - 0.5) * 290;
      y = Math.max(70, Math.min(HEIGHT - 70, y));
      d += ` L ${x.toFixed(1)} ${y.toFixed(1)}`;
      if (x > WIDTH + 40) break;
    }
    parts.push(`<path d="${d}" fill="none" stroke="${ACCENT}" stroke-width="2.5" stroke-linejoin="round"/>`);
    parts.push(`<path d="${d}" fill="none" stroke="${INK}" stroke-width="12" opacity="0.07"/>`);
  } else if (index === 4) {
    // Stacked contour lines.
    for (let i = 0; i < 9; i++) {
      const yBase = 70 + i * 82;
      const amp = 18 + random() * 44;
      let d = `M -40 ${yBase}`;
      for (let x = 0; x <= WIDTH + 80; x += 60) {
        const dir = (x / 60) % 2 === 0 ? amp : -amp;
        d += ` Q ${x + 30} ${(yBase + dir).toFixed(1)} ${x + 60} ${yBase}`;
      }
      const isAccent = i === 4;
      parts.push(
        `<path d="${d}" fill="none" stroke="${isAccent ? ACCENT : INK}" stroke-width="${isAccent ? 2.5 : 1.25}" opacity="${isAccent ? 1 : 0.42}"/>`
      );
    }
  } else {
    // Nested rotated squares.
    for (let i = 0; i < 12; i++) {
      const size = 90 + i * 66;
      const isAccent = i === 5;
      parts.push(
        `<rect x="${(WIDTH - size) / 2}" y="${(HEIGHT - size) / 2}" width="${size}" height="${size}" fill="none" stroke="${isAccent ? ACCENT : INK}" stroke-width="${isAccent ? 2.5 : 1.25}" opacity="${isAccent ? 1 : 0.4}" transform="rotate(${i * 7} ${WIDTH / 2} ${HEIGHT / 2})"/>`
      );
    }
  }

  return parts.join('\n    ');
}

function buildSvg({ slug }) {
  const seed = hash(slug);
  const random = rng(seed);
  const motifIndex = seed % 6;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
  <defs>
    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="${INK}" stroke-opacity="0.05" stroke-width="1"/>
    </pattern>
    <clipPath id="frame">
      <rect width="${WIDTH}" height="${HEIGHT}"/>
    </clipPath>
  </defs>

  <rect width="${WIDTH}" height="${HEIGHT}" fill="${PAPER}"/>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#grid)"/>

  <g clip-path="url(#frame)">
    ${motif(motifIndex, random)}
  </g>
</svg>`;
}

/** Minimal frontmatter reader — enough for the one field we need. */
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
    const target = path.join(COVERS_DIR, `${slug}.png`);

    // Never overwrite a real screenshot that has been dropped in.
    if (!force && existsSync(target)) {
      skipped++;
      continue;
    }

    await readFile(path.join(PROJECTS_DIR, file), 'utf8').then(readFrontmatter);

    await sharp(Buffer.from(buildSvg({ slug })))
      .png({ compressionLevel: 9 })
      .toFile(target);
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
