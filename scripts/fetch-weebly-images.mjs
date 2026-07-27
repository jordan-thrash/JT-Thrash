/**
 * Downloads the project screenshots still hosted on the old Weebly site and
 * drops them in as real covers, replacing the generated placeholders.
 *
 *   node scripts/fetch-weebly-images.mjs
 *   node scripts/fetch-weebly-images.mjs --dry-run
 *
 * Run this from your own machine. It could not be run when the site was built
 * because the sandbox's network proxy blocks weebly.com outright.
 *
 * For each entry it downloads the image, converts it to a consistent 3:2 PNG,
 * writes it to `src/content/projects/covers/<slug>.png`, and leaves the
 * markdown frontmatter alone — the `cover:` field already points at that path.
 *
 * Do this before you take the Weebly site down. Once it is gone, so are these.
 */

import { writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const BASE = 'https://jordanthrash.weebly.com/uploads/1/2/5/3/125377564';
const COVERS_DIR = 'src/content/projects/covers';
const dryRun = process.argv.includes('--dry-run');

/** slug (matching the markdown filename) → image filename on Weebly. */
const IMAGES = {
  'typing-tower-defense': 'screen-shot-2024-04-07-at-1-04-16-pm.png',
  'my-logger': 'my-logger-420-x-280-px.png',
  'retro-ufo-shooter': 'screenshot-2024-03-21-102308.png',
  segmentel: 'screenshot-2023-09-29-105704.png',
  mayz: 'mayzlogo.jpg',
  'horror-maze-project': 'screenshot-4-1-orig.png',
  'bullet-game': 'map-1-orig.png',
  'saucy-fields': 'saucy1-orig.jpg',
  'hydro-hustle': 'lilsquirterhaha-4.png',
  splittle: 'screenshot-20191003-131645-splittle.jpg',
  'belonging-to-soil': 'belongingtosoil-6-978x550.jpg',
  'predator-prey-simulation': 'screen-shot-2024-04-06-at-7-45-22-pm.png',
  'maze-game': 'screen-shot-2024-04-06-at-7-42-16-pm.png',
};

const WIDTH = 1200;
const HEIGHT = 800;

// Matches --paper in src/styles/global.css, so letterbox bars vanish into the page.
const PAPER = { r: 244, g: 241, b: 235, alpha: 1 };

async function download(url) {
  const response = await fetch(url, {
    headers: {
      // Weebly serves a 403 to obvious bots.
      'User-Agent':
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36',
      Accept: 'image/avif,image/webp,image/png,image/*,*/*;q=0.8',
      Referer: 'https://jordanthrash.weebly.com/',
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  return Buffer.from(await response.arrayBuffer());
}

async function main() {
  await mkdir(COVERS_DIR, { recursive: true });

  const entries = Object.entries(IMAGES);
  let ok = 0;
  const failed = [];

  for (const [slug, filename] of entries) {
    const url = `${BASE}/${filename}`;

    if (dryRun) {
      console.log(`would fetch  ${slug.padEnd(28)} ${url}`);
      continue;
    }

    process.stdout.write(`${slug.padEnd(28)} `);

    try {
      const buffer = await download(url);

      // `contain` rather than `cover`: these are screenshots at wildly different
      // aspect ratios — one is a 330x679 phone capture, another a 512x512 logo —
      // and cropping to 3:2 would cut the subject out of half of them.
      // Letterboxing onto the site's paper colour keeps every frame whole and
      // makes the padding disappear into the page.
      const output = await sharp(buffer)
        .resize(WIDTH, HEIGHT, { fit: 'contain', background: PAPER })
        .png({ compressionLevel: 9 })
        .toBuffer();

      await writeFile(path.join(COVERS_DIR, `${slug}.png`), output);
      console.log(`ok  (${(output.length / 1024).toFixed(0)} kB)`);
      ok++;
    } catch (error) {
      console.log(`FAILED  ${error.message}`);
      failed.push(slug);
    }
  }

  if (dryRun) return;

  console.log(`\n${ok}/${entries.length} downloaded`);

  if (failed.length) {
    console.log(`failed: ${failed.join(', ')}`);
    console.log('those keep their generated placeholder covers');
  }

  console.log('\nRun `npm run covers:force` if you ever want the placeholders back.');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
