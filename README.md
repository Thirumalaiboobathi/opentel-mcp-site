# opentel-mcp-site

Marketing and documentation site for [`opentel-mcp`](https://www.npmjs.com/package/opentel-mcp),
a Node.js OpenTelemetry instrumentation library for Model Context Protocol
(MCP) servers. Built as a fully static Next.js 15 site optimized for both
traditional search (SEO) and LLM answer engines (AEO).

See [`CLAUDE.md`](./CLAUDE.md) for current build status and how to resume
work in a fresh session, and [`DECISIONS.md`](./DECISIONS.md) for the
reasoning behind every non-obvious technical choice made in this repo.

## Local development

Requires Node.js 22.x and pnpm (managed via corepack — do not install pnpm
from any other source).

```bash
corepack enable
corepack prepare pnpm@10.30.1 --activate

pnpm install
pnpm dev        # http://localhost:3000
```

Other scripts:

```bash
pnpm build      # static export to out/
pnpm tsc --noEmit
pnpm lint
```

## Content editing

All docs, blog posts, and FAQ content live under `content/` as MDX,
indexed by [Velite](https://velite.js.org) (`velite.config.ts`) into typed
collections consumed by the corresponding `app/` routes.

- `content/docs/*.mdx` — one file per docs page. Frontmatter: `title`,
  `description`, `section` (`Introduction` | `Concepts` | `Reference` |
  `Guides`), `order`, `datePublished`, `dateModified`.
- `content/blog/*.mdx` — one file per post. Frontmatter: `title`,
  `description`, `datePublished`, `dateModified`, `author`, `tags`.
- `content/faq/faq.mdx` — single file, frontmatter-only `items: [{ question,
  answer }]` array (no MDX body).

Velite regenerates its typed index automatically as part of `next dev` /
`next build` (see the `VeliteWebpackPlugin` in `next.config.mjs`) — there is
no separate build step to remember.

Package facts, author bio, and target keywords are centralized in
`lib/constants.ts` (`SITE`, `PACKAGE`, `AUTHOR`, `KEYWORDS`) — update there,
not inline in content, so copy stays consistent across the site.

## Deploying to Cloudflare Pages

This site builds to a fully static `out/` directory (`output: 'export'` in
`next.config.mjs`) — no server runtime required.

### Prerequisites

- A Cloudflare account.
- This repo pushed to GitHub, with a Cloudflare Pages project connected
  to it (Cloudflare dashboard → **Workers & Pages** → **Create** →
  **Pages** → **Connect to Git**).

### Build settings

| Setting | Value |
|---|---|
| Framework preset | **Next.js (Static HTML Export)** |
| Build command | `pnpm build` |
| Build output directory | `out` |
| Node version | `22` (set `NODE_VERSION=22` in the project's environment variables if Cloudflare doesn't auto-detect it from no `.nvmrc`/`engines` field) |
| Environment variables | None required for the build itself. |

Because everything is statically exported, there's no server-side
rendering to configure — Cloudflare just serves the prebuilt HTML/CSS/JS.
Every push to the connected branch (`main` by default) triggers a new
build and deploy automatically; Cloudflare also builds a preview
deployment for every other branch and pull request.

### Custom domain

1. In the Pages project, go to **Custom domains** → **Set up a custom
   domain**.
2. Enter the domain (e.g. `opentel-mcp.dev`) and follow Cloudflare's
   prompts. If the domain's DNS is already on Cloudflare, this is a
   one-click "Activate domain" — Cloudflare adds the CNAME/DNS record
   for you. If it's registered elsewhere, either transfer DNS to
   Cloudflare first or add the CNAME record Cloudflare shows you at your
   current registrar.
3. Cloudflare provisions a free TLS certificate automatically; this can
   take a few minutes.
4. Once live, update `SITE.url`/`SITE.domain` in `lib/constants.ts` if
   the deployed domain differs from `https://opentel-mcp.dev` — every
   canonical URL, JSON-LD `url` field, and the sitemap are derived from
   that constant, so nothing else needs to change.

### Regenerating `llms-full.txt` after a content change

`public/llms-full.txt` is not the file actually served — `pnpm build`
runs `scripts/generate-llms-full.mjs` as its final step, which reads the
freshly built `out/**/index.html` (and the raw MDX source for docs/blog)
and overwrites `out/llms-full.txt` directly. This happens automatically
on every build, including Cloudflare's, so there's nothing to remember
to regenerate manually — editing any page under `content/docs/`,
`content/blog/`, `content/faq/faq.mdx`, or the `comparison`/`changelog`/
`about` pages and running `pnpm build` (or pushing to trigger a
Cloudflare build) keeps it in sync automatically. `public/llms-full.txt`
itself only matters as a fallback if someone serves `public/` without
running a build at all.

## Tech stack

Next.js 15 (App Router, static export) · TypeScript strict · Tailwind CSS
v4 · shadcn/ui · MDX + Velite · next-themes · framer-motion (used
sparingly) · Plausible Analytics (script-tag only, no runtime deps).
