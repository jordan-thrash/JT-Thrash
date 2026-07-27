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

/**
 * slug (matching the markdown filename) → [filename on Weebly, width, height].
 *
 * The dimensions come from the `_width` / `_height` attributes in the old
 * gallery markup. They are checked against what actually arrives, so a silent
 * substitution — Weebly serving a placeholder, or a filename that has been
 * reused for something else — fails loudly instead of quietly shipping the
 * wrong screenshot.
 */
const IMAGES = {
  'typing-tower-defense': ['screen-shot-2024-04-07-at-1-04-16-pm.png', 800, 501],
  'my-logger': ['my-logger-420-x-280-px.png', 420, 280],
  'retro-ufo-shooter': ['screenshot-2024-03-21-102308.png', 985, 557],
  segmentel: ['screenshot-2023-09-29-105704.png', 800, 452],
  mayz: ['mayzlogo.jpg', 512, 512],
  'horror-maze-project': ['screenshot-4-1-orig.png', 1100, 619],
  'bullet-game': ['map-1-orig.png', 1050, 526],
  'saucy-fields': ['saucy1-orig.jpg', 628, 355],
  'hydro-hustle': ['lilsquirterhaha-4.png', 475, 232],
  splittle: ['screenshot-20191003-131645-splittle.jpg', 330, 679],
  'belonging-to-soil': ['belongingtosoil-6-978x550.jpg', 978, 550],
  'predator-prey-simulation': ['screen-shot-2024-04-06-at-7-45-22-pm.png', 800, 547],
  'maze-game': ['screen-shot-2024-04-06-at-7-42-16-pm.png', 800, 790],
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
  const suspect = [];

  for (const [slug, [filename, expectW, expectH]] of entries) {
    const url = `${BASE}/${filename}`;

    if (dryRun) {
      console.log(`would fetch  ${slug.padEnd(28)} ${expectW}x${expectH}`.padEnd(52) + url);
      continue;
    }

    process.stdout.write(`${slug.padEnd(28)} `);

    try {
      const buffer = await download(url);
      const meta = await sharp(buffer).metadata();

      // Compare against the dimensions recorded in the old gallery markup, so a
      // wrong or substituted file is obvious rather than silently shipped.
      const matches = meta.width === expectW && meta.height === expectH;
      if (!matches) suspect.push(`${slug} (expected ${expectW}x${expectH}, got ${meta.width}x${meta.height})`);

      // `contain` rather than `cover`: these are screenshots at wildly different
      // aspect ratios — one is a 330x679 phone capture, another a 512x512 logo —
      // and cropping to 3:2 would cut the subject out of half of them.
      // Letterboxing onto the site's paper color keeps every frame whole and
      // makes the padding disappear into the page.
      //
      // `withoutEnlargement` keeps the canvas at 1200x800 but refuses to scale a
      // small source up into it. MyLogger is only 420x280; blowing that up 2.9x
      // would look worse than letting it sit small and sharp on the page.
      const output = await sharp(buffer)
        .resize(WIDTH, HEIGHT, { fit: 'contain', background: PAPER, withoutEnlargement: true })
        .png({ compressionLevel: 9 })
        .toBuffer();

      await writeFile(path.join(COVERS_DIR, `${slug}.png`), output);
      console.log(
        `${matches ? 'ok  ' : 'WARN'}  ${meta.width}x${meta.height} ${meta.format}  → ${(output.length / 1024).toFixed(0)} kB`
      );
      ok++;
    } catch (error) {
      console.log(`FAILED  ${error.message}`);
      failed.push(slug);
    }
  }

  if (dryRun) return;

  console.log(`\n${ok}/${entries.length} downloaded`);

  if (failed.length) {
    console.log(`\nfailed: ${failed.join(', ')}`);
    console.log('those keep their generated placeholder covers');
  }

  if (suspect.length) {
    console.log('\nunexpected dimensions — check these look right before pushing:');
    for (const line of suspect) console.log(`  ${line}`);
  }

  console.log('\nRun `npm run covers:force` if you ever want the placeholders back.');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
