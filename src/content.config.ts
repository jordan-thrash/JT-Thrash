import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
// Imported from `zod` directly — the `z` re-export from `astro:content` is deprecated.
import { z } from 'zod';

/**
 * Adding a project is one markdown file in `src/content/projects/`. The schema
 * below is enforced at build time, so a typo in a field name or a missing
 * `summary` fails the build rather than silently rendering an empty card.
 */
const projects = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/projects' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      /** Shown on the card and in link previews. One or two sentences. */
      summary: z.string(),
      /** Sorts the grid; higher surfaces first. */
      order: z.number().default(0),
      year: z.string(),
      /** Broad category. Only used to pick the generated cover's hue. */
      kind: z.enum(['Game', 'Web', 'Tool', 'Backend']),
      /**
       * Short human description of what the project *is*, shown in the index
       * beside the title — "Tower defense", "Developer tooling". Two or three
       * words; it is a column, not a sentence.
       */
      discipline: z.string(),
      tech: z.array(z.string()).min(1),
      /** Pinned to the large hero slots at the top of the work grid. */
      featured: z.boolean().default(false),
      /** Optional outbound links, rendered as buttons on the detail page. */
      links: z
        .array(
          z.object({
            label: z.string(),
            href: z.url(),
          })
        )
        .default([]),
      /**
       * Cover image, relative to this file. Runs through Astro's asset pipeline,
       * so it is resized, converted to modern formats and content-hashed.
       * `scripts/generate-covers.mjs` fills in any that are missing.
       */
      cover: image().optional(),
      /** Hidden from production builds while a write-up is unfinished. */
      draft: z.boolean().default(false),
    }),
});

export const collections = { projects };
