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

1. Connect the GitHub repo in the Cloudflare Pages dashboard.
2. Build command: `pnpm build`
3. Build output directory: `out`
4. Node version: `22` (set via `NODE_VERSION` env var if Cloudflare doesn't
   auto-detect it)
5. No environment variables are required for the build itself.

Because everything is statically exported, there's no server-side
rendering to configure — Cloudflare just serves the prebuilt HTML/CSS/JS.

## Tech stack

Next.js 15 (App Router, static export) · TypeScript strict · Tailwind CSS
v4 · shadcn/ui · MDX + Velite · next-themes · framer-motion (used
sparingly) · Plausible Analytics (script-tag only, no runtime deps).
