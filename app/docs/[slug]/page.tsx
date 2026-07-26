import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { docs } from "@/.velite";
import { TableOfContents } from "@/components/content/TableOfContents";
import { JsonLd } from "@/components/seo/JsonLd";
import { SITE } from "@/lib/constants";
import { renderMDX } from "@/lib/mdx";
import { buildMetadata } from "@/lib/metadata";
import {
  buildBreadcrumbListSchema,
  buildTechArticleSchema,
} from "@/lib/schema";
import { formatDate } from "@/lib/utils";

export function generateStaticParams() {
  return docs.map((doc) => ({ slug: doc.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const doc = docs.find((d) => d.slug === slug);
  if (!doc) return {};

  return buildMetadata({
    title: `${doc.title} — ${SITE.name} Docs`,
    description: doc.description,
    path: doc.permalink,
  });
}

export default async function DocPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const doc = docs.find((d) => d.slug === slug);
  if (!doc) notFound();

  const content = await renderMDX(doc.content);
  const editUrl = `${SITE.repoUrl}/edit/main/content/docs/${doc.slug}.mdx`;

  return (
    <>
      <JsonLd
        data={[
          buildTechArticleSchema({
            title: doc.title,
            description: doc.description,
            path: doc.permalink,
            datePublished: doc.datePublished,
            dateModified: doc.dateModified,
          }),
          buildBreadcrumbListSchema([
            { name: "Home", path: "/" },
            { name: "Docs", path: "/docs" },
            { name: doc.title, path: doc.permalink },
          ]),
        ]}
      />
      <div className="xl:grid xl:grid-cols-[1fr_240px] xl:gap-12">
        <article className="prose-content min-w-0">
          <nav aria-label="Breadcrumb" className="text-sm text-text-tertiary">
            <Link href="/docs" className="hover:text-foreground">
              Docs
            </Link>
            <span className="mx-1.5">/</span>
            <span className="text-muted-foreground">{doc.title}</span>
          </nav>

          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-foreground">
            {doc.title}
          </h1>
          <p className="mt-3 text-lg text-muted-foreground">
            {doc.description}
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-text-tertiary">
            <span>By {doc.author}</span>
            <span>Last updated: {formatDate(doc.dateModified)}</span>
            <a
              href={editUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand hover:underline"
            >
              Edit this page on GitHub
            </a>
          </div>

          <div className="mt-8">{content}</div>
        </article>

        <aside className="hidden xl:block">
          <div className="sticky top-24">
            <TableOfContents toc={doc.toc} />
          </div>
        </aside>
      </div>
    </>
  );
}
