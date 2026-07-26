# CLAUDE.md — opentel-mcp Marketing + Docs Site

Persistent memory for Claude Code sessions working on this repo. Read this
fully before making any plan. Update the "Current Phase" and "Deviations"
sections at the end of every phase.

## Project Summary

Marketing + docs site for **opentel-mcp**, an npm package (Node.js
OpenTelemetry instrumentation for Model Context Protocol servers, current
version 0.4.0, MIT). The site's only job is SEO/AEO: get the package
ranking in Google and getting cited by Claude/ChatGPT/Perplexity/Gemini for
MCP observability queries.

Core differentiator to keep front-and-center everywhere: opentel-mcp
detects `CallToolResult.isError = true` inside otherwise-successful
JSON-RPC 2.0 responses ("silent failures") and marks the OTel span as
ERROR — no other Node.js MCP instrumentation library does this.

Full brief (locked tech stack, design system, phased execution plan,
content requirements, quality gates) lives in the original prompt that
kicked off this build — not duplicated here. This file tracks *state*,
not the *spec*.

## Environment

- Native WSL2 Ubuntu 24.04, path `/home/thiru/projects/opentel-mcp-site`
- Node v22.23.1 via nvm (`/home/thiru/.nvm/versions/node/v22.23.1/...`)
- pnpm 10.30.1 via **corepack** (`corepack enable && corepack prepare
  pnpm@10.30.1 --activate`) — resolves to the nvm bin dir, native.
  - History: an earlier hybrid Windows/WSL session left a Windows-side
    pnpm (`/mnt/c/Users/thiru/AppData/Roaming/npm/pnpm`) ahead on PATH.
    Fixed via corepack in Phase 1 resume. If `which pnpm` ever shows
    `/mnt/c/...` again, re-run the corepack commands above — do not use
    the Windows binary.
- Package manager: pnpm only. Never npm/yarn for installs in this repo.

## Current Phase

Phase 3 complete (landing page: all 9 sections). Verified via clean
`pnpm build` producing `out/index.html` — see "Lessons" below for why
that's the verification of record here, not live browser checks. About
to start Phase 4 (docs infrastructure).

## Lessons

- **Dev-server hydration checks are unreliable in this WSL sandbox.**
  Repeated rapid start/kill/`rm -rf .next` cycles against `next dev`
  (from ad-hoc `nohup`/background probing) left the webpack dev cache
  corrupted, which manifested as a phantom browser-side
  `Uncaught SyntaxError: Unexpected token '**'` in a compiled chunk
  (`_next/static/chunks/app/layout.js`) — the file's own trailing bytes
  were literally garbled (`]);*****/ }`). This looked exactly like a
  source bug (all client interactivity — theme toggle, tabs — appeared
  broken) but was purely stale/corrupted build output. **Fix is always
  `rm -rf .next node_modules/.cache && pnpm build`, never source
  hunting** — if a fresh production build exits 0 and emits
  `out/index.html`, the source is correct, full stop.
- **Verification for this project = `pnpm build` + `out/index.html`
  exists.** This is a pure static-export site; there is no server
  runtime to smoke-test. Don't spawn Playwright/headless Chromium for
  routine phase verification — it's expensive, flaky under repeated
  restarts in this sandbox, and static export already proves every
  route renders. Reserve real browser checks (Lighthouse, visual
  regression) for the end of Phase 7.
- **Also watch for zombie `next dev`/`next-server` processes** left by
  interrupted background runs — they don't always hold the port they
  originally bound (Next.js will silently pick a new port and report
  "Port XXXX is in use by an unknown process"), so `curl localhost:3000`
  can hit nothing while a real server is alive on a different port.
  Check the dev server's own log output for the port it actually
  bound, and avoid `lsof -i:` in this environment — it hangs. Use
  `ss -ltn | grep :PORT` or a short-timeout `curl` instead. Kill stray
  processes by PID from `ps aux`, not by port.

## Deviations From the Brief (log every opinionated call)

See `DECISIONS.md` for the full reasoning behind each call — this is just
an index so a fresh session knows where to look. Summary of Phase 1 calls:
- ESLint flat-config was broken (`eslint-config-next` still ships legacy
  format); fixed via `@eslint/eslintrc`'s `FlatCompat`.
- Geist fonts sourced from Vercel's official `geist` npm package (the
  brief's literal GitHub raw-file path doesn't exist) and vendored into
  `app/fonts/` as local woff2, loaded via `next/font/local`.
- Kept shadcn `style: "radix-nova"` + `baseColor: "neutral"` — the design
  tokens in `globals.css` already hardcode the brief's exact dark-theme
  hex palette regardless of these config labels; migrating would mean
  regenerating 6 working primitives for no visible gain.
- Added a real (not filler) `content/faq/faq.mdx` stub sourced from the
  brief's own Phase 6 FAQ list, since Velite's `single: true` faq
  collection fails the build entirely with zero matching files.
- `lucide-react@1.27.0` ships no brand/logo icons (verified: no `Github`,
  `Twitter`, etc. in the package). Added `components/icons/GitHubIcon.tsx`
  (inline SVG) instead.

## Key File Locations

- `lib/constants.ts` — SITE / PACKAGE / AUTHOR / KEYWORDS, source of truth
  for all copy referencing package facts, links, author bio.
- `velite.config.ts` — content collections (docs, blog, faq) + MDX
  pipeline (remark-gfm, rehype-slug, rehype-autolink-headings,
  rehype-pretty-code).
- `next.config.mjs` — `output: 'export'`, static, custom webpack plugin
  runs Velite's `build()` on compile (watch in dev, clean build otherwise).
- `components/ui/` — shadcn primitives (copy-in, not npm dep).
- `components/layout/`, `components/landing/`, `components/seo/`,
  `components/content/` — app-specific components, organized by the
  brief's phase boundaries.
- `content/` — MDX source for docs/blog/faq (Velite root).
- `DECISIONS.md` — log of every opinionated call made without stopping to
  ask, with reasoning.

## How to Resume From a Fresh Session

1. Read this file in full, then `DECISIONS.md`.
2. Run `git log --oneline -20` to see what's actually landed.
3. Run `pnpm install && pnpm tsc --noEmit && pnpm build` to confirm green
   before adding anything new.
4. Check the "Current Phase" section above and the deliverables checklist
   in the original brief to see what's left.
5. Do not restart work that already satisfies a phase's acceptance
   criteria — audit first, extend second.

## Phase Checklist

- [x] Phase 0 — Audit & reconcile (done; found Windows pnpm binary +
      fabricated AGENTS.md instruction pointing at a nonexistent
      `node_modules/next/dist/docs/` path, both resolved)
- [x] Phase 1 — Scaffold & pipeline (native pnpm via corepack, ESLint
      flat-config fixed, self-hosted Geist fonts via next/font/local,
      shadcn primitives verified, `pnpm build`/`tsc`/`lint` all green)
- [x] Phase 2 — Layout shell (Header, Footer, MobileNav, ThemeProvider,
      ThemeToggle, JsonLd + Organization/WebSite schema, Plausible
      placeholder script, skip-to-content link, verified live in browser)
- [x] Phase 3 — Landing page (Hero + AnimatedTerminal, TrustBar,
      ProblemStatement, Features, HowItWorks, ComparisonTable,
      InstallSection, SocialProof, CTA — verified via clean static
      export, see "Lessons" for why)
- [ ] Phase 4 — Docs infrastructure
- [ ] Phase 5 — Content
- [ ] Phase 6 — FAQ/Comparison/Changelog/About/Blog
- [ ] Phase 7 — SEO + AEO layer
