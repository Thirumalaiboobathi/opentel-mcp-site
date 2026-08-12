import {
  Boxes,
  Diff,
  DollarSign,
  Eye,
  Fingerprint,
  Gauge,
  Repeat,
  Share2,
  ShieldOff,
  Sparkles,
  SquareStack,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const FEATURES = [
  {
    icon: ShieldOff,
    title: "Silent Failure Detection",
    description:
      "Detects CallToolResult.isError = true inside otherwise-successful JSON-RPC responses and marks the span ERROR — no other Node.js MCP library does this.",
  },
  {
    icon: Fingerprint,
    title: "Deep Failure Fingerprinting",
    description:
      "SHA-256 hashes truncated to 16 hex characters group identical failures across traces, without leaking raw payloads into span attributes.",
  },
  {
    icon: Gauge,
    title: "Twelve Metrics Instruments",
    description:
      "Ships counters and histograms out of the box — call/error/duration counts, cost and token totals, five Agent Thrash Detection loop instruments, and schema drift detection — ready for Prometheus, SigNoz, or any OTel-compatible backend.",
  },
  {
    icon: DollarSign,
    title: "Cost & Token Attribution",
    description:
      "LLM-wrapping tools get automatic token counts, model detection, and USD cost estimates. Anthropic, OpenAI, Bedrock, Google, DeepSeek supported by default. v0.5.0.",
  },
  {
    icon: Sparkles,
    title: "Never Throws",
    description:
      "Every instrumentation path is designed to fail safe. Fingerprinting falls back to a fixed value rather than raising an exception.",
  },
  {
    icon: SquareStack,
    title: "Cardinality-Safe Labels",
    description:
      "A frozen METRIC_SAFE_ATTRIBUTES array constrains metric attributes, preventing high-cardinality label explosions in your backend.",
  },
  {
    icon: Repeat,
    title: "Agent Thrash Detection",
    description:
      "Flags a tool failing with the same fingerprint repeatedly in one session — the pattern an agent produces retrying a call that can't succeed. Channel-aware thresholds set a different bar per failure origin, and wasted tokens and cost for the whole retry loop attribute to one event instead of scattering across N failed spans. v0.6.0, channel-aware thresholds in v0.7.0.",
  },
  {
    icon: Diff,
    title: "Tool Schema Drift Detection",
    description:
      "Watches tools/list and flags when a tool's inputSchema changes between observations, connecting otherwise-inexplicable agent failures back to the schema changing under you. v0.8.0.",
  },
  {
    icon: Eye,
    title: "Two-Axis Observation Contract",
    description:
      "getObservationState() returns toolOutcome (success/failure/unknown counts) and observationIntegrity ('DEGRADED' | 'UNKNOWN') — whether this library's own signal can be trusted right now, separate from whether any tool call failed. Closes the case where instrumentation silently no-ops with no TracerProvider ever registered, making a failing tool indistinguishable from a healthy one. v0.8.0.",
  },
  {
    icon: Share2,
    title: "Shared Tracker State (instanceKey)",
    description:
      "Repeated instrumentMcpServer() calls that pass the same instanceKey share Agent Thrash Detection, budget tracking, schema drift, and the toolOutcome counter's state instead of each call resetting to empty — fixes stateless, per-request deployment shapes. v0.9.0.",
  },
  {
    icon: Boxes,
    title: "MCP v2 Support",
    description:
      "Both @modelcontextprotocol/sdk (v1) and @modelcontextprotocol/server (v2, protocol revision 2026-07-28) work with instrumentMcpServer() — two optional peer dependencies, install whichever you use. Spans, fingerprinting, and channel classification all work the same as v1. v0.10.0.",
  },
] as const;

export function Features() {
  return (
    <section className="mx-auto max-w-[1200px] px-4 py-20 sm:px-6 xl:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          Built specifically for MCP observability
        </h2>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((feature) => (
          <Card key={feature.title}>
            <CardHeader>
              <feature.icon
                className="size-5 text-brand"
                aria-hidden="true"
              />
              <CardTitle className="mt-3">{feature.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {feature.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
