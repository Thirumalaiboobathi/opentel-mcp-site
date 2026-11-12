import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { AnimatedTerminal } from "@/components/landing/AnimatedTerminal";
import { InstallSwitcher } from "@/components/landing/InstallSwitcher";
import { GitHubIcon } from "@/components/icons/GitHubIcon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PACKAGE } from "@/lib/constants";

export function Hero() {
  return (
    <section className="dot-grid relative overflow-hidden">
      <div className="mx-auto grid max-w-[1200px] grid-cols-1 items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:py-24 xl:px-8">
        <div>
          <ul className="flex flex-wrap gap-2" aria-label="Current releases">
            <li>
              <Badge variant="outline" className="border-brand/40 text-brand">
                npm v{PACKAGE.version}
              </Badge>
            </li>
            <li>
              <Badge variant="outline" className="border-brand/40 text-brand">
                PyPI v{PACKAGE.pypiVersion}
              </Badge>
            </li>
            <li>
              <Badge variant="outline" className="text-muted-foreground">
                {PACKAGE.downloads} npm downloads
              </Badge>
            </li>
          </ul>

          <h1 className="mt-6 text-[clamp(2rem,5vw,3.75rem)] leading-[1.05] font-semibold tracking-tight text-foreground">
            Your MCP tool failed. Your traces said{" "}
            <span className="text-brand">200 OK</span>.
          </h1>

          <p className="mt-6 max-w-[60ch] text-lg text-muted-foreground">
            OpenTelemetry for MCP servers in Node.js and Python — it catches
            silent failures and tampered tool definitions. It detects, never
            blocks.
          </p>

          <div className="mt-8">
            <InstallSwitcher />
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button size="lg" asChild>
              <Link href="/docs/getting-started">
                Read the docs
                <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href={PACKAGE.github} target="_blank" rel="noopener noreferrer">
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
