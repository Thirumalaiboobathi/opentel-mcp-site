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
    version: "0.8.0",
    date: "2026-08-05",
    href: "tree/v0.8.0",
    title: "Schema drift, observation contract, sampling signal",
    items: [
      <>
        Added: tool schema drift detection. Watches every{" "}
        {code("tools/list")} response, hashes each tool&apos;s{" "}
        {code("inputSchema")} (never {code("description")}), and flags
        changes against the last-observed hash for that tool. Six drift
        kinds: {code("field_added")}, {code("field_removed")},{" "}
        {code("type_changed")}, {code("required_changed")},{" "}
        {code("multiple")}, {code("unknown")}. New{" "}
        {code("mcp.tool.schema_drift.detected")} counter and matching span
        event on a new {code("tools/list")} span, plus a{" "}
        {code("schemaDrift")} config block ({code("enabled")}, default{" "}
        {code("true")}; {code("maxTrackedTools")}, default {code("1000")}
        ), each overridable via {code("OTEL_MCP_SCHEMA_DRIFT_*")} env vars.
        Full design: ADR 010 ({code("docs/adr/010-schema-drift.md")}).
      </>,
      <>
        Added: {code("getObservationState()")}, a two-axis observation
        contract returning {code("toolOutcome")} ({code("{ success, failure, unknown }")}
        ) and {code("observationIntegrity")} ({code("'DEGRADED' | 'UNKNOWN'")}
        ) — detects the case where instrumentation silently no-ops because
        no {code("TracerProvider")}/{code("MeterProvider")} was ever
        registered, so a failed tool call in that state doesn&apos;t read
        as indistinguishable from one that never failed. Prompted by
        external review from Massimiliano Brighindi. Full design: ADR 008
        ({code("docs/adr/008-observation-liveness.md")}, &quot;Update
        (2026-08-05)&quot; section).
      </>,
      <>
        Added: {code("mcp.tool.thrash_detected")} boolean span attribute,
        set alongside the existing {code("mcp.loop.detected")} span event
        — gives an OpenTelemetry Collector {code("tailsamplingprocessor")}{" "}
        an attribute-level signal to key a {code("boolean_attribute")}{" "}
        policy on, deliberately named differently from the{" "}
        {code("mcp.tool.loop.detected")} metric counter. No new
        cost-threshold attribute or config —{" "}
        {code("mcp.tool.cost.usd")}/{code("mcp.tool.cost.budget_exceeded")}{" "}
        (v0.5.0) already suffice; the threshold itself lives in the
        Collector policy YAML. Full design: ADR 011 ({code("docs/adr/011-cost-aware-sampling.md")}
        ).
      </>,
    ],
    note: (
      <Callout variant="critical" title="Behavior change on upgrade — read before updating">
        Because {code("schemaDrift.enabled")} defaults to {code("true")},
        the existing instrument-first requirement now also covers{" "}
        {code("tools/list")}. Low-level {code("Server")} users who call{" "}
        {code("setRequestHandler(ListToolsRequestSchema, ...)")} before{" "}
        {code("instrumentMcpServer()")} will now get{" "}
        {code("INSTRUMENT_FIRST_ERROR")} where they previously did not —
        no other code change required to hit it.{" "}
        <strong>{code("McpServer")} users are unaffected</strong> (it
        registers {code("tools/list")} and {code("tools/call")} together,
        atomically). Migration: reorder the {code("tools/list")}{" "}
        registration to after {code("instrumentMcpServer()")}, or pass{" "}
        {code("schemaDrift: { enabled: false }")}.
      </Callout>
    ),
  },
  {
    version: "0.7.0",
    date: "2026-08-03",
    href: "tree/v0.7.0",
    title: "Channel-aware thrash thresholds",
    items: [
      <>
        Added: {code("mcp.failure.channel")} span attribute classifying
        where a {code("tools/call")} failure originated —{" "}
        {code("execution")}, {code("protocol.input")},{" "}
        {code("protocol.not_found")}, {code("protocol.output")},{" "}
        {code("protocol.other")}, {code("unknown")}. Agent Thrash Detection
        picks a threshold per channel instead of treating every repeat
        identically.
      </>,
      <>
        Added: {code("thrashDetection.inputThreshold")} (env{" "}
        {code("OTEL_MCP_THRASH_INPUT_THRESHOLD")}, default {code("5")}) —
        a higher bar for {code("protocol.input")}, since an agent retrying
        with adjusted arguments may be converging on a correct call.
      </>,
      <>
        Added: {code("thrashDetection.notFoundThreshold")} (env{" "}
        {code("OTEL_MCP_THRASH_NOT_FOUND_THRESHOLD")}, default {code("1")}
        ) — an immediate flag; retrying a tool name that doesn&apos;t exist
        is never convergence.
      </>,
      <>
        Added: a {code("classifyFailureChannel()")} recovery path for the
        high-level {code("McpServer")}, reading the{" "}
        {code("MCP error {code}: ")} wrapper back out of errors{" "}
        {code("McpServer")} already converted to {code("isError: true")}{" "}
        before this library ever sees them.
      </>,
      <>
        Fixed: {code("protocol.output")} failures — the tool&apos;s own
        output failing its declared output schema, the server author&apos;s
        bug, unfixable by any argument the agent supplies — are now
        excluded from Agent Thrash Detection entirely.{" "}
        <strong>
          This was a false positive present in every published version
          through v0.6.1.
        </strong>
      </>,
      <>
        Unchanged: the default {code("threshold")} ({code("3")}) still
        applies to {code("execution")}, {code("protocol.other")}, and{" "}
        {code("unknown")}.
      </>,
    ],
    note: (
      <Callout variant="warning" title="Reachability differs by server API">
        The low-level {code("Server")} reaches all six{" "}
        {code("mcp.failure.channel")} values directly. The high-level{" "}
        {code("McpServer")} reaches the protocol channels only through the
        recovery path above, which is coupled to the installed SDK&apos;s
        exact error-message prose and degrades safely to {code("execution")}{" "}
        (never a wrong specific answer) if that prose changes.
      </Callout>
    ),
  },
  {
    version: "0.6.1",
    date: "2026-08-03",
    href: "tree/v0.6.1",
    title: "TypeScript declaration fix",
    items: [
      <>
        Fixed: {code("src/index.d.ts")} re-exported values ({code("computeFingerprint")}
        , {code("toSpanAttributes")}, {code("ATTRIBUTE_KEYS")},{" "}
        {code("METRIC_SAFE_ATTRIBUTES")}, {code("DEFAULT_CLASSIFIERS")},{" "}
        {code("DEFAULT_PRICING")}, {code("defaultExtractor")},{" "}
        {code("calculateCost")}) from six {code(".js")} modules that had no
        corresponding {code(".d.ts")} file, so any consumer with{" "}
        {code("strict")}/{code("noImplicitAny")} got a {code("TS7016")}{" "}
        error just from importing the package. Pre-existing since v0.4.0
        (fingerprinting) and v0.5.0 (cost tracking) — first caught
        verifying the v0.6.0 published tarball.
      </>,
    ],
  },
  {
    version: "0.5.0",
    date: "2026-07-29",
    href: "tree/v0.5.0",
    title: "Cost & Token Attribution",
    items: [
      <>
        Major feature: automatic LLM cost and token attribution on MCP
        tool calls that wrap model calls. See{" "}
        <Link href="/docs/cost-tracking" className="text-brand hover:underline">
          Cost & Token Attribution
        </Link>
        .
      </>,
      <>
        {code("costTracking")} option (default enabled) on{" "}
        {code("instrumentMcpServer()")} — recognizes Anthropic, OpenAI,
        and Bedrock usage field-name conventions, the MCP{" "}
        {code("_meta.usage")} extension point, and JSON-in-text inside{" "}
        {code("content[0].text")}. Never throws; unrecognized shapes
        resolve to {code("null")}.
      </>,
      <>
        New span attributes: {code("mcp.tool.tokens.input")},{" "}
        {code("mcp.tool.tokens.output")}, {code("mcp.tool.tokens.total")}
        , {code("mcp.tool.model")}, {code("mcp.tool.cost.usd")}, and{" "}
        {code("mcp.tool.cost.currency")}, plus {code("gen_ai.response.model")}
        {" "}co-emitted alongside {code("mcp.tool.model")} for GenAI
        semantic-convention dashboard compatibility.
      </>,
      <>
        Two new metric instruments, same {code("@opentelemetry/api")}-only
        pattern as the four existing {code("mcp.tool.*")} metrics:{" "}
        {code("mcp.tool.tokens.total")} (counter, unit {code("tokens")})
        and {code("mcp.tool.cost.total")} (counter, unit {code("USD")}).
      </>,
      <>
        Budget guardrails ({code("costTracking.budget")}:{" "}
        {code("perSessionUsd")}, {code("perToolUsd")}) — observability
        flags, <strong>not enforcement</strong>. Sets{" "}
        {code("mcp.tool.cost.budget_exceeded")} /{" "}
        {code("mcp.tool.cost.budget_scope")} on the span once a
        configured limit is crossed; never blocks or throws.
      </>,
      <>
        New exports: {code("DEFAULT_PRICING")} (15+ models across five
        providers — Anthropic, OpenAI, Google, AWS Bedrock, DeepSeek),{" "}
        {code("defaultExtractor")}, {code("calculateCost")}. New types:{" "}
        {code("CostTrackingOptions")}, {code("TokenUsage")},{" "}
        {code("UsageExtractor")}, {code("ModelPricing")},{" "}
        {code("PricingTable")}, {code("BudgetConfig")}.
      </>,
    ],
    note: (
      <Callout variant="warning" title="Pricing accuracy and budget scope">
        {code("DEFAULT_PRICING")} is a convenience default, last verified
        2026-07-29 — not a maintained price list. Provider pricing
        changes frequently; production users must override{" "}
        {code("costTracking.pricingTable")}. Budget tracking is
        in-memory and per {code("instrumentMcpServer()")} call — it
        resets on process restart, and session-scoped limits are
        skipped gracefully (not enforced against a fallback key) for
        transports with no session id, like stdio.
      </Callout>
    ),
  },
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
        {code("{ fingerprinting: false }")} anyway.{" "}
        <strong>Still not fixed in v0.5.0</strong> — v0.5.0 added{" "}
        {code("costTracking")} to {code("InstrumentOptions")} instead;
        {code("fingerprinting")} remains JSDoc-only, now planned for
        v0.6.0. See{" "}
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
  image: `${SITE.url}/opengraph-image`,
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
            dateModified: "2026-07-29",
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
              <Link href="/docs/cost-tracking" className="text-brand hover:underline">
                Cost & Token Attribution
              </Link>{" "}
              — the full v0.5.0 feature.
            </li>
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
