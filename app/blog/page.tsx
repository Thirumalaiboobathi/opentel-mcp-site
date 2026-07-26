import Link from "next/link";
import type { Metadata } from "next";

import { blog } from "@/.velite";
import { JsonLd } from "@/components/seo/JsonLd";
import { PACKAGE, SITE } from "@/lib/constants";
import { buildMetadata } from "@/lib/metadata";
import { buildBreadcrumbListSchema } from "@/lib/schema";
import { formatDate } from "@/lib/utils";

const PATH = "/blog";

export const metadata: Metadata = buildMetadata({
  title: `Blog — ${SITE.name}`,
  description: `Posts about ${PACKAGE.name} development, OpenTelemetry, and MCP observability.`,
  path: PATH,
});

export default function BlogIndexPage() {
  const posts = [...blog].sort((a, b) =>
    b.datePublished.localeCompare(a.datePublished)
  );

  return (
    <>
      <JsonLd
        data={buildBreadcrumbListSchema([
          { name: "Home", path: "/" },
          { name: "Blog", path: PATH },
        ])}
      />
      <div className="mx-auto w-full max-w-[1200px] flex-1 px-4 py-16 sm:px-6 xl:px-8">
        <div className="prose-content">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">
            Blog
          </h1>
          <p className="mt-4 text-muted-foreground">
            Notes on {PACKAGE.name} development, OpenTelemetry, and MCP
            observability.
          </p>

          <div className="mt-10 flex flex-col gap-8">
            {posts.map((post) => (
              <article key={post.slug}>
                <Link
                  href={post.permalink}
                  className="text-lg font-semibold text-foreground hover:text-brand"
                >
                  {post.title}
                </Link>
                <p className="mt-1 text-sm text-text-tertiary">
                  {formatDate(post.datePublished)}
                </p>
                <p className="mt-2 text-muted-foreground">
                  {post.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
