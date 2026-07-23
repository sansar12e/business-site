import type { APIRoute } from 'astro';

const pages = ['/', '/about', '/services', '/blog', '/contact', '/blog/strategy-2026', '/blog/operations-reset'];

export const GET: APIRoute = () => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${pages
    .map((page) => {
      const url = new URL(page, 'https://example.com').toString();
      return `<url><loc>${url}</loc></url>`;
    })
    .join('')}
</urlset>`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
