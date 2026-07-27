/**
 * Shared between `fetch-weebly-images.mjs` and `process-covers.mjs`.
 *
 * The download and the image processing are separate concerns: one needs the
 * network and no dependencies, the other needs sharp and no network. Keeping
 * the manifest and the processing here lets either run without the other.
 */

import { readdir, readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';

export const COVERS_DIR = 'src/content/projects/covers';
export const ORIGINALS_DIR = path.join(COVERS_DIR, '_originals');

export const WIDTH = 1200;
export const HEIGHT = 800;

/** Matches --paper in src/styles/global.css, so letterboxing vanishes into the page. */
export const PAPER = { r: 244, g: 241, b: 235, alpha: 1 };

/**
 * slug (matching the markdown filename) → [filename on Weebly, width, height].
 *
 * The dimensions come from the `_width` / `_height` attributes in the old
 * gallery markup. They are checked against what actually arrives, so a silent
 * substitution — Weebly serving a placeholder, or a filename reused for
 * something else — fails loudly instead of quietly shipping the wrong cover.
 */
export const IMAGES = {
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

/** Loads sharp, returning null instead of throwing when it is not installed. */
export async function loadSharp() {
  try {
    return (await import('sharp')).default;
  } catch {
    return null;
  }
}

/**
 * Turns every saved original into a 1200x800 cover.
 *
 * `contain` rather than `cover`: these are screenshots at wildly different
 * aspect ratios — one is a 330x679 phone capture, another a 512x512 logo — and
 * cropping to 3:2 would cut the subject out of half of them.
 *
 * `withoutEnlargement` keeps the canvas at 1200x800 but refuses to scale a
 * small source up into it. MyLogger is only 420x280; blowing that up 2.9x
 * would look worse than letting it sit small and sharp on the page.
 */
export async function processAll() {
  const sharp = await loadSharp();
  if (!sharp) return { missingSharp: true, built: 0, suspect: [] };

  await mkdir(COVERS_DIR, { recursive: true });

  let originals = [];
  try {
    originals = await readdir(ORIGINALS_DIR);
  } catch {
    return { missingSharp: false, built: 0, suspect: [], noOriginals: true };
  }

  const built = [];
  const suspect = [];

  for (const file of originals) {
    const slug = path.basename(file, path.extname(file));
    const entry = IMAGES[slug];
    if (!entry) continue;

    const [, expectW, expectH] = entry;
    const buffer = await readFile(path.join(ORIGINALS_DIR, file));
    const meta = await sharp(buffer).metadata();

    const matches = meta.width === expectW && meta.height === expectH;
    if (!matches) {
      suspect.push(`${slug} (expected ${expectW}x${expectH}, got ${meta.width}x${meta.height})`);
    }

    const output = await sharp(buffer)
      .resize(WIDTH, HEIGHT, { fit: 'contain', background: PAPER, withoutEnlargement: true })
      .png({ compressionLevel: 9 })
      .toBuffer();

    await writeFile(path.join(COVERS_DIR, `${slug}.png`), output);
    console.log(
      `  ${matches ? 'ok  ' : 'WARN'}  ${slug.padEnd(28)} ${meta.width}x${meta.height} ${meta.format} → ${(output.length / 1024).toFixed(0)} kB`
    );
    built.push(slug);
  }

  return { missingSharp: false, built: built.length, suspect };
}
