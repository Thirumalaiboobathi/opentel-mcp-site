import Link from "next/link";
import { CalendarClock, Sparkles } from "lucide-react";

import { PACKAGE } from "@/lib/constants";

export function WhatsNew() {
  return (
    <section className="cv-auto mx-auto max-w-[1200px] px-4 py-12 sm:px-6 xl:px-8">
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-brand/40 bg-brand/5 p-6 md:col-span-2">
          <p className="flex items-center gap-2 text-sm font-medium text-brand">
            <Sparkles className="size-4" aria-hidden="true" />
            What&apos;s new — v0.18 · Python {PACKAGE.pypiVersion}
          </p>
          <h2 className="mt-3 text-xl font-semibold tracking-tight text-foreground">
            Security observability for MCP tool calls
          </h2>
          <ul className="mt-4 max-w-[70ch] list-disc space-y-1.5 pl-5 text-sm text-muted-foreground">
            <li>Tool definition integrity: SHA-256 hashes and pinning to spot rug-pulls.</li>
            <li>Secret leak detection in tool outputs (opt-in; type and count only).</li>
            <li>Auth failure counter and sensitive-tool audit events with wildcards.</li>
            <li>Security panel in the dashboard; identical hashes in JS and Python.</li>
            <li>
              v{PACKAGE.version}: clean install, no deprecation warnings, 0
              known vulnerabilities.
            </li>
          </ul>
          <Link
            href="/changelog"
            className="mt-4 inline-block text-sm text-brand hover:underline"
          >
            Full changelog
          </Link>
        </div>
        <div className="rounded-xl border border-dashed border-border p-6">
          <p className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <CalendarClock className="size-4" aria-hidden="true" />
            Next: v0.19 · planned
          </p>
          <ul className="mt-4 list-disc space-y-1.5 pl-5 text-sm text-muted-foreground">
            <li>Per-call integrity checks</li>
            <li>Suspected-rug-pull event</li>
            <li>Pin age</li>
          </ul>
          <p className="mt-4 text-xs text-text-tertiary">
            Planned, not released. Scope may change.
          </p>
        </div>
      </div>
    </section>
  );
}
