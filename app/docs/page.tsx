import Link from "next/link";
import type { Metadata } from "next";

import { docs } from "@/.velite";
import { JsonLd } from "@/components/seo/JsonLd";
import { DOCS_NAV, SITE } from "@/lib/constants";
import { buildMetadata } from "@/lib/metadata";
import { buildBreadcrumbListSchema } from "@/lib/schema";

export const metadata: Metadata = buildMetadata({
  title: `Docs — ${SITE.name}`,
  description:
    "Documentation for opentel-mcp: getting started, silent-failure detection, deep failure fingerprinting, metrics, API reference, and migration guides.",
  path: "/docs",
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
          Everything you need to instrument an MCP server with{" "}
          {SITE.name} — from a 60-second install to the internals of
          deep failure fingerprinting.
        </p>

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
