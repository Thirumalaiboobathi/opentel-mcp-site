import {
  DollarSign,
  Fingerprint,
  Gauge,
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
