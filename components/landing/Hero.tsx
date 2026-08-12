import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { AnimatedTerminal } from "@/components/landing/AnimatedTerminal";
import { CopyButton } from "@/components/landing/CopyButton";
import { GitHubIcon } from "@/components/icons/GitHubIcon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PACKAGE, SITE } from "@/lib/constants";

const INSTALL_COMMAND = `pnpm add ${PACKAGE.name} @opentelemetry/api`;

export function Hero() {
  return (
    <section className="dot-grid relative overflow-hidden">
      <div className="mx-auto grid max-w-[1200px] grid-cols-1 items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:py-28 xl:px-8">
        <div>
          <Badge variant="outline" className="border-brand/40 text-brand">
            v{PACKAGE.version} — MCP v2 support shipped
          </Badge>

          <h1 className="mt-6 text-[clamp(2rem,5vw,4rem)] leading-[1.05] font-semibold tracking-tight text-foreground">
            {SITE.tagline}
          </h1>

          <p className="mt-6 max-w-xl text-lg text-muted-foreground">
            MCP tools can return a successful JSON-RPC envelope with{" "}
            <code className="rounded-md bg-muted px-1.5 py-0.5 font-mono text-[0.9em] text-foreground">
              isError: true
            </code>{" "}
            buried inside. Standard OpenTelemetry never sees it.{" "}
            {PACKAGE.name} does — and marks the span ERROR.
          </p>

          <p className="mt-3 max-w-xl text-sm text-muted-foreground">
            v0.10.0 adds support for MCP v2 (@modelcontextprotocol/server)
            alongside the original SDK — install whichever you use. v0.9.0
            added instanceKey for sharing tracker state across stateless,
            per-request deployments.
          </p>

          <div className="mt-8 flex max-w-md items-center justify-between gap-3 rounded-lg border border-border bg-surface px-4 py-3 font-mono text-sm">
            <code className="overflow-x-auto text-foreground">
              {INSTALL_COMMAND}
            </code>
            <CopyButton value={INSTALL_COMMAND} />
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button size="lg" asChild>
              <Link href="/docs/getting-started">
                Read the docs
                <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a
                href={PACKAGE.github}
                target="_blank"
                rel="noopener noreferrer"
              >
                <GitHubIcon className="size-4" aria-hidden="true" />
                Star on GitHub
              </a>
            </Button>
          </div>
        </div>

        <div className="flex justify-center lg:justify-end">
          <AnimatedTerminal />
        </div>
      </div>
    </section>
  );
}
