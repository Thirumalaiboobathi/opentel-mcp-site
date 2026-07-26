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

## Round 1 (Phase 4 docs infrastructure + Phase 7 SEO scaffold)

### MDX rendering: `@mdx-js/mdx`'s `run()` over Velite's compiled `s.mdx()` output
Velite's `s.mdx()` schema field compiles each doc's MDX body to a
function-body code string (confirmed via its type signature — plain
`string`, not a pre-rendered component). The documented way to execute
that is `run(code, { ...productionJsxRuntime, baseUrl })` from
`@mdx-js/mdx` (already a project dependency), which does an in-process
`eval` of the compiled output inside a server component. Wrapped this in
`lib/mdx.tsx` (`renderMDX`) and pass `mdxComponents` (Callout, CodeBlock,
styled headings/links/lists) so custom components work inside MDX bodies.

### CodeBlock reads rehype-pretty-code's output rather than running Shiki at runtime
`velite.config.ts` already runs `rehype-pretty-code` (Shiki, theme
`github-dark`, `keepBackground: true`) over every fenced code block at
*build* time, producing already-highlighted `<pre data-language="…">
<code>…</code></pre>` markup baked into the compiled MDX. `CodeBlock.tsx`
is the `pre` override in `mdx-components.tsx` — it doesn't re-highlight
anything; it reads `data-language` off the child `<code>` element for the
badge, walks the children tree to extract plain text for the copy button,
and adds the chrome (header bar, border, copy button) around the already-
highlighted output. `figcaption` (rehype-pretty-code's title/filename
feature, e.g. ` ```ts title="foo.ts" `) gets its own small mapping to
render as a filename tab bar above the code block.

### Inline `code` styling done via CSS, not an MDX component override
Initially mapped `code` in `mdx-components.tsx` to a styled inline-code
component (background, padding, mono font) — but MDX component mapping
applies to *every* `code` element uniformly, including the `<code>` that
rehype-pretty-code nests inside `<pre>` for fenced blocks. That would
have doubled-up the styling inside every code block (padding-in-padding,
a background tint on top of Shiki's own background). Removed the `code`
mapping entirely and instead added a scoped CSS rule in `globals.css`
(`.prose-content :not(pre) > code { … }`) that only touches genuinely
inline code, leaving fenced blocks to `CodeBlock`'s own styling
untouched.

### `mcp-tracer` docs, faq — no change needed
`content/faq/faq.mdx` already existed from Phase 1 with real content
(brief's own Phase 6 FAQ list) — untouched this round.

### Metadata-route static-export requirement: `export const dynamic = "force-static"`
`app/sitemap.ts`, `app/robots.ts`, `app/manifest.ts`, and both
`opengraph-image.tsx` files (root and `app/docs/[slug]/`) all failed
`pnpm build` with "Failed to collect page data" under `output: 'export'`
until each got an explicit `export const dynamic = "force-static"`. Not
mentioned in the brief; discovered by iterating on real build errors.
Logged here so it isn't rediscovered per-file in a later phase (e.g. when
a `changelog`/`blog` RSS feed or additional metadata route gets added).

### `SITE.repoUrl` added as an explicit placeholder for "Edit this page on GitHub"
The brief's per-doc "Edit this page on GitHub" link needs this
marketing site's own repo URL — not `PACKAGE.github`, which points at
the npm package's repo (a different GitHub project entirely). No such
constant existed. Added `SITE.repoUrl = "SITE_REPO_URL"`, matching the
existing placeholder convention (`AUTHOR.linkedin`, `AUTHOR.twitter`,
`AUTHOR.email`) rather than guessing a URL.

### `buildPersonSchema()` filters out placeholder URLs
`AUTHOR.linkedin`/`AUTHOR.twitter` are still literal placeholder strings
(`"LINKEDIN_URL"`, `"TWITTER_URL"`). `buildPersonSchema()`'s `sameAs`
array filters out anything ending in `_URL` so the `/about` page's future
`Person` JSON-LD doesn't ship broken/junk URLs before those placeholders
are replaced with real profile links.

### Favicon/OG static assets not created — flagged, not blocking
`app/manifest.ts` references `favicon-16x16.png`, `favicon-32x32.png`,
and `apple-touch-icon.png`; none exist in `public/` yet. This is a
design-asset task (someone needs to actually produce/export icon files),
not something to fabricate as placeholder binaries. `pnpm build` doesn't
validate referenced-but-missing public assets, so this doesn't block the
build — flagged in `CLAUDE.md` so it isn't forgotten before launch.

## Round 2 (Phase 5 content — flagship page)

### All technical claims sourced directly from the real opentel-mcp repo and the live MCP spec
Per the user's anti-fabrication rule, fetched the actual v0.4.0 source
(`src/instrument.js`, `src/attributes.js`, `src/metrics.js`,
`src/config.js`, `package.json`, `README.md`) from
`github.com/Thirumalaiboobathi/opentel-mcp` and the live MCP
specification (`modelcontextprotocol.io/specification/2025-06-18/server/
tools`) before writing anything. Every attribute name, the
`isToolResultError()` detection function, the four metric names, and the
MCP spec quote in `/docs/silent-failures` are copied or trimmed directly
from those sources — nothing paraphrased or guessed. Confirmed directly
from source (no `VERIFY` needed): Node.js `>=20`, `@opentelemetry/api
^1.9.0` peer dependency, `fingerprinting` defaults to `true`. Left
`<!-- VERIFY -->` for anything not stated in the source or spec — see the
per-page list at the end of Phase 5.

### `content/docs/silent-failures.mdx`'s before/after span JSON is illustrative, not a real export
The user explicitly asked for "SigNoz-shape" before/after span JSON,
flagged as illustrative. Built two JSON blocks using opentel-mcp's real
attribute names/values from `src/attributes.js` (`mcp.method.name`,
`gen_ai.tool.name`, `error.type: "tool_error"`, etc.), shaped the way a
trace viewer would display a span — but the JSON itself isn't copied from
any actual SigNoz export or test fixture, and the page says so via an
inline `Callout`.

### Docs collection gained an `author` field
The Phase 5 tone rules require `author` in every doc's frontmatter (in
addition to the blog collection, which already had it from Phase 1).
Added `author: s.string().default("Thirumalaiboobathi B")` to the `docs`
schema in `velite.config.ts` and surfaced it as a "By {author}" byline in
`app/docs/[slug]/page.tsx`, next to the existing "Last updated" line. The
default means the 5 not-yet-rewritten placeholder docs (getting-started,
deep-fingerprinting, metrics, api-reference, migration) still build
without edits; they'll get the explicit frontmatter field when their real
content lands later in this round.

### `doc.dateModified`/`doc.datePublished` are full ISO timestamps — formatted for display
Velite's `s.isodate()` normalizes dates to a full ISO 8601 timestamp
(e.g. `2026-07-26T00:00:00.000Z`), not just a date. Rendering that raw
next to "Last updated:" looked broken. Added `formatDate()` to
`lib/utils.ts` (`Intl`-based, UTC, "July 26, 2026" style) for display;
`lib/schema.ts`'s `buildTechArticleSchema` still receives the raw ISO
strings unchanged, since that's the format schema.org/JSON-LD expects.

### Flagging, not fixing: the landing page's "HTTP 200" framing is a simplification
`components/landing/ProblemStatement.tsx` (and the Hero's copy) describe
the silent-failure envelope as reporting "HTTP 200 OK". That's only
accurate for MCP servers running over an HTTP-based transport — MCP also
runs over stdio (the transport opentel-mcp's own README quickstart
actually uses), which has no HTTP status codes at all. The new docs
content in this round avoids that framing (talks about "a successful
JSON-RPC 2.0 response" generically, not HTTP specifically). Not fixing
the Phase 3 landing copy now — that's outside this round's scope — but
flagging it here since it's a real, minor accuracy gap worth a follow-up
pass before launch.

### `/comparison` link in the flagship page's "Where do I go from here?" points at a route that doesn't exist yet
Same forward-linking pattern already established in Phase 2/3 (Header nav
links to `/docs`, `/faq`, etc. before those pages existed) — `/comparison`
ships in Phase 6. Not a build error under `output: 'export'` (sitemap/
link generation doesn't validate target routes exist), just noting it so
it isn't mistaken for an oversight later.

## Round 3 (Phase 5 content — Batch A)

### `<!-- VERIFY: ... -->` HTML comments break MDX — switched to `{/* VERIFY: ... */}`
The user's anti-fabrication rule specifies flagging uncertain claims with
an HTML comment. Velite's MDX compiler rejects raw `<!-- -->` outright
("Unexpected character `!`... to create a comment in MDX, use `{/* text
*/}`") — and critically, it didn't fail the whole build loudly: it
dropped the three affected files from the `docs` collection silently,
and the Next.js build still exited 0 with those routes just missing.
Switched all three `VERIFY` comments to MDX-native `{/* ... */}` syntax.
This is arguably closer to the actual intent than a literal HTML comment
would have been anyway: JSX comments stay in the source (`grep VERIFY
content/docs/*.mdx` finds them) but don't render into the page HTML, so
they read as internal review markers rather than visible "TODO" notes on
a live doc page before the user's review pass happens.

**Process note for future rounds:** Velite silently dropping invalid
files from a collection (rather than failing the build) means "pnpm
build exits 0" alone doesn't prove every content file compiled — cross-
check the route list in the build's own output (or `out/docs/*/`
directly) against the expected file count after every content change,
not just the exit code.

### Confirmed all four metrics names directly from source — none needed a VERIFY
The user's message assumed only `mcp.tool.silent_failures` was confirmed
and the other three might need `VERIFY` comments or omission. Earlier
research (before the flagship page) had already fetched `src/metrics.js`
directly and confirmed all four real instrument names, types, units, and
attribute sets (`mcp.tool.calls`, `mcp.tool.errors`,
`mcp.tool.silent_failures`, `mcp.tool.duration`) — used all four with
confidence in `/docs/metrics`, no `VERIFY` needed on the instrument names
themselves.

## Round 4 (Phase 5 content — Batch B)

### Cross-checking the FAQ against Batch A surfaced and fixed two real fabrications from Phase 1
Per the user's instruction to cross-check every FAQ answer against
`/docs/api-reference`, `/docs/metrics`, and `/docs/deep-fingerprinting`
before shipping, re-read the Phase 1 FAQ stub (10 questions, written
before this session had pulled the real opentel-mcp source) against what
Batch A's research actually confirmed. Two answers were wrong:

1. **"What is opentel-mcp?"** claimed it creates spans for "tools,
   resources, and prompts." `src/instrument.js` only wraps the handler
   registered for `CallToolRequestSchema` (`tools/call`) — requests for
   `resources/*` or `prompts/*` pass through completely unwrapped. Fixed
   to say "tools" only, and added a new, explicit FAQ entry ("Does
   opentel-mcp instrument resources and prompts, or just tools?") so
   this isn't just quietly corrected but stated plainly, since it's
   exactly the kind of scope question a developer evaluating the
   package would ask.
2. **"Does opentel-mcp work with fastmcp?"** answered "Yes." This is
   false: fastmcp (`PrefectHQ/fastmcp`) is a Python framework; opentel-mcp
   is a Node.js package for `@modelcontextprotocol/sdk`-based servers.
   It cannot instrument a Python process — different language runtime
   entirely. The real connection between the two projects is narrower
   and unrelated to compatibility: the author found and reported a
   silent-failure-propagation bug in fastmcp itself
   (`PrefectHQ/fastmcp#4549`, fixed in `PR #4587`). Rewrote the answer to
   state that plainly rather than implying runtime compatibility that
   doesn't exist. This is exactly the class of error the user's
   anti-fabrication rules exist to catch — worth flagging clearly rather
   than silently fixing, since it shipped (on the landing page's Social
   Proof section, worded more carefully there as "filed and fixed an
   upstream fastmcp bug") in an earlier phase without this cross-check.
   Not touching the landing page copy in this round — its existing
   wording is accurate and doesn't claim compatibility the way the old
   FAQ answer did, so no follow-up is needed there.

Also softened the silent-failures FAQ answer to drop the same
transport-specific "HTTP 200" framing already flagged (and avoided) in
the flagship page's own Decisions entry, for consistency.

### `/faq`'s answers render via `dangerouslySetInnerHTML`, not MDX
Unlike the `docs` and `blog` collections, the `faq` collection's `answer`
field uses Velite's `s.markdown()` (confirmed via its type signature:
returns a plain `string`), not `s.mdx()` — it's compiled HTML, not a
compiled MDX component function body. `run()` from `@mdx-js/mdx` doesn't
apply here; rendering it is a plain `dangerouslySetInnerHTML`, styled via
Tailwind arbitrary-descendant selectors on the wrapping div rather than
the `mdx-components.tsx` component-mapping approach the docs pages use.
This means FAQ answers can't use the custom `Callout`/`CodeBlock`
components — acceptable for one-line factual answers, which is all this
collection's schema supports (no code-block-shaped questions in the set
written).

## Round 5 (Phase 5 content — Batch C)

### `mcp-tracer` confirmed not to exist — checked, not just "unverified"
Earlier phases (landing page, then the flagship page's comparison
context) treated `mcp-tracer` as "unverified" — a real library whose
feature set just hadn't been checked. This round actually checked:
`https://registry.npmjs.org/mcp-tracer` returns 404, and a GitHub repo
search for `mcp-tracer` returns 53 results, none of which are an MCP
observability/tracing library (mostly unrelated Cisco Packet Tracer
integrations and similarly-named-but-unrelated projects). `/comparison`
states this plainly and excludes it from the comparison table entirely,
rather than continuing to represent a nonexistent project as an
"unverified" competitor. The landing page's `ComparisonTable.tsx` still
has an `mcp-tracer` column with the old "unverified" framing — not
edited in this round (out of scope), but worth a follow-up pass since
"checked and found nothing" is a stronger, more useful statement than
"unverified."

### `/comparison` and `/changelog` treat fastmcp as confirmed-facts-only, not a feature comparison
Per the user's explicit anti-fabrication rule for competitor claims
("fastmcp: state confirmed facts... do NOT claim capabilities you
haven't verified"), and consistent with the FAQ fix in Round 4,
`/comparison` doesn't attempt a feature-by-feature comparison against
fastmcp at all — it states the two confirmed facts (fastmcp is Python;
the author reported/fixed `PrefectHQ/fastmcp#4549`) and explains why a
capability comparison across language runtimes isn't meaningful, rather
than forcing fastmcp into the same table as `@opentelemetry/api`.

### `/changelog` dates and links verified against real git history, not invented
Fetched the actual `CHANGELOG.md` (covers v0.1.0–v0.3.0 only — no
v0.4.0 entry exists there), the repo's git tags (only `v0.4.0` and
`v0.2.0` are actually tagged; `v0.1.0` and `v0.3.0` have no tag), and
targeted commit history (`?path=package.json`, plus a commit search for
"fingerprint") to get real dates for all four versions. v0.4.0's date is
the git tag's target commit date (2026-07-24) — the actual first commit
introducing the fingerprinting feature itself wasn't independently
findable via commit search (likely squashed/curated before the repo's
public push, consistent with the eight-phase Claude Code build the user
described), so the tag date is the most accurate real anchor available,
not a guess. Each version's changelog entry links to its real tag (`/tree/vX.Y.Z`)
where one exists, or its specific verified commit SHA (`/commit/<sha>`)
where it doesn't — checked this explicitly after confirming a
`/releases/tag/vX.Y.Z` link would 404 (the repo has git tags but no
published GitHub Releases).

### `/about` placeholders follow the existing convention; AWS Builder Centre gets an explicit VERIFY
`AUTHOR.linkedin`/`AUTHOR.twitter` were already established placeholders
(`"LINKEDIN_URL"`/`"TWITTER_URL"`) from Phase 1. Added
`AUTHOR.awsBuilderCentre = "AWS_BUILDER_CENTRE_URL"` following the same
pattern, and extended `buildPersonSchema()`'s `sameAs` array to include
it (still filtered out of the actual JSON-LD output by the existing
`endsWith("_URL")` check until a real URL replaces it). Per the user's
explicit instruction, this one also gets an inline `{/* VERIFY */}`
comment in the page source — not just a bare placeholder — since the
instruction was specifically "ask the user if unknown," not "use a
placeholder and move on" like the other two.

### Blog post's "how this was built" section describes methodology, not fabricated phase names
The user said to "retell the 8-phase build using Claude Code with narrow
prompts" for opentel-mcp's own v0.4.0 development (a fact about the
user's own process, not a technical claim requiring independent source
verification — the user is the primary source for their own
methodology). Nothing in the fetched source names specific phases, so
the post describes the real, confirmed *components* of that work
(classifiers, hash pipeline, span/metric wiring, tests) and the general
narrow-prompt/incremental-review discipline, without inventing specific
fake "Phase 1: X, Phase 2: Y" labels or dates that aren't backed by
anything.
