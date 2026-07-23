import type { APIRoute } from 'astro';

export const GET: APIRoute = () => {
  return new Response(`User-agent: *\nAllow: /\nSitemap: ${new URL('/sitemap-index.xml', 'https://example.com').toString()}\n`, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
