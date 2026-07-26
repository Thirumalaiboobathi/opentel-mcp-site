import Link from "next/link";
import { Check, Minus, X } from "lucide-react";
import type { Metadata } from "next";

import { Callout } from "@/components/content/Callout";
import { JsonLd } from "@/components/seo/JsonLd";
import { AUTHOR, PACKAGE, SITE } from "@/lib/constants";
import { buildMetadata } from "@/lib/metadata";
import { buildBreadcrumbListSchema, buildTechArticleSchema } from "@/lib/schema";
import { formatDate } from "@/lib/utils";

const PATH = "/comparison";
const DATE_PUBLISHED = "2026-07-26";
const DATE_MODIFIED = "2026-07-26";

export const metadata: Metadata = buildMetadata({
  title: `Comparison — ${SITE.name}`,
  description:
    "How opentel-mcp compares to raw @opentelemetry/api instrumentation for MCP servers, honestly marked where a claim can't be verified.",
  path: PATH,
});

type Cell = "yes" | "no" | "unverified" | "na";

const ROWS: { label: string; cells: [Cell, Cell] }[] = [
  { label: "Instruments tools/call automatically", cells: ["yes", "no"] },
  { label: "Detects isError: true inside a successful response", cells: ["yes", "no"] },
  { label: "Deep failure fingerprinting", cells: ["yes", "no"] },
  { label: "Built-in mcp.tool.* metrics instruments", cells: ["yes", "no"] },
  { label: "Cardinality-safe metric attributes, structurally enforced", cells: ["yes", "na"] },
  { label: "Never throws into the instrumented handler", cells: ["yes", "unverified"] },
  { label: "Instruments resources/prompts (not just tools)", cells: ["no", "no"] },
  { label: "Requires manual span code per handler", cells: ["no", "yes"] },
  { label: "MIT licensed", cells: ["yes", "yes"] },
];

function CellIcon({ value }: { value: Cell }) {
  if (value === "yes") {
    return <Check className="mx-auto size-4 text-brand-teal" aria-label="Yes" />;
  }
  if (value === "no") {
    return <X className="mx-auto size-4 text-danger" aria-label="No" />;
  }
  if (value === "na") {
    return <Minus className="mx-auto size-4 text-text-tertiary" aria-label="Not applicable" />;
  }
  return <Minus className="mx-auto size-4 text-text-tertiary" aria-label="Unverified" />;
}

export default function ComparisonPage() {
  return (
    <>
      <JsonLd
        data={[
          buildTechArticleSchema({
            title: `${PACKAGE.name} comparison`,
            description:
              "How opentel-mcp compares to raw @opentelemetry/api instrumentation for MCP servers.",
            path: PATH,
            datePublished: DATE_PUBLISHED,
            dateModified: DATE_MODIFIED,
          }),
          buildBreadcrumbListSchema([
            { name: "Home", path: "/" },
            { name: "Comparison", path: PATH },
          ]),
        ]}
      />
      <div className="mx-auto w-full max-w-[1200px] flex-1 px-4 py-16 sm:px-6 xl:px-8">
        <div className="prose-content">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">
            How {PACKAGE.name} compares
          </h1>
          <p className="mt-4 text-muted-foreground">
            {PACKAGE.name} is a purpose-built OpenTelemetry instrumentation
            layer for Model Context Protocol (MCP) servers on Node.js. The
            closest points of comparison are raw{" "}
            <code className="rounded-md bg-muted px-1.5 py-0.5 font-mono text-[0.9em] text-foreground">
              @opentelemetry/api
            </code>{" "}
            instrumentation written by hand, and — for a narrower, specific
            reason explained below — fastmcp, a Python MCP framework.
          </p>

          <Callout variant="tip" title="TL;DR">
            Raw <code>@opentelemetry/api</code> gives you spans if you write
            the wrapping code yourself, but has no idea what a{" "}
            <code>CallToolResult</code> is — it can&apos;t see{" "}
            <code>isError: true</code> without you writing a check for it.
            fastmcp is a separate, Python-based project; it isn&apos;t a
            same-ecosystem alternative to a Node.js package, and the only
            confirmed connection is a bug report, not a feature comparison.
            No dedicated MCP-focused tracing library under the name
            &quot;mcp-tracer&quot; was found on npm or GitHub — it isn&apos;t
            included in the table below.
          </Callout>

          <h2 className="mt-10 text-xl font-semibold tracking-tight text-foreground">
            How does {PACKAGE.name} compare to raw @opentelemetry/api?
          </h2>
          <p className="mt-4 text-muted-foreground">
            Raw <code className="rounded-md bg-muted px-1.5 py-0.5 font-mono text-[0.9em] text-foreground">@opentelemetry/api</code>{" "}
            is a general-purpose tracing and metrics API — it has no concept
            of MCP, JSON-RPC 2.0, or <code className="rounded-md bg-muted px-1.5 py-0.5 font-mono text-[0.9em] text-foreground">CallToolResult</code>.
            That&apos;s true by definition, not a knock against it: it&apos;s
            not an MCP library. To get a span per tool call with it, you
            write the <code className="rounded-md bg-muted px-1.5 py-0.5 font-mono text-[0.9em] text-foreground">tracer.startActiveSpan()</code>{" "}
            wrapping yourself, around every handler — see the{" "}
            <Link href="/docs/migration" className="text-brand hover:underline">
              Migration Guide
            </Link>{" "}
            for exactly what that code looks like. That hand-written wrapper
            will catch a thrown exception if you write a try/catch around
            it, same as {PACKAGE.name} does. It will not catch{" "}
            <code className="rounded-md bg-muted px-1.5 py-0.5 font-mono text-[0.9em] text-foreground">isError: true</code>{" "}
            unless you specifically write a check for it — see{" "}
            <Link href="/docs/silent-failures" className="text-brand hover:underline">
              Silent Failures
            </Link>{" "}
            for why that check is easy to miss.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight text-foreground">
            How does {PACKAGE.name} compare to fastmcp?
          </h2>
          <p className="mt-4 text-muted-foreground">
            fastmcp (<code className="rounded-md bg-muted px-1.5 py-0.5 font-mono text-[0.9em] text-foreground">PrefectHQ/fastmcp</code>)
            is a Python framework for building MCP servers. {PACKAGE.name} is
            a Node.js package that instruments servers built on{" "}
            <code className="rounded-md bg-muted px-1.5 py-0.5 font-mono text-[0.9em] text-foreground">@modelcontextprotocol/sdk</code>,
            the JavaScript/TypeScript MCP SDK. It cannot instrument a Python
            process — different language runtime entirely, so a
            feature-by-feature comparison table between the two isn&apos;t
            really meaningful, and this page won&apos;t fabricate one.
          </p>
          <p className="mt-4 text-muted-foreground">
            The confirmed connection between the two projects: while
            working on MCP observability, {PACKAGE.name}&apos;s author found
            and reported a silent-failure-propagation bug in fastmcp itself
            (<code className="rounded-md bg-muted px-1.5 py-0.5 font-mono text-[0.9em] text-foreground">PrefectHQ/fastmcp#4549</code>,
            fixed in{" "}
            <code className="rounded-md bg-muted px-1.5 py-0.5 font-mono text-[0.9em] text-foreground">PR #4587</code>).
            That&apos;s an upstream bug report and fix, not a compatibility
            claim — fastmcp&apos;s own OpenTelemetry integration, if any,
            hasn&apos;t been independently verified here, and isn&apos;t in
            the table below for that reason.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight text-foreground">
            What about mcp-tracer or other MCP-specific tracing libraries?
          </h2>
          <p className="mt-4 text-muted-foreground">
            Checked both the npm registry and GitHub for a library named
            &quot;mcp-tracer&quot; — nothing matching an MCP-focused
            OpenTelemetry or tracing library came up under that name on
            either. If a real one exists under a different name, this page
            doesn&apos;t know about it; it isn&apos;t included in the table
            below rather than being represented by a guess.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight text-foreground">
            Full comparison table
          </h2>
          <div className="mt-6 overflow-x-auto rounded-xl border border-border not-prose">
            <table className="w-full min-w-[560px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-border bg-surface">
                  <th scope="col" className="px-4 py-3 text-left font-medium text-foreground">
                    Capability
                  </th>
                  <th scope="col" className="px-4 py-3 text-center font-mono font-medium text-foreground">
                    {PACKAGE.name}
                  </th>
                  <th scope="col" className="px-4 py-3 text-center font-mono font-medium text-foreground">
                    @opentelemetry/api (raw)
                  </th>
                </tr>
              </thead>
              <tbody>
                {ROWS.map((row) => (
                  <tr key={row.label} className="border-b border-border last:border-0">
                    <th scope="row" className="px-4 py-3 text-left font-normal text-muted-foreground">
                      {row.label}
                    </th>
                    {row.cells.map((cell, i) => (
                      <td key={i} className="px-4 py-3">
                        <CellIcon value={cell} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-text-tertiary">
            &ldquo;Unverified&rdquo; means a claim this page can&apos;t back
            up with source or spec evidence, not a claim of &ldquo;no.&rdquo;
            fastmcp and mcp-tracer are intentionally not columns here — see
            the sections above for why.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight text-foreground">
            When is raw @opentelemetry/api enough on its own?
          </h2>
          <p className="mt-4 text-muted-foreground">
            If silent failures aren&apos;t a concern for a given server —
            every tool either succeeds cleanly or throws, never returning{" "}
            <code className="rounded-md bg-muted px-1.5 py-0.5 font-mono text-[0.9em] text-foreground">isError: true</code>{" "}
            on a JSON-RPC success — a hand-written span wrapper around
            thrown exceptions covers the same ground {PACKAGE.name} does for
            that case. The gap {PACKAGE.name} exists to close is
            specifically the <code className="rounded-md bg-muted px-1.5 py-0.5 font-mono text-[0.9em] text-foreground">isError: true</code>{" "}
            case, plus not having to write and maintain that wrapping code
            by hand across every tool handler.
          </p>

          <p className="mt-10 text-sm text-text-tertiary">
            By {AUTHOR.name} — Last updated: {formatDate(DATE_MODIFIED)}
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight text-foreground">
            Where do I go from here?
          </h2>
          <ul className="mt-3 list-disc space-y-2 pl-6 text-muted-foreground">
            <li>
              <Link href="/docs/silent-failures" className="text-brand hover:underline">
                Silent Failures
              </Link>{" "}
              — the detection gap this whole comparison centers on.
            </li>
            <li>
              <Link href="/docs/migration" className="text-brand hover:underline">
                Migration Guide
              </Link>{" "}
              — moving from hand-written @opentelemetry/api instrumentation.
            </li>
            <li>
              <Link href="/faq" className="text-brand hover:underline">
                FAQ
              </Link>{" "}
              — including the fastmcp question in more detail.
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}
