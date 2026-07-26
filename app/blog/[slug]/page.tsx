import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { blog } from "@/.velite";
import { JsonLd } from "@/components/seo/JsonLd";
import { SITE } from "@/lib/constants";
import { renderMDX } from "@/lib/mdx";
import { buildMetadata } from "@/lib/metadata";
import { buildBlogPostingSchema, buildBreadcrumbListSchema } from "@/lib/schema";
import { formatDate } from "@/lib/utils";

export function generateStaticParams() {
  return blog.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = blog.find((p) => p.slug === slug);
  if (!post) return {};

  return buildMetadata({
    title: post.title,
    description: post.description,
    path: post.permalink,
    image: `${SITE.url}/opengraph-image`,
  });
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = blog.find((p) => p.slug === slug);
  if (!post) notFound();

  const content = await renderMDX(post.content);

  return (
    <>
      <JsonLd
        data={[
          buildBlogPostingSchema({
            title: post.title,
            description: post.description,
            path: post.permalink,
            datePublished: post.datePublished,
            dateModified: post.dateModified,
            author: post.author,
          }),
          buildBreadcrumbListSchema([
            { name: "Home", path: "/" },
            { name: "Blog", path: "/blog" },
            { name: post.title, path: post.permalink },
          ]),
        ]}
      />
      <article className="mx-auto w-full max-w-[1200px] flex-1 px-4 py-16 sm:px-6 xl:px-8">
        <div className="prose-content">
          <nav aria-label="Breadcrumb" className="text-sm text-text-tertiary">
            <Link href="/blog" className="hover:text-foreground">
              Blog
            </Link>
            <span className="mx-1.5">/</span>
            <span className="text-muted-foreground">{post.title}</span>
          </nav>

          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-foreground">
            {post.title}
          </h1>
          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-text-tertiary">
            <span>By {post.author}</span>
            <span>{formatDate(post.datePublished)}</span>
            <span className="flex gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-muted px-2 py-0.5 font-mono text-xs text-muted-foreground"
                >
                  {tag}
                </span>
              ))}
            </span>
          </div>

          <div className="mt-8">{content}</div>
        </div>
      </article>
    </>
  );
}
