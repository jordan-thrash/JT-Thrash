/**
 * Rebuilds project covers from the originals saved under
 * `src/content/projects/covers/_originals/`.
 *
 *   npm run covers:process
 *
 * No network required. Use this to finish the job if `npm run fetch:weebly`
 * downloaded the originals but could not build the covers, or any time the
 * cover treatment changes and you want to re-render from source.
 */

import { processAll, ORIGINALS_DIR, COVERS_DIR } from './covers-lib.mjs';

const result = await processAll();

if (result.missingSharp) {
  console.error('sharp is not installed. Run `npm install` first.');
  process.exit(1);
}

if (result.noOriginals) {
  console.error(`No originals found in ${ORIGINALS_DIR}.`);
  console.error('Run `npm run fetch:weebly` while the old site is still up.');
  process.exit(1);
}

if (!result.built) {
  console.error(`No originals in ${ORIGINALS_DIR} matched a known project slug.`);
  process.exit(1);
}

console.log(`\n${result.built} covers written to ${COVERS_DIR}`);

if (result.suspect.length) {
  console.log('\nunexpected dimensions — check these look right before pushing:');
  for (const line of result.suspect) console.log(`  ${line}`);
}
