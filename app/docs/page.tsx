import Link from "next/link";
import type { Metadata } from "next";

import { docs } from "@/.velite";
import { Callout } from "@/components/content/Callout";
import { JsonLd } from "@/components/seo/JsonLd";
import { DOCS_NAV, PACKAGE, SITE } from "@/lib/constants";
import { buildMetadata } from "@/lib/metadata";
import { buildBreadcrumbListSchema } from "@/lib/schema";

export const metadata: Metadata = buildMetadata({
  title: `Docs — ${SITE.name}`,
  description:
    "Documentation for opentel-mcp: getting started, silent-failure detection, deep failure fingerprinting, metrics, API reference, and migration guides.",
  path: "/docs",
  image: `${SITE.url}/opengraph-image`,
});

export default function DocsOverviewPage() {
  return (
    <>
      <JsonLd
        data={buildBreadcrumbListSchema([
          { name: "Home", path: "/" },
          { name: "Docs", path: "/docs" },
        ])}
      />
      <div className="prose-content">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
          Documentation
        </h1>
        <p className="mt-4 text-muted-foreground">
          {PACKAGE.name} is a {PACKAGE.runtime} OpenTelemetry
          instrumentation library for Model Context Protocol (MCP)
          servers. These pages cover installing it, what{" "}
          <code className="rounded-md bg-muted px-1.5 py-0.5 font-mono text-[0.9em] text-foreground">
            CallToolResult.isError
          </code>{" "}
          detection actually does, the metrics and fingerprinting it
          emits, and how to migrate from raw {"@opentelemetry/api"}{" "}
          instrumentation.
        </p>

        <Callout variant="tip" title="Where to start">
          New to {PACKAGE.name}? Start with{" "}
          <Link href="/docs/getting-started" className="text-brand hover:underline">
            Getting Started
          </Link>
          . Already have manual OpenTelemetry instrumentation on your MCP
          server? Start with the{" "}
          <Link href="/docs/migration" className="text-brand hover:underline">
            Migration Guide
          </Link>{" "}
          instead.
        </Callout>

        <div className="mt-10 flex flex-col gap-8">
          {DOCS_NAV.map((group) => (
            <div key={group.section}>
              <h2 className="text-lg font-semibold text-foreground">
                {group.section}
              </h2>
              <ul className="mt-3 flex flex-col gap-2">
                {group.items
                  .filter((item) => item.href !== "/docs")
                  .map((item) => {
                    const doc = docs.find((d) => d.permalink === item.href);
                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          className="text-brand hover:underline"
                        >
                          {item.label}
                        </Link>
                        {doc ? (
                          <p className="mt-0.5 text-sm text-muted-foreground">
                            {doc.description}
                          </p>
                        ) : null}
                      </li>
                    );
                  })}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
