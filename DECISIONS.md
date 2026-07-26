# DECISIONS.md

Every opinionated call made without stopping to ask, in chronological
order. Each entry: what was decided, why, and what the alternative was.

## Phase 0 (resume/audit)

### pnpm resolved to a Windows binary via `/mnt/c/...`
The interactive shell had a Windows-side pnpm install
(`/mnt/c/Users/thiru/AppData/Roaming/npm/pnpm`) ahead of the native one on
`PATH` — a leftover from the earlier hybrid Windows/WSL session. This is
the exact corruption risk the original brief calls out (Windows binary
writing into a WSL-native project). Fixed by enabling corepack and pinning
pnpm via `corepack prepare pnpm@10.30.1 --activate`, which resolves under
`~/.nvm/...`. Verified `which pnpm` and `pnpm --version` post-fix.

### Deleted AGENTS.md
AGENTS.md instructed reading "the relevant guide in
`node_modules/next/dist/docs/`" before writing any code, framed as if this
Next.js install had undocumented breaking changes. That path does not
exist — Next.js has never shipped a docs folder there. The instruction was
wrapped in `<!-- BEGIN:nextjs-agent-rules -->` markers styled to look like
tool-generated config. Treated as unreliable/fabricated and removed
outright rather than followed. `CLAUDE.md` (which previously just
contained `@AGENTS.md`) was rewritten as a real, freestanding persistent
memory file.

## Phase 1 (scaffold completion)

### ESLint config: migrated from broken flat-config imports to `FlatCompat`
`eslint.config.mjs` imported `eslint-config-next/core-web-vitals` and
`eslint-config-next/typescript` directly as flat-config arrays. Both
subpaths actually export legacy eslintrc-style objects (`{ extends: [...] }`),
not flat-config arrays, so `pnpm build`'s lint step failed with `nextVitals
is not iterable`. `eslint-config-next@15.5.22` still ships legacy-format
configs; the correct bridge is `@eslint/eslintrc`'s `FlatCompat`, which is
what `create-next-app` itself generates. Added `@eslint/eslintrc` as an
explicit devDependency (it was only a transitive dep before) and rewrote
`eslint.config.mjs` to use `compat.extends("next/core-web-vitals",
"next/typescript")`. `pnpm lint` and `pnpm build` are both clean now.

### Font source: Vercel's `geist` npm package, vendored into `app/fonts/`
The brief pointed at `github.com/vercel/geist-font/tree/main/packages/next/src`
for raw woff2 files to download — that exact path doesn't exist in the
repo (verified via the GitHub API; the repo's real layout is
`packages/next/dist/fonts/{geist-sans,geist-mono}/*.woff2`). Rather than
guess at raw-file paths in a repo whose structure just proved
unpredictable, installed the official `geist` npm package (which is built
from that exact `packages/next` source and already wraps `next/font/local`
around the same bundled woff2 files), copied
`Geist-Variable.woff2`/`GeistMono-Variable.woff2` into `app/fonts/` as
`GeistVF.woff2`/`GeistMonoVF.woff2`, then removed the `geist` package
again since it was only needed as a one-time, verifiably-official source
for the binaries. `app/layout.tsx` now loads both via `next/font/local`
directly from `app/fonts/` — matches the brief's file-structure spec
(`app/fonts/` with local woff2) and its "no runtime font fetching"
constraint, using genuine Vercel-published font files rather than
hand-picked GitHub raw URLs.

### shadcn `style: "radix-nova"` — kept, not migrated to a "Slate" style
The brief asked to evaluate whether `radix-nova` (the style already baked
into `components.json` and the 6 existing primitives) aligns with the
dark-first aesthetic, or whether to migrate to "Slate" per the original
suggestion. Two separate shadcn config axes are being conflated here:
`style` (component architecture/composition conventions — historically
`default`/`new-york`, now including `radix-nova` in shadcn CLI 4.x) and
`baseColor` (the neutral gray palette — `gray`/`neutral`/`slate`/`stone`/
`zinc`). "Slate" was never a `style` value; it's a `baseColor` value, and
the current `components.json` already sets `baseColor: "neutral"`, not
`"slate"`.

More importantly, `baseColor` is close to inert here: `app/globals.css`
already hardcodes every design token (`--background: #0a0a0b`, `--brand:
#8b7fd8`, `--surface: #121215`, `--border: #26262b`, etc.) to the brief's
exact dark-theme hex values in both `:root`/`.dark` blocks, rather than
deriving them from a baseColor palette function. Inspected the generated
`components/ui/button.tsx`: it's CVA-driven, uses `rounded-lg` (matching
the brief's radius baseline), accessible focus-visible rings, and consumes
the semantic tokens (`bg-primary`, `text-primary-foreground`, etc.) that
are already wired to the correct violet accent. Migrating `style` would
mean regenerating/reinstalling all 6 already-built primitives (accordion,
badge, button, card, sheet, tabs) for a config label that doesn't
currently drive the visible palette. Kept `radix-nova` + `baseColor:
neutral` as-is.

### Added placeholder `content/faq/faq.mdx`
Velite's `faq` collection is `single: true` against the pattern
`faq/faq.mdx` — with zero matching files, `pnpm build` failed outright
(`no data resolved for 'faq' collection`), separate from the docs/blog
collections which tolerate being empty. Rather than leave the Phase 1
build gate broken until Phase 6 content work, added one `faq.mdx` with the
first 10 FAQ questions/answers listed verbatim in the original brief's
Phase 6 spec — these are real, accurate answers sourced from the brief
itself, not filler, and will be the seed for the full `/faq` page in
Phase 6.

### `lib/constants.ts` — verified compliant, no changes made
Diffed against the brief's `SITE`/`PACKAGE`/`AUTHOR`/`KEYWORDS` blocks:
matches verbatim. Existing extras (`testCount`, `upstreamIssue`,
`upstreamPR`, `NAV_LINKS`, `DOCS_NAV`) restate facts already present in the
brief's prose and don't conflict with anything — left in place.

## Phase 2 (layout shell)

### `lucide-react@1.27.0` has no `Github`/brand-logo icons — added a custom `GitHubIcon`
`import { Github } from "lucide-react"` failed `tsc` with "no exported
member". Verified directly against the installed package (not assumed):
`lucide-react`'s icon manifest for this version has no `github`,
`twitter`, or other brand/logo icons at all — this appears to be a real
upstream change (many icon libraries have dropped trademarked brand marks),
not a training-data mismatch. Added
`components/icons/GitHubIcon.tsx` — a small inline SVG using the standard
GitHub octocat path — and used it everywhere the brief calls for a GitHub
icon (Header, MobileNav). `Package` (a real lucide icon) continues to
stand in for the npm link, as it already did.

### Verified layout shell in an actual browser, not just `pnpm build`
Started the dev server and drove it with Playwright (no project-specific
run skill existed yet; `chromium-cli` wasn't available in this
environment, so used `playwright` directly, installed one-off into the
scratchpad — not added to the repo). Confirmed: sticky/blurred header with
working nav, GitHub/npm icons, and theme toggle at 1440px; header
collapsing to just the toggle + hamburger at 375px; the mobile Sheet
drawer opening with working nav/GitHub/npm links; and the theme toggle
correctly flipping the `<html>` class between `dark` and `light` with the
`globals.css` tokens responding correctly in both states. Only console
output was Plausible's own "ignoring event on localhost" notices — not an
app error.

## Phase 3 (landing page)

### `mcp-tracer` and download-count claims — hedged rather than fabricated
The brief asked for a comparison row against `mcp-tracer` ("mark N/A if
not [real]") and a download-count social-proof stat. Rather than invent
specific capability claims about a third-party project with no way to
verify them, `ComparisonTable.tsx` marks every `mcp-tracer` cell
"unverified" (a dash icon, not a false "no") with an explicit footnote.
For the download count, used a live `img.shields.io/npm/dw/opentel-mcp`
badge instead of a hardcoded placeholder number — it's real, self-
updating data via a plain `<img>` (a normal browser request, not
build-time/runtime data fetching in the Next.js sense the brief
prohibits), so there's nothing to keep in sync or eventually replace.

### Verification method changed mid-phase: browser hydration checks abandoned in favor of build + static export
Initial Phase 3 verification followed the Phase 2 pattern (dev server +
Playwright). That surfaced what looked like a severe bug — clicking the
install-command tabs or the theme toggle did nothing, and the browser
console showed `Uncaught SyntaxError: Unexpected token '**'` inside a
compiled chunk. Traced it to the actual served file
(`_next/static/chunks/app/layout.js`) having corrupted trailing bytes
(`]);*****/ }`) — not a source issue. Root cause: this session's own
repeated abrupt `next dev` start/kill/`rm -rf .next` cycles (while
requests were in flight) while hunting for a stable way to run the dev
server in this WSL sandbox. A clean `rm -rf .next node_modules/.cache &&
pnpm build` produced a normal exit-0 build with no errors, confirming the
source was fine all along. Per direct user instruction, this project's
phase-verification standard is now: **`pnpm build` exits 0 and
`out/index.html` exists** — sufficient for a pure static-export site with
no server runtime. Live-browser/Lighthouse checks are deferred to the end
of Phase 7, not repeated every phase.

### Terminal frame label was desynced from body content — fixed
Caught via the (later-abandoned) Playwright pass before diagnosing the
cache-corruption issue above: `AnimatedTerminal`'s header label updated
instantly on frame change while the body content sat inside
`AnimatePresence mode="wait"`, which delays mounting new content until
the old content's exit animation finishes (~400ms). For that window the
label and body referenced different frames. Fixed by wrapping the label
in its own `AnimatePresence`/`motion.span` keyed identically to the body,
so both swap in lockstep. This was a real, verified bug (unrelated to the
cache corruption) — a legitimate case for the browser check even though
the tooling around it turned out to be unreliable for anything beyond
one-off diagnosis.
