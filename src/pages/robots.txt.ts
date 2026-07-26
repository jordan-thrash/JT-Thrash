import type { APIRoute } from 'astro';

/**
 * Generated rather than kept in `public/`, so the sitemap URL follows whatever
 * `site` resolves to at build time. On Netlify that is the real production
 * address, so this keeps working after a custom domain is attached.
 */
export const GET: APIRoute = ({ site }) => {
  const sitemap = new URL('sitemap-index.xml', site).href;

  return new Response(
    ['User-agent: *', 'Allow: /', '', `Sitemap: ${sitemap}`, ''].join('\n'),
    { headers: { 'Content-Type': 'text/plain; charset=utf-8' } }
  );
};
