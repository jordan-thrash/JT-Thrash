// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// Canonical origin, used for canonical URLs, Open Graph tags, sitemap.xml and
// JSON-LD. Netlify sets `URL` to the site's primary address on production
// builds — including after a custom domain is attached — so this stays correct
// without anyone remembering to edit it. The fallback only applies to local
// builds, where the value never leaves the machine.
const site = process.env.URL ?? 'http://localhost:4321';

export default defineConfig({
  site,
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'viewport',
  },
  build: {
    inlineStylesheets: 'auto',
  },
});
