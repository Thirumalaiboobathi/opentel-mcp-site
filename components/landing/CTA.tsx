import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { CopyButton } from "@/components/landing/CopyButton";
import { Button } from "@/components/ui/button";
import { PACKAGE } from "@/lib/constants";

const INSTALL_COMMAND = `pnpm add ${PACKAGE.name}`;

export function CTA() {
  return (
    <section className="dot-grid border-t border-border">
      <div className="mx-auto flex max-w-[1200px] flex-col items-center px-4 py-24 text-center sm:px-6 xl:px-8">
        <h2 className="max-w-xl text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          Stop shipping silent MCP failures.
        </h2>
        <p className="mt-4 max-w-md text-muted-foreground">
          Install {PACKAGE.name} and see the first ERROR span it catches
          that your current setup misses.
        </p>

        <div className="mt-8 flex w-full max-w-md items-center justify-between gap-3 rounded-lg border border-border bg-surface px-4 py-3 font-mono text-sm">
          <code className="overflow-x-auto text-foreground">
            {INSTALL_COMMAND}
          </code>
          <CopyButton value={INSTALL_COMMAND} />
        </div>

        <Button size="lg" className="mt-6" asChild>
          <Link href="/docs/getting-started">
            Get started
            <ArrowRight aria-hidden="true" />
          </Link>
        </Button>
      </div>
    </section>
  );
}
