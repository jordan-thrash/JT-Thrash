# jordanthrash.com

Portfolio site — replaces the Weebly site at `jordanthrash.weebly.com`.

Built with [Astro](https://astro.build) and Tailwind CSS v4, deployed to Netlify.
Ships as fully static HTML with a few kilobytes of JavaScript (theme toggle,
mobile menu, scroll reveal) and no client-side framework.

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
summary: One or two sentences. Shows on the card and in link previews.
order: 80          # higher sorts first
year: '2024'
kind: Game         # Game | Tool | Web | Backend — drives the chip and cover hue
tech: ['Unity', 'C#']
featured: false    # true pins it to the large cards at the top
links:
  - label: 'itch.io'
    href: 'https://...'
cover: './covers/project-name.png'
draft: false       # true hides it from production builds
---

Markdown body — becomes the project detail page.
```

The schema in `src/content.config.ts` is enforced at build time, so a typo in a
field name fails the build instead of rendering an empty card.

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
Google results land somewhere useful. If you add project pages whose old Weebly
URL differs from the new slug, add a redirect there too.

---

## Design notes

- **Theme** — dark and light are both fully designed. The site follows the
  visitor's OS setting until they use the toggle, after which their choice is
  remembered. An inline script in `<head>` applies the theme before first paint,
  so there is no flash of the wrong background.
- **Colour** — authored in OKLCH so lightness steps stay perceptually even
  across both themes. Every colour goes through a semantic variable in
  `src/styles/global.css`; changing `--accent` there re-skins the whole site.
- **Motion** — scroll reveals, the hero line wipe and the pointer spotlight all
  respect `prefers-reduced-motion`. The reveal CSS is gated behind a JS-set
  class, so if JavaScript fails nothing is ever left invisible.
- **Navigation** — cross-document view transitions animate between pages, with
  project covers morphing from card to detail page in supporting browsers.
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
