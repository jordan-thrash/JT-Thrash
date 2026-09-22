# Jordan Thrash’s portfolio

Game development and backend engineering portfolio, built with Astro and
Tailwind CSS v4 and hosted on Netlify. Static HTML with small scripts for scroll
reveals and project previews; no client-side framework.

## Development

Node 22 or newer.

```bash
npm ci
npm run dev       # http://localhost:4321
npm run check     # Astro and TypeScript diagnostics
npm run build     # Static site in dist/
npm run preview   # Serve the production build
npm run lint:copy # Editorial heuristics; review findings in context
```

## Content and positioning

The homepage introduces both game development and backend engineering, then
shows three games, Jordan’s personal story, the project archive, and professional
experience. Game pages explain what the player does and Jordan’s contribution.
Backend experience has its own section, with concrete languages, infrastructure,
and work history.

Personal copy, navigation, skills, and career details live in `src/data/site.ts`.
The “Why I keep making games” section is based on Jordan’s own account of his
start in high school. Keep that voice: direct, personal, and specific. Avoid
turning every game into a lesson about production systems or making claims about
outcomes and contributions without evidence.

### Project pages

Copy `src/content/projects/_example.md`, rename it, fill in its fields and body,
and set `draft: false`. The filename becomes the `/work/` URL.

- `order` controls the archive sequence; higher numbers appear first.
- `featured: true` adds a project to the homepage highlights. The first three
  featured projects in display order appear there.
- `year` is optional. Omit it when the development date is unknown.
- `status` is optional. Only use `Shipped` or `Playable` when verified.
- `cover` points at a real image. Astro generates responsive image sizes.
- `links` should point directly to a game, repository, or project page when one
  is available.

Source notes in the Markdown explain which original write-ups and project pages
support the content. Where original descriptions are unavailable, the text stays
brief rather than inventing mechanics or implementation details. The schema in
`src/content.config.ts` checks frontmatter during the build.

### Images

Original screenshots are archived in `src/content/projects/covers/_originals/`.
Run `npm run covers:process` to regenerate the WebP covers. Images keep their
original proportions; CSS handles the surrounding space without cropping the
subject. `npm run fetch:weebly` exists for recovery, but the archived originals
mean it should not normally be needed.

Run `npm run og` after updating the headline or role in
`scripts/generate-og.mjs`. Those strings mirror `src/data/site.ts`. The social
image generator uses locally installed Archivo, with a system-font fallback.

## Design

Warm paper, near-black type, and a vermillion accent. Archivo handles body and
display text; JetBrains Mono handles labels. Keep the existing typographic
hierarchy and simple rules when extending the site.

Real screenshots are visible in the homepage highlights. The project archive
has cursor previews on wide screens with a fine pointer, and inline thumbnails
on narrow or touch screens. Motion respects `prefers-reduced-motion`. Content
remains visible if the reveal script fails to load, and keyboard focus reveals
any animated ancestor.

## Deployment

Netlify uses `netlify.toml`: build command `npm run build`, publish directory
`dist`, Node 22. The production site is
[https://jordanthrash.netlify.app](https://jordanthrash.netlify.app).

`astro.config.mjs` uses Netlify’s `URL` for canonical tags, the sitemap, and
`robots.txt`; local builds fall back to `http://localhost:4321`. Use the site’s
production URL when preparing a manual deployment:

```bash
URL=https://jordanthrash.netlify.app npm run build
```

Legacy Weebly paths redirect to their corresponding project pages or homepage
sections. Preserve those routes when renaming a project. The `#about`, `#skills`,
and `#experience` anchors still work alongside the new `#why-games` section.

Open a PR for review before merging changes to the production branch. Netlify
can provide a Deploy Preview when repository integration is enabled.

## Other scripts

| Command | Purpose |
| --- | --- |
| `npm run covers` | Generate placeholders for projects missing cover art |
| `npm run covers:force` | Regenerate placeholders, overwriting current covers |
| `npm run preview:file` | Build a standalone homepage preview; project links are disabled |
| `npm run og` | Regenerate the social preview image |

The copy linter catches common wording patterns; it cannot decide whether a
sentence sounds like Jordan. Review its findings rather than changing accurate,
personal wording solely to satisfy a rhythm heuristic.
