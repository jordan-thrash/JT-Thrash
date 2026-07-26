// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// Update `site` once the Netlify domain (or a custom domain) is final.
// It is used for canonical URLs, Open Graph tags, sitemap.xml and JSON-LD.
export default defineConfig({
  site: 'https://jordanthrash.netlify.app',
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
