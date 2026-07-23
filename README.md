# Northstar Advisory

A modern business website built with Astro and TypeScript.

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Deployment to Cloudflare Pages

1. Push the project to GitHub.
2. Create a new Cloudflare Pages project and connect the repository.
3. Set the build command to `npm run build`.
4. Set the output directory to `dist`.
5. Deploy.

For production, update the site URL in [astro.config.mjs](astro.config.mjs) to your actual domain.
