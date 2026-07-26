# jordanthrash.com

Portfolio site — replaces the Weebly site at `jordanthrash.weebly.com`.

Built with [Astro](https://astro.build) and Tailwind CSS v4, deployed to Netlify.
Ships as fully static HTML with a few kilobytes of JavaScript (scroll reveal and
the index hover preview) and no client-side framework.

---

## Running it

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # → dist/
npm run preview  # serve the built output
npm run check    # TypeScript + Astro diagnostics
```

Node 22 or newer.

---

## Before you launch

Two things need your attention. Everything else works as-is.

### 1. Pull your screenshots off Weebly — do this first

The project covers are currently **generated placeholder artwork**, not your real
screenshots. Your actual game screenshots are still sitting on the Weebly
servers, and they disappear when you take that site down.

```bash
npm run fetch:weebly
```

That downloads all 13 screenshots, normalizes them to a consistent 3:2 frame, and
drops them into `src/content/projects/covers/` where the site already expects
them. The generated placeholders are kept alongside as `*.generated.png` so you
can compare — delete those once you're happy.

**Run it before the Weebly site goes away.** After that the images are gone.

### 2. Check the facts in `src/data/site.ts`

Weebly blocks automated page fetches, so only your homepage source was available.
Everything from your `about-me.html`, `my-skills.html` and `contact.html` pages
had to be reconstructed. Fields needing review are marked `@verify`:

- Your bio (`about.paragraphs`) — written from your public work, not your words
- The capability areas in `about.stack` — trim anything you wouldn't want to be
  interviewed on
- Job titles, companies and dates in `experience`
- `education`
- The email address in `contact.email`

The project write-ups have the same issue. Files containing
`<!-- TODO: replace with the write-up from the old site's ... -->` have
placeholder body text — paste in your original copy from the corresponding
Weebly page and delete the comment.

Confident and carried over verbatim: **MyLogger** (from your GitHub description)
and **Splittle** (from your public write-up).

### On positioning

The copy leads with **what gets built**, not with a job title. Apps, backends,
platforms and games are named as four facets of the same practice, in that
order, and no one of them is the identity. That's deliberate in both
directions — the old Weebly site said "Game Developer" throughout, and framing
it purely as backend engineering undersells the range just as badly.

Two rules if you rewrite any of this:

- **Don't lead with a label.** "Apps, backends, platforms, games" beats
  "Software engineer who…". The title in `site.role` covers the header and the
  structured data; the body copy shouldn't repeat it.
- **Don't apologize for the games.** They're where the systems instincts got
  sharp, not a phase you outgrew. The index is mostly games today because that's
  what has shipped. As apps and services land the balance corrects itself, and
  none of the copy needs to change.

### Keeping the copy from reading like a machine

```bash
npm run lint:copy
```

This reads every string a visitor actually sees — `src/data/site.ts`, project
frontmatter and bodies, and the hard-coded copy in the pages — and flags the
patterns that make writing read as generated:

| Check | What it catches |
| --- | --- |
| `em-dash` | More than 0.7 em dashes per 100 words. The single loudest tell. |
| `uncontracted` | "it is", "does not", "would rather". Nobody talks like that. |
| `passive` | "was constrained by", "is generated" — say who did it. |
| `buzzword` | delve, leverage, seamless, robust, at its core, that said… |
| `not-just-but` | "It's not just X, it's Y" and its relatives. |
| `triad` | Three-part lists used as a default rhythm rather than a choice. |
| `monotone` | Sentence lengths clustered too tightly. Vary short and long. |
| `en-GB` | colour, mould, memorise. You're American; the copy should be too. |
| `empty-intensifier` | truly, really, incredibly. Cut them and nothing is lost. |

It exits non-zero when anything trips, so it works as a pre-commit hook or a CI
step. The thresholds are opinions rather than laws — if a rule argues with a
sentence that genuinely reads well, change the rule. It exists to catch drift
across a lot of copy, not to win an argument about one line.

Worth running after you paste in the old Weebly write-ups, since the checks only
cover what is currently in the repo.

---

## Editing content

### Adding a project

Copy `src/content/projects/_example.md`, rename it, fill it in and set
`draft: false`. That file documents every field inline, so it's the fastest
path — you shouldn't need this section.

The filename becomes the URL: `vend-ready.md` → `/work/vend-ready`. Use
`order` to place it in the index (highest first); leave gaps between numbers so
you can slot things in later without renumbering.

The schema in `src/content.config.ts` is enforced at build time, so a typo in a
field name fails the build instead of rendering an empty row. If you add a
category that `kind` doesn't cover, add it to the enum there — nothing is
styled by it today, it exists so the index can be grouped or filtered later
without a migration.

No screenshot yet? Run `npm run covers` and it generates matching placeholder
artwork for anything missing. It never overwrites a real image, so you can drop
the screenshot in later and it just takes over.

### Everything else

All other copy — hero, about, skills, experience, contact, nav — lives in
`src/data/site.ts`. No component edits needed.

---

## Deploying to Netlify

1. Push this repo to GitHub.
2. In Netlify: **Add new site → Import an existing project**, pick the repo.
3. Build settings are read from `netlify.toml`; you shouldn't need to type
   anything. (Build `npm run build`, publish `dist`.)
4. Deploy.

### The site URL takes care of itself

There's nothing to edit after the first deploy. `astro.config.mjs` reads
`process.env.URL`, which Netlify sets to the site's primary address on every
production build, and `robots.txt` is generated from the same value. Attach a
custom domain later and canonical tags, Open Graph URLs, `sitemap.xml` and
`robots.txt` all follow on the next deploy.

Local builds fall back to `http://localhost:4321`, which never leaves your
machine.

### Redirects

`netlify.toml` maps the old Weebly URLs to their new homes — `/splittle.html`
→ `/work/splittle`, `/about.html` → `/#about`, and so on — so existing links and
Google results land somewhere useful.

All 13 old project pages are redirected individually. If you rename a project
file, update its redirect too, or that old URL starts 404ing.

---

## Design notes

The visual language is print, not app UI. If you're editing styles, the rules
that keep it coherent are:

- **No cards, no pills, no chips.** Structure comes from hairline rules and
  alignment. Metadata is set as plain text in a monospace face, never inside a
  rounded container. Square corners, no shadows, no gradients, no blur.
- **One theme** — warm paper, near-black ink, a single vermillion accent used
  sparingly. Color is authored in OKLCH behind semantic variables in
  `src/styles/global.css`; changing `--accent` there re-skins the whole site.
- **One typeface, two registers.** Everything except monospace metadata is
  Archivo. Display type is the same family pushed out on the variable axes —
  `font-weight: 800`, `font-stretch: 116%`, tight negative tracking. Body text
  sits at normal width and weight. The width axis is what separates a statement
  from interface text, so reach for `font-stretch` before reaching for another
  font. JetBrains Mono is the only second family, reserved for things that read
  as a specification: years, column headers, labels, section numbers.
- **The index is the centerpiece.** Projects are a numbered table, not a grid.
  Hovering a row wipes it vermillion and floats a preview beside the cursor;
  on touch and narrow screens that becomes an inline thumbnail instead.
- **Motion** — scroll reveals, the hero line rise and the cursor preview all
  respect `prefers-reduced-motion`. The reveal CSS is gated behind a JS-set
  class, so if JavaScript fails nothing is ever left invisible.
- **Images** — covers run through Astro's asset pipeline: resized, converted to
  WebP, content-hashed and served with `srcset`.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run lint:copy` | Checks the prose for machine-written tells (see below) |
| `npm run fetch:weebly` | Downloads project screenshots from the old Weebly site |
| `npm run covers` | Generates placeholder covers for projects missing one |
| `npm run covers:force` | Regenerates every placeholder cover |
| `npm run og` | Rebuilds `public/og.png`, the social share card |
| `npm run preview:file` | Bundles the homepage into one shareable HTML file |

Re-run `npm run og` after changing your name, role or the accent color.

`npm run og` resolves fonts through the operating system rather than
node_modules, so it needs [Archivo](https://fonts.google.com/specimen/Archivo)
installed locally to match the site. Without it the card still renders, just in
a fallback grotesque — the script warns you when that happens.
