import {
  Activity,
  Boxes,
  Clock,
  DollarSign,
  Eye,
  EyeOff,
  Fingerprint,
  Gauge,
  Layers,
  PackageCheck,
  Repeat,
  Share2,
  ShieldOff,
  Diff,
  Timer,
  type LucideIcon,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Feature = { icon: LucideIcon; title: string; description: string };

const THEMES: { id: string; title: string; blurb: string; features: Feature[] }[] = [
  {
    id: "core",
    title: "Core",
    blurb: "What every server gets from one instrumentMcpServer() call.",
    features: [
      {
        icon: ShieldOff,
        title: "Silent-failure detection",
        description: "isError inside a 200 OK marks the span ERROR.",
      },
      {
        icon: Fingerprint,
        title: "Error fingerprints",
        description: "Stable hashes group identical failures; same in JS and Python.",
      },
      {
        icon: Gauge,
        title: "Health grades A–F",
        description: "A single grade per tool, from real call outcomes.",
      },
      {
        icon: Eye,
        title: "Unactionable-error detection",
        description: "Flags errors an agent can't act on or recover from.",
      },
      {
        icon: Activity,
        title: "flushOnExit",
        description: "Short-lived processes flush telemetry before they exit.",
      },
      {
        icon: Layers,
        title: "Tools, resources, prompts",
        description: "All three MCP call types are traced, not just tools.",
      },
      {
        icon: Repeat,
        title: "Agent thrash detection",
        description: "Flags the same failure repeating within one session.",
      },
      {
        icon: Diff,
        title: "Schema drift detection",
        description: "Flags tools whose inputSchema changes between observations.",
      },
      {
        icon: DollarSign,
        title: "Cost and token attribution",
        description: "Token counts and USD estimates for LLM-wrapping tools.",
      },
      {
        icon: Share2,
        title: "Shared tracker state",
        description: "instanceKey keeps state across stateless, per-request servers.",
      },
      {
        icon: Boxes,
        title: "MCP SDK v1 and v2",
        description: "Works with @modelcontextprotocol/sdk and /server.",
      },
    ],
  },
  {
    id: "freshness",
    title: "Data freshness",
    blurb: "Know when a tool is answering with stale data.",
    features: [
      {
        icon: Clock,
        title: "Staleness detection",
        description:
          "asOf with maxAgeMs, or freshUntil, via the freshness _meta key.",
      },
      {
        icon: Timer,
        title: "Clock-skew visibility (JS)",
        description: "Surfaces skew that would make freshness checks misleading.",
      },
    ],
  },
  {
    id: "privacy",
    title: "Privacy and hardening",
    blurb: "Observability that doesn't become a data leak.",
    features: [
      {
        icon: EyeOff,
        title: "Never records arguments or results",
        description: "Tool arguments and results stay out of telemetry.",
      },
      {
        icon: ShieldOff,
        title: "Credential scrubbing",
        description: "Credentials are scrubbed before anything is emitted.",
      },
      {
        icon: PackageCheck,
        title: "Hardened dashboard",
        description:
          "CSRF protection, DNS-rebinding defense, CSP, and request size limits.",
      },
      {
        icon: Eye,
        title: "SECURITY.md and threat model",
        description: "Documented reporting process and threat-model docs.",
      },
      {
        icon: PackageCheck,
        title: "Clean install (v0.18.1)",
        description:
          "No deprecation warnings, 0 known vulnerabilities, live resource and prompt spans in the dashboard.",
      },
    ],
  },
];

export function Features() {
  return (
    <section className="cv-auto mx-auto max-w-[1200px] px-4 py-16 sm:px-6 xl:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          Built specifically for MCP observability
        </h2>
        <p className="mt-3 text-muted-foreground">
          Always detects, never blocks.
        </p>
      </div>

      <div className="mt-12 space-y-14">
        {THEMES.map((theme) => (
          <div key={theme.id}>
            <h3 className="text-lg font-semibold text-foreground">
              {theme.title}
            </h3>
            <p className="mt-1 max-w-[70ch] text-sm text-muted-foreground">
              {theme.blurb}
            </p>
            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {theme.features.map((f) => (
                <Card key={f.title}>
                  <CardHeader>
                    <f.icon className="size-5 text-brand" aria-hidden="true" />
                    <CardTitle className="mt-3">{f.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {f.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
