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

That downloads all 13 screenshots, normalises them to a consistent 3:2 frame, and
drops them into `src/content/projects/covers/` where the site already expects
them. The generated placeholders are kept alongside as `*.generated.png` so you
can compare — delete those once you are happy.

**Run it before the Weebly site goes away.** After that the images are gone.

### 2. Check the facts in `src/data/site.ts`

Weebly blocks automated page fetches, so only your homepage source was available.
Everything from your `about-me.html`, `my-skills.html` and `contact.html` pages
had to be reconstructed. Fields needing review are marked `@verify`:

- Your bio (`about.paragraphs`) — written from your project list, not your words
- Job titles, companies and dates in `experience`
- `education`
- The email address in `contact.email`
- The hero stats (`13` projects, `6` years, VR)

The project write-ups have the same issue. Files containing
`<!-- TODO: replace with the write-up from the old site's ... -->` have
placeholder body text — paste in your original copy from the corresponding
Weebly page and delete the comment.

Confident and carried over verbatim: **MyLogger** (from your GitHub description)
and **Splittle** (from your public write-up).

---

## Editing content

### Adding or changing a project

One markdown file per project in `src/content/projects/`. The filename becomes
the URL — `splittle.md` → `/work/splittle`.

```markdown
---
title: Project Name
summary: One or two sentences. Used for link previews and the detail page.
order: 80                  # higher sorts to the top of the index
year: '2024'
kind: Game                 # Game | Tool | Web | Backend — only picks the cover motif
discipline: Tower defense  # the index's "Discipline" column. Two or three words.
tech: ['Unity', 'C#']      # the index's "Built with" column
featured: false
links:
  - label: 'itch.io'
    href: 'https://...'
cover: './covers/project-name.png'
draft: false               # true hides it from production builds
---

Markdown body — becomes the project detail page.
```

The schema in `src/content.config.ts` is enforced at build time, so a typo in a
field name fails the build instead of rendering an empty row.

New project with no screenshot yet? Run `npm run covers` and it generates
matching placeholder artwork for anything missing.

### Everything else

All other copy — hero, about, skills, experience, contact, nav — lives in
`src/data/site.ts`. No component edits needed.

---

## Deploying to Netlify

1. Push this repo to GitHub.
2. In Netlify: **Add new site → Import an existing project**, pick the repo.
3. Build settings are read from `netlify.toml`; you should not need to type
   anything. (Build `npm run build`, publish `dist`.)
4. Deploy.

### After the first deploy

Set the real URL in two places, or Open Graph previews and `sitemap.xml` will
point at the wrong host:

- `site` in `astro.config.mjs`
- the `Sitemap:` line in `public/robots.txt`

If you point a custom domain at it later, update both again.

### Redirects

`netlify.toml` maps the old Weebly URLs to their new homes — `/splittle.html`
→ `/work/splittle`, `/about.html` → `/#about`, and so on — so existing links and
Google results land somewhere useful.

All 13 old project pages are redirected individually. If you rename a project
file, update its redirect too, or that old URL starts 404ing.

---

## Design notes

The visual language is print, not app UI. If you are editing styles, the rules
that keep it coherent are:

- **No cards, no pills, no chips.** Structure comes from hairline rules and
  alignment. Metadata is set as plain text in a monospace face, never inside a
  rounded container. Square corners, no shadows, no gradients, no blur.
- **One theme** — warm paper, near-black ink, a single vermillion accent used
  sparingly. Colour is authored in OKLCH behind semantic variables in
  `src/styles/global.css`; changing `--accent` there re-skins the whole site.
- **One typeface, two registers.** Everything except monospace metadata is
  Archivo. Display type is the same family pushed out on the variable axes —
  `font-weight: 800`, `font-stretch: 116%`, tight negative tracking. Body text
  sits at normal width and weight. The width axis is what separates a statement
  from interface text, so reach for `font-stretch` before reaching for another
  font. JetBrains Mono is the only second family, reserved for things that read
  as a specification: years, column headers, labels, section numbers.
- **The index is the centrepiece.** Projects are a numbered table, not a grid.
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
| `npm run fetch:weebly` | Downloads project screenshots from the old Weebly site |
| `npm run covers` | Generates placeholder covers for projects missing one |
| `npm run covers:force` | Regenerates every placeholder cover |
| `npm run og` | Rebuilds `public/og.png`, the social share card |

Re-run `npm run og` after changing your name, role or the accent colour.

`npm run og` resolves fonts through the operating system rather than
node_modules, so it needs [Archivo](https://fonts.google.com/specimen/Archivo)
installed locally to match the site. Without it the card still renders, just in
a fallback grotesque — the script warns you when that happens.
