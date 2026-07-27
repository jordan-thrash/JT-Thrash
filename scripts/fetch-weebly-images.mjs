/**
 * Downloads the project screenshots still hosted on the old Weebly site.
 *
 *   npm run fetch:weebly
 *   npm run fetch:weebly -- --dry-run
 *
 * Run this from your own machine, and do it before the Weebly site goes down.
 * Once it is gone, so are these images.
 *
 * Two stages, deliberately separated:
 *
 *   1. Download every original to `covers/_originals/`. This needs nothing but
 *      Node — no dependencies, no image library. It is the step you cannot
 *      redo later, so nothing is allowed to block it.
 *   2. Process each one into a 1200x800 cover at `covers/<slug>.png`. This
 *      needs sharp, and it can be re-run any time from the saved originals
 *      via `npm run covers:process`.
 *
 * If sharp is missing, stage 1 still completes and the script tells you how to
 * finish. The originals stay in the repo afterwards, so covers can be
 * regenerated without ever touching Weebly again.
 */

import { writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { IMAGES, COVERS_DIR, ORIGINALS_DIR, processAll } from './covers-lib.mjs';

const BASE = 'https://jordanthrash.weebly.com/uploads/1/2/5/3/125377564';
const dryRun = process.argv.includes('--dry-run');

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

  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return Buffer.from(await response.arrayBuffer());
}

async function main() {
  const entries = Object.entries(IMAGES);

  if (dryRun) {
    for (const [slug, [filename, w, h]] of entries) {
      console.log(`would fetch  ${`${slug} ${w}x${h}`.padEnd(40)} ${BASE}/${filename}`);
    }
    return;
  }

  await mkdir(ORIGINALS_DIR, { recursive: true });
  await mkdir(COVERS_DIR, { recursive: true });

  console.log('Stage 1 — downloading originals\n');

  const failed = [];
  let saved = 0;

  for (const [slug, [filename]] of entries) {
    process.stdout.write(`  ${slug.padEnd(28)} `);
    try {
      const buffer = await download(`${BASE}/${filename}`);
      const ext = path.extname(filename).toLowerCase() || '.bin';
      await writeFile(path.join(ORIGINALS_DIR, `${slug}${ext}`), buffer);
      console.log(`saved  ${(buffer.length / 1024).toFixed(0)} kB`);
      saved++;
    } catch (error) {
      console.log(`FAILED  ${error.message}`);
      failed.push(slug);
    }
  }

  console.log(`\n  ${saved}/${entries.length} originals saved to ${ORIGINALS_DIR}`);

  if (failed.length) {
    console.log(`  failed: ${failed.join(', ')}`);
  }

  if (!saved) {
    console.log('\nNothing downloaded, so there is nothing to process.');
    process.exitCode = 1;
    return;
  }

  console.log('\nStage 2 — building covers\n');

  const result = await processAll();

  if (result.missingSharp) {
    console.log('  sharp is not installed, so the covers were not built.');
    console.log('  Your originals are safe. Finish with:\n');
    console.log('    npm install');
    console.log('    npm run covers:process\n');
    process.exitCode = 1;
    return;
  }

  console.log(`\n  ${result.built} covers written to ${COVERS_DIR}`);

  if (result.suspect.length) {
    console.log('\n  unexpected dimensions — check these look right before pushing:');
    for (const line of result.suspect) console.log(`    ${line}`);
  }

  console.log('\nCommit both the originals and the covers. Keeping the originals');
  console.log('means covers can be rebuilt later without the Weebly site.');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
