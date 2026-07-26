/**
 * Checks the site's prose for the tells that make writing read as machine-
 * generated, plus a few house-style rules.
 *
 *   node scripts/lint-copy.mjs           # report
 *   node scripts/lint-copy.mjs --quiet   # only fail/pass, for CI
 *
 * It reads the copy people actually see: the strings in `src/data/site.ts`, the
 * frontmatter and body of every project, and the hard-coded copy in the pages.
 * Code, comments, class names and TODO markers are stripped first.
 *
 * The thresholds below are opinions, not laws. If a rule fights you on a
 * sentence that genuinely reads well, change the rule — the point is to catch
 * drift across a lot of copy, not to win an argument about one line.
 */

import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

const quiet = process.argv.includes('--quiet');

/* -------------------------------------------------------------------------
   Rules
------------------------------------------------------------------------- */

/** Words that show up far more in generated text than in anyone's writing. */
const BUZZWORDS = [
  'delv', 'tapestry', 'testament to', 'landscape of', 'realm of', 'navigate the',
  'leverage', 'seamless', 'seamlessly', 'elevate', 'unlock the', 'harness the',
  'underscore', 'pivotal', 'myriad', 'plethora', 'moreover', 'furthermore',
  'in today', 'ever-evolving', 'cutting-edge', 'game-chang', 'robust and',
  'meticulous', 'intricate', 'multifaceted', 'holistic', 'synergy', 'paradigm',
  'best-in-class', 'world-class', 'seasoned', 'passionate about', 'dive into',
  'deep dive', 'at its core', 'that said', 'it is worth noting', 'needless to say',
  'the journey', 'craft compelling', 'bring to life', 'unleash',
];

/** Constructions that read as generated cadence rather than as speech. */
const CADENCE = [
  { name: 'not-just-but', re: /\b(not|isn't|isn’t|is not)\s+(just|only|merely)\b[^.!?]*\b(it'?s|but|it is)\b/gi },
  { name: 'more-than-just', re: /\bmore than just\b/gi },
  { name: 'about-x-its-y', re: /\bit'?s not about\b[^.!?]*\bit'?s about\b/gi },
  { name: 'rhetorical-question', re: /^[^.!?]*\?\s*$/gm },
  { name: 'hedge', re: /\b(arguably|perhaps|somewhat|fairly unique|quite possibly)\b/gi },
  { name: 'empty-intensifier', re: /\b(truly|really|very|incredibly|extremely|remarkably)\s+\w+/gi },
];

/**
 * Passive voice: a form of "to be" followed by a past participle. Deliberately
 * loose — it over-reports slightly, which is the right failure mode for a
 * thing you read by eye.
 */
const PASSIVE =
  /\b(?:is|are|was|were|be|been|being|get|gets|got)\s+(?:\w+ly\s+)?(\w+(?:ed|en|wn|de|ne|t))\b(?=\s+(?:by|through|with|in|for|when|and|,|\.|$))/gi;

/** Past participles the passive regex catches that are actually adjectives. */
const PASSIVE_ALLOW = new Set([
  'based', 'used', 'left', 'meant', 'built', 'spent', 'sent', 'set', 'let', 'put',
  'interested', 'tired', 'excited', 'related', 'limited', 'said', 'went', 'kept',
  'felt', 'lost', 'found', 'told', 'held', 'brought', 'caught', 'taught', 'bent',
]);

/**
 * Formal expansions where a person would contract. Consistently avoiding
 * contractions is one of the strongest tells there is.
 *
 * The lookbehinds carve out comparatives — "as true of X as it is of Y" cannot
 * take a contraction without breaking, and neither can a stranded "that is" at
 * the end of a clause.
 */
const UNCONTRACTED = [
  [/(?<!\bas )\bit is\b(?! that)/gi, "it's"],
  [/\bdoes not\b/gi, "doesn't"],
  [/\bdo not\b/gi, "don't"],
  [/\bis not\b/gi, "isn't"],
  [/\bare not\b/gi, "aren't"],
  [/\bwas not\b/gi, "wasn't"],
  [/\bcannot\b/gi, "can't"],
  [/\bwill not\b/gi, "won't"],
  [/\bwould rather\b/gi, "'d rather"],
  [/\bthat is\b(?! the)/gi, "that's"],
  [/\bthere is\b/gi, "there's"],
  [/\bI have\b/g, "I've"],
  [/\bI am\b/g, "I'm"],
  [/\byou are\b/gi, "you're"],
  [/\bhave not\b/gi, "haven't"],
];

/** The site is written by an American. These spellings are not. */
const BRITISH = [
  [/\bcolour/gi, 'color'], [/\bbehaviour/gi, 'behavior'], [/\bapologis/gi, 'apologiz'],
  [/\bmemoris/gi, 'memoriz'], [/\brecognis/gi, 'recogniz'], [/\borganis/gi, 'organiz'],
  [/\bmould\b/gi, 'mold'], [/\bgrey\b/gi, 'gray'], [/\bcentre\b/gi, 'center'],
  [/\bpractis/gi, 'practic'], [/\bfavour/gi, 'favor'], [/\bcustomis/gi, 'customiz'],
  [/\banalyse/gi, 'analyze'], [/\bnormalis/gi, 'normaliz'], [/\btravelling/gi, 'traveling'], [/\bwhilst\b/gi, 'while'],
  [/\bamongst\b/gi, 'among'], [/\btowards\b/gi, 'toward'],
];

/* -------------------------------------------------------------------------
   Extraction
------------------------------------------------------------------------- */

/** Pull quoted string literals out of the data file. */
async function fromDataFile(file) {
  const raw = await readFile(file, 'utf8');
  const withoutComments = raw
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/^\s*\/\/.*$/gm, '');

  const strings = [];
  const re = /(['"`])((?:\\.|(?!\1)[^\\])*?)\1/g;
  let match;
  while ((match = re.exec(withoutComments))) {
    const value = match[2];
    // Skip identifiers, URLs, and anything too short to be prose.
    if (value.length < 12) continue;
    if (/^https?:|^mailto:|^\.\/|^[a-z-]+$/i.test(value)) continue;
    strings.push(value);
  }
  return strings;
}

/** Frontmatter prose plus the markdown body, minus comments and headings. */
async function fromProject(file) {
  const raw = await readFile(file, 'utf8');
  const fm = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!fm) return [];

  const strings = [];
  const summary = fm[1].match(/^summary:\s*(.+)$/m);
  if (summary) strings.push(summary[1].replace(/^['"]|['"]$/g, ''));

  const body = fm[2]
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/^#{1,6}\s+.*$/gm, '')
    .replace(/`[^`]*`/g, '')
    .trim();

  if (body) strings.push(body);
  return strings;
}

/** Text nodes and copy-bearing attributes from an Astro page. */
async function fromAstro(file) {
  const raw = await readFile(file, 'utf8');
  // Drop frontmatter, <style>, <script> and HTML comments.
  const markup = raw
    .replace(/^---[\s\S]*?---/, '')
    .replace(/<style[\s\S]*?<\/style>/g, '')
    .replace(/<script[\s\S]*?<\/script>/g, '')
    .replace(/<!--[\s\S]*?-->/g, '');

  const strings = [];

  const lede = markup.match(/lede=\{?["'`]([^"'`]+)["'`]/g) ?? [];
  for (const item of lede) strings.push(item.replace(/^lede=\{?["'`]|["'`]$/g, ''));

  const text = markup
    .replace(/\{[^{}]*\}/g, ' ')
    .replace(/<[^>]+>/g, '\n')
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 20 && /[a-z]{3}/i.test(line));

  strings.push(...text);
  return strings;
}

/* -------------------------------------------------------------------------
   Checks
------------------------------------------------------------------------- */

function sentences(text) {
  return text
    .replace(/\s+/g, ' ')
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function analyse(label, chunks) {
  const text = chunks.join('\n\n');
  const words = text.split(/\s+/).filter(Boolean).length;
  const sents = sentences(text);
  const findings = [];

  const emDashes = (text.match(/—/g) ?? []).length;
  // One em dash per ~150 words reads as punctuation; more reads as a tic.
  const emDashPer100 = words ? (emDashes / words) * 100 : 0;
  if (emDashPer100 > 0.7) {
    findings.push({
      rule: 'em-dash',
      detail: `${emDashes} em dashes in ${words} words (${emDashPer100.toFixed(2)}/100w, budget 0.70)`,
    });
  }

  let passiveCount = 0;
  for (const sentence of sents) {
    for (const m of sentence.matchAll(PASSIVE)) {
      if (PASSIVE_ALLOW.has(m[1].toLowerCase())) continue;
      passiveCount++;
      findings.push({ rule: 'passive', detail: `"${m[0]}" — ${sentence.slice(0, 90)}` });
    }
  }

  for (const word of BUZZWORDS) {
    const re = new RegExp(`\\b${word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'gi');
    const hits = text.match(re);
    if (hits) findings.push({ rule: 'buzzword', detail: `"${hits[0]}" ×${hits.length}` });
  }

  for (const { name, re } of CADENCE) {
    const hits = text.match(re);
    if (hits) {
      for (const hit of hits.slice(0, 3)) {
        findings.push({ rule: name, detail: `"${hit.trim().slice(0, 80)}"` });
      }
    }
  }

  for (const [re, fix] of UNCONTRACTED) {
    const hits = text.match(re);
    if (hits) findings.push({ rule: 'uncontracted', detail: `"${hits[0]}" ×${hits.length} → ${fix}` });
  }

  for (const [re, fix] of BRITISH) {
    const hits = text.match(re);
    if (hits) findings.push({ rule: 'en-GB', detail: `"${hits[0]}" ×${hits.length} → ${fix}` });
  }

  // Triads ("x, y and z") are natural once; three in a row is a cadence tic.
  const triads = (text.match(/\b\w+, \w+[^.!?]{0,40}\band\b \w+/g) ?? []).length;
  if (triads > Math.max(2, sents.length * 0.25)) {
    findings.push({ rule: 'triad', detail: `${triads} three-part lists across ${sents.length} sentences` });
  }

  // Uniform sentence length is a strong generated-text signal; humans vary.
  const lengths = sents.map((s) => s.split(/\s+/).length).filter((n) => n > 3);
  if (lengths.length >= 5) {
    const mean = lengths.reduce((a, b) => a + b, 0) / lengths.length;
    const sd = Math.sqrt(lengths.reduce((a, b) => a + (b - mean) ** 2, 0) / lengths.length);
    if (sd < 4.5) {
      findings.push({
        rule: 'monotone',
        detail: `sentence length sd ${sd.toFixed(1)} (want > 4.5) — vary short and long`,
      });
    }
  }

  return { label, words, sentences: sents.length, findings };
}

/* -------------------------------------------------------------------------
   Run
------------------------------------------------------------------------- */

const reports = [];

reports.push(analyse('src/data/site.ts', await fromDataFile('src/data/site.ts')));

const projectDir = 'src/content/projects';
for (const file of (await readdir(projectDir)).filter((f) => f.endsWith('.md') && !f.startsWith('_'))) {
  reports.push(analyse(path.join(projectDir, file), await fromProject(path.join(projectDir, file))));
}

for (const file of ['src/pages/index.astro', 'src/pages/404.astro', 'src/pages/work/[...slug].astro']) {
  reports.push(analyse(file, await fromAstro(file)));
}

let total = 0;
const byRule = new Map();

for (const report of reports) {
  total += report.findings.length;
  for (const finding of report.findings) {
    byRule.set(finding.rule, (byRule.get(finding.rule) ?? 0) + 1);
  }

  if (quiet || !report.findings.length) continue;

  console.log(`\n${report.label}  (${report.words} words, ${report.sentences} sentences)`);
  for (const finding of report.findings) {
    console.log(`  ${finding.rule.padEnd(14)} ${finding.detail}`);
  }
}

console.log(`\n${'─'.repeat(60)}`);
if (total === 0) {
  console.log('copy: clean');
} else {
  const summary = [...byRule.entries()].sort((a, b) => b[1] - a[1]).map(([r, n]) => `${r} ${n}`);
  console.log(`copy: ${total} findings — ${summary.join(', ')}`);
}

process.exit(total === 0 ? 0 : 1);
