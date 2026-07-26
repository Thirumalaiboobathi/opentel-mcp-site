import Link from "next/link";
import type { Metadata } from "next";

import { Callout } from "@/components/content/Callout";
import { JsonLd } from "@/components/seo/JsonLd";
import { PACKAGE, SITE } from "@/lib/constants";
import { buildMetadata } from "@/lib/metadata";
import { buildBreadcrumbListSchema, buildTechArticleSchema } from "@/lib/schema";
import { formatDate } from "@/lib/utils";

const PATH = "/changelog";

const code = (text: string) => (
  <code className="rounded-md bg-muted px-1.5 py-0.5 font-mono text-[0.9em] text-foreground">
    {text}
  </code>
);

const VERSIONS = [
  {
    version: "0.4.0",
    date: "2026-07-24",
    href: "tree/v0.4.0",
    title: "Deep Failure Fingerprinting",
    items: [
      <>
        Adds {code("computeFingerprint()")} — a stable, 16-hex-character
        identity (SHA-256, truncated) for every thrown error and every
        tool-level failure ({code("isError: true")}), so repeated
        occurrences of the same underlying bug group under one fingerprint.
        See{" "}
        <Link href="/docs/deep-fingerprinting" className="text-brand hover:underline">
          Deep Failure Fingerprinting
        </Link>
        .
      </>,
      <>
        Five new {code("mcp.failure.*")} span attributes: fingerprint,
        signature, category (8 values), origin, and error class.
      </>,
      <>
        {code("METRIC_SAFE_ATTRIBUTES")} — a frozen array structurally
        limiting which fingerprint-derived values can reach a metric label
        to {code("category")} and {code("origin")} (24 combinations
        maximum), so nothing unbounded can leak into a metrics backend.
      </>,
      <>
        {code("fingerprinting")} option (default {code("true")}) on{" "}
        {code("instrumentMcpServer()")}.
      </>,
      <>
        {code("computeFingerprint")}, {code("toSpanAttributes")},{" "}
        {code("ATTRIBUTE_KEYS")}, {code("METRIC_SAFE_ATTRIBUTES")}, and{" "}
        {code("DEFAULT_CLASSIFIERS")} re-exported from the package root.
      </>,
    ],
    note: (
      <Callout variant="warning" title="Known type-declaration gap in v0.4.0">
        The {code("fingerprinting")} option is implemented and defaults to{" "}
        {code("true")} in {code("src/config.js")} and{" "}
        {code("src/instrument.js")}, but isn&apos;t listed in the{" "}
        {code("InstrumentOptions")} TypeScript interface in{" "}
        {code("src/index.d.ts")} as of this version. It works at runtime;
        TypeScript consumers may see a type error passing{" "}
        {code("{ fingerprinting: false }")} anyway. Fixed in v0.5.0. See{" "}
        <Link href="/docs/api-reference" className="text-brand hover:underline">
          API Reference
        </Link>
        .
      </Callout>
    ),
  },
  {
    version: "0.3.0",
    date: "2026-07-20",
    href: "commit/2147a98",
    title: "Metrics",
    items: [
      <>
        Four {code("mcp.tool.*")} OpenTelemetry metrics instruments via{" "}
        {code("@opentelemetry/api")}&apos;s Metrics API — no bundled SDK or
        exporter, same host-app-provides-the-SDK pattern tracing already
        used: {code("mcp.tool.calls")} (counter, every call),{" "}
        {code("mcp.tool.errors")} (counter, thrown/rejected handlers),{" "}
        {code("mcp.tool.silent_failures")} (counter,{" "}
        {code("isError: true")}), and {code("mcp.tool.duration")}{" "}
        (histogram, ms). See <Link href="/docs/metrics" className="text-brand hover:underline">Metrics</Link>.
      </>,
      <>
        {code("mcp.tool.silent_failures")} fires from the same{" "}
        {code("isError")} check that marks the span {code("ERROR")} —
        extracted into one shared {code("isToolResultError()")} helper so
        the detection logic isn&apos;t duplicated between traces and
        metrics.
      </>,
      <>
        {code("enableMetrics")} option (default {code("true")}) to opt out
        of metric emission without affecting tracing.
      </>,
      <>
        Metrics are a zero-overhead no-op until the host application
        registers a {code("MeterProvider")} — default{" "}
        {code("@opentelemetry/api")} behavior, not special-cased.
      </>,
      "README: new Metrics section with an instrument table and a SigNoz OTLP/HTTP wiring example.",
    ],
  },
  {
    version: "0.2.0",
    date: "2026-07-13",
    href: "tree/v0.2.0",
    title: "TypeScript declarations and semantic-convention alignment",
    items: [
      "Hand-written TypeScript declarations (.d.ts) so TypeScript consumers get accurate types without a build step.",
      <>
        Span attributes realigned to the MCP semantic conventions:
        {" "}{code("mcp.tool.name")} renamed to {code("gen_ai.tool.name")},{" "}
        {code("mcp.request.id")} renamed to {code("jsonrpc.request.id")},{" "}
        {code("mcp.tool.error.type")} renamed to {code("error.type")}, and
        span name changed to {code("{mcp.method.name} {tool}")}, kind{" "}
        {code("SERVER")}.
      </>,
      <>
        Fix: {code("serviceName")} is no longer required when{" "}
        {code("setupNodeSdk")} is {code("false")}.
      </>,
      "Build: workspace entries stripped from the published package.json manifest.",
      "Docs: ESM-only requirement noted in the install section; ADR 004 documents the semantic-conventions alignment.",
    ],
  },
  {
    version: "0.1.0",
    date: "2026-07-09",
    href: "commit/747f9a7",
    title: "Initial release",
    items: [
      <>
        {code("instrumentMcpServer()")} — supports both the low-level{" "}
        {code("Server")} and high-level {code("McpServer")} APIs from{" "}
        {code("@modelcontextprotocol/sdk")}.
      </>,
      <>
        One OpenTelemetry span per tool invocation, marked {code("ERROR")}{" "}
        on a thrown exception or on {code("CallToolResult.isError: true")}{" "}
        — the silent-failure detection this package exists for from the
        first release. See{" "}
        <Link href="/docs/silent-failures" className="text-brand hover:underline">
          Silent Failures
        </Link>
        .
      </>,
      <>
        Respects an existing global {code("TracerProvider")}; optional
        zero-config {code("setupNodeSdk")} dev mode, exporting to stderr so
        stdio-transport JSON-RPC isn&apos;t corrupted.
      </>,
      "Privacy by design: argument counts captured, never argument values.",
      "Cross-platform (Windows/macOS/Linux), pure JavaScript, zero native dependencies.",
      "25 tests, 3 ADRs, 2 working examples at initial release.",
    ],
  },
] as const;

export const metadata: Metadata = buildMetadata({
  title: `Changelog — ${SITE.name}`,
  description: `Version history for ${PACKAGE.name}, v0.1.0 through v${PACKAGE.version}, sourced from the real commit history and README.`,
  path: PATH,
});

export default function ChangelogPage() {
  return (
    <>
      <JsonLd
        data={[
          buildTechArticleSchema({
            title: `${PACKAGE.name} changelog`,
            description: `Version history for ${PACKAGE.name}.`,
            path: PATH,
            datePublished: "2026-07-26",
            dateModified: "2026-07-26",
          }),
          buildBreadcrumbListSchema([
            { name: "Home", path: "/" },
            { name: "Changelog", path: PATH },
          ]),
        ]}
      />
      <div className="mx-auto w-full max-w-[1200px] flex-1 px-4 py-16 sm:px-6 xl:px-8">
        <div className="prose-content">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">
            Changelog
          </h1>
          <p className="mt-4 text-muted-foreground">
            Version history for {PACKAGE.name}, current version v
            {PACKAGE.version}, sourced from the project&apos;s real commit
            history and {code("CHANGELOG.md")} — not reconstructed from
            memory.
          </p>

          <div className="mt-10 flex flex-col gap-12">
            {VERSIONS.map((release) => (
              <section key={release.version}>
                <h2 className="flex flex-wrap items-baseline gap-x-3 text-xl font-semibold tracking-tight text-foreground">
                  <a
                    href={`${PACKAGE.github}/${release.href}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono hover:underline"
                  >
                    v{release.version}
                  </a>
                  <span className="text-base font-normal text-muted-foreground">
                    {release.title}
                  </span>
                  <span className="ml-auto text-sm font-normal text-text-tertiary">
                    {formatDate(release.date)}
                  </span>
                </h2>
                <ul className="mt-4 ml-6 list-disc space-y-2 text-muted-foreground">
                  {release.items.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
                {"note" in release ? release.note : null}
              </section>
            ))}
          </div>

          <h2 className="mt-12 text-xl font-semibold tracking-tight text-foreground">
            Where do I go from here?
          </h2>
          <ul className="mt-3 list-disc space-y-2 pl-6 text-muted-foreground">
            <li>
              <Link href="/docs/deep-fingerprinting" className="text-brand hover:underline">
                Deep Failure Fingerprinting
              </Link>{" "}
              — the full v0.4.0 feature.
            </li>
            <li>
              <Link href="/docs/api-reference" className="text-brand hover:underline">
                API Reference
              </Link>{" "}
              — current exported surface.
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}
