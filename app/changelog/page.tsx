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
    version: "0.10.0",
    date: "2026-08-11",
    href: "tree/v0.10.0",
    title: "MCP v2 support, hardened server detection",
    items: [
      <>
        Changed: {code("detectServerKind()")} now additionally requires an{" "}
        {code("McpServer")}-shaped object&apos;s {code(".server")} property
        to be {code("instanceof")} a real, resolved {code("Server")} class
        from a supported SDK — not merely an object exposing a{" "}
        {code("setRequestHandler")} method. An object that passes the outer
        shape check but fails that instanceof check now throws at{" "}
        {code("instrumentMcpServer()")} call time, instead of succeeding
        and producing zero telemetry — a plain {code("Error")}, not a
        named or exported error class (internally tracked as{" "}
        {code("UNWRAPPABLE_MCPSERVER_ERROR")}, but that identifier is
        neither exported nor catchable — only the message string is
        real), so it can&apos;t be caught by type or a {code(".code")}{" "}
        property. No escape hatch was added. Closes known-gaps entry 7.
      </>,
      <>
        Added: {code("@modelcontextprotocol/server")} (MCP v2, protocol
        revision 2026-07-28) support — two separate, OPTIONAL peer
        dependencies ({code("@modelcontextprotocol/sdk")} for v1,{" "}
        {code("@modelcontextprotocol/server")} for v2), install whichever
        one(s) you actually use. Same {code("Server")}/{code("McpServer")}{" "}
        API shapes as v1; detection and wrapping resolved automatically,
        once per {code("instrumentMcpServer()")} call. Spans, standard
        attributes (including {code("jsonrpc.request.id")}, now read from
        v2&apos;s {code("ctx.mcpReq.id")}), deep failure fingerprinting, and{" "}
        {code("mcp.failure.channel")}/{code("mcp.failure.validation_paths")}{" "}
        classification all work the same as v1. Full design:{" "}
        <a
          href={`${PACKAGE.github}/blob/main/docs/adr/015-mcp-v2-support.md`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-brand hover:underline"
        >
          ADR 015
        </a>
        .
      </>,
      <>
        Fixed: {code("isSingleConnectionTransport()")} no longer
        auto-detects the transport {code("createMcpHandler")} builds
        internally ({code("PerRequestHTTPServerTransport")}) as
        single-connection — it now requires positive confirmation (
        {code("transport.constructor.name === 'StdioServerTransport'")})
        for v2 specifically, closing a confirmed false positive.{" "}
        {code("thrashConnectionFallbackSessionId")} is also now
        registry-backed via {code("instanceKey")}, so the fallback session
        id is shared across repeated {code("instrumentMcpServer()")} calls
        instead of regenerated fresh on every one. Together, these fix
        known-gaps entry 8 outright and close entry 6&apos;s
        fallback-id half — entry 6 itself is partially fixed, not closed; a
        structural limitation survives (see{" "}
        <Link href="/docs/instance-state" className="text-brand hover:underline">
          Tracker State Under Stateless HTTP
        </Link>
        ). One narrower thing stays open: the internal flag
        tracking whether a server has ever proven itself session-aware
        isn&apos;t registry-backed yet — see{" "}
        <Link href="/docs/instance-state" className="text-brand hover:underline">
          Tracker State Under Stateless HTTP
        </Link>
        .
      </>,
    ],
    note: (
      <Callout variant="critical" title="Behavior change on upgrade — read before updating">
        An {code("McpServer")}-shaped object whose {code(".server")} isn&apos;t
        a recognized {code("Server")} instance from either supported SDK now
        throws — a plain {code("Error")}, not a named or exported error
        class, so it can&apos;t be caught by type or a {code(".code")}{" "}
        property — instead of silently instrumenting nothing. If you hit this on an object you believe
        genuinely is a {code("Server")}/{code("McpServer")}, suspect a
        duplicate or mismatched SDK install (check for multiple resolved
        copies — {code("npm dedupe")} — or confirm normal{" "}
        {code("node_modules")} resolution from wherever opentel-mcp itself
        is installed, if it&apos;s a monorepo/hoisting issue rather than a
        duplicate). A real {code("Server")}/{code("McpServer")} from a
        single, consistently-resolved SDK install is unaffected.
      </Callout>
    ),
  },
  {
    version: "0.9.0",
    date: "2026-08-10",
    href: "tree/v0.9.0",
    title: "instanceKey, broadened auth classifier",
    items: [
      <>
        Fixed: the {code("auth")} failure classifier missed &quot;permission
        denied&quot; and &quot;access denied&quot; — standard Unix/git/AWS
        IAM/GCP phrasing for a permission failure — recognizing only
        HTTP-status-derived wording ({code("unauthorized")},{" "}
        {code("forbidden")}, {code("authenticat(e|ion)")}), 401/403 codes,
        and known auth-library error names. Now also matches &quot;not
        authorized&quot;, &quot;permission(s) denied&quot;, &quot;access
        denied&quot;, &quot;insufficient permission(s)&quot;, and Node&apos;s{" "}
        {code("EACCES")}/{code("EPERM")}. Does not amend ADR 006&apos;s
        closed 8-category taxonomy — {code("auth")} already existed; this
        is pattern coverage for when it fires.
      </>,
      <>
        Added: {code("instanceKey")}, a string option on{" "}
        {code("instrumentMcpServer()")} (or the{" "}
        {code("OTEL_MCP_INSTANCE_KEY")} env var) that lets repeated{" "}
        {code("instrumentMcpServer()")} calls sharing the same key share
        Agent Thrash Detection, budget tracking, schema drift detection,
        and the {code("toolOutcome")} counter&apos;s state, instead of each
        call constructing all four fresh. Fixes the gap under
        &quot;stateless&quot; Streamable HTTP deployments (a fresh{" "}
        {code("Server")}/{code("McpServer")} re-instrumented per request).
        Backed by a bounded, TTL-evicting registry (1,000 keys/process, 24h
        TTL renewed on use). Omitting it (the default) is byte-identical to
        every prior version. Full design:{" "}
        <a
          href={`${PACKAGE.github}/blob/main/docs/adr/012-tracker-lifecycle-and-shared-state.md`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-brand hover:underline"
        >
          ADR 012
        </a>
        . See{" "}
        <Link href="/docs/instance-state" className="text-brand hover:underline">
          Tracker State Under Stateless HTTP
        </Link>
        .
      </>,
    ],
    note: (
      <Callout variant="critical" title="Fingerprint values changed on upgrade for auth-classified messages">
        Because {code("category")} is a hashed input to{" "}
        {code("computeFingerprint()")}, the broadened {code("auth")}{" "}
        classifier above changes {code("mcp.failure.fingerprint")} for any
        message that now classifies as {code("auth")} instead of{" "}
        {code("internal")}. If you alert or dashboard on a specific
        fingerprint value for a permission error, expect a new value after
        upgrading.
      </Callout>
    ),
  },
  {
    version: "0.8.0",
    date: "2026-08-07",
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
      <Callout variant="warning" title="Type-declaration gap in v0.4.0 — since resolved">
        The {code("fingerprinting")} option was implemented and defaulted
        to {code("true")} in {code("src/config.js")} and{" "}
        {code("src/instrument.js")}, but wasn&apos;t listed in the{" "}
        {code("InstrumentOptions")} TypeScript interface in{" "}
        {code("src/index.d.ts")} as of this version — it worked at
        runtime, but TypeScript consumers could see a type error passing{" "}
        {code("{ fingerprinting: false }")} anyway.{" "}
        <strong>Resolved in v0.6.0</strong>: {code("fingerprinting?: boolean")}{" "}
        landed on {code("InstrumentOptions")}. A narrower, related gap is{" "}
        <strong>still not resolved as of v0.10.0</strong>:{" "}
        {code("computeFingerprint()")}&apos;s {code("classifiers")}/{code("stackFrames")}{" "}
        options remain unwired through {code("instrumentMcpServer()")}&apos;s
        own options — no target version has been set for that part. See{" "}
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
    version: "0.1.1",
    date: "2026-07-12",
    href: "compare/v0.1.0...v0.2.0",
    title: "Patch release",
    items: [
      <>
        Fix: {code("serviceName")} became optional — required (a
        non-empty string) only when {code("setupNodeSdk: true")}, throwing
        if missing in that mode; no effect otherwise, with a
        once-per-process {code("diag.warn")} if passed anyway.
      </>,
      <>
        Build: removed the published {code("workspaces")} array from{" "}
        {code("package.json")}; added {code("prepack")}/{code("postpack")}{" "}
        hooks ({code("strip-workspaces.js")}/{code("restore-workspaces.js")})
        to strip it before publish and restore it after.
      </>,
      "Docs: README gained an ESM requirement note (\"type\": \"module\" or .mjs), an npm version badge, an Install section, and a 0.x semantic-conventions stability note.",
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
      "Docs: ADR 004 documents the semantic-conventions alignment.",
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
            history, README, ADRs, and known-gaps tracker — cross-checked
            against {code("CHANGELOG.md")} where it agreed, not
            reconstructed from memory.
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
