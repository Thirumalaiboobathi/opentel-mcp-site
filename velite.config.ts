import { defineConfig, defineCollection, s } from "velite";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrettyCode from "rehype-pretty-code";

const docs = defineCollection({
  name: "Doc",
  pattern: "docs/*.mdx",
  schema: s
    .object({
      slug: s.slug("docs"),
      title: s.string().max(99),
      description: s.string().max(180),
      section: s.enum(["Introduction", "Concepts", "Reference", "Guides"]),
      order: s.number().default(0),
      datePublished: s.isodate(),
      dateModified: s.isodate(),
      author: s.string().default("Thirumalaiboobathi B"),
      toc: s.toc(),
      content: s.mdx(),
    })
    .transform((data) => ({ ...data, permalink: `/docs/${data.slug}` })),
});

const blog = defineCollection({
  name: "Post",
  pattern: "blog/*.mdx",
  schema: s
    .object({
      slug: s.slug("blog"),
      title: s.string().max(99),
      description: s.string().max(180),
      datePublished: s.isodate(),
      dateModified: s.isodate(),
      author: s.string().default("Thirumalaiboobathi B"),
      tags: s.array(s.string()).default([]),
      toc: s.toc(),
      content: s.mdx(),
    })
    .transform((data) => ({ ...data, permalink: `/blog/${data.slug}` })),
});

const faq = defineCollection({
  name: "Faq",
  pattern: "faq/faq.mdx",
  single: true,
  schema: s.object({
    items: s.array(
      s.object({
        question: s.string(),
        answer: s.markdown(),
      })
    ),
  }),
});

export default defineConfig({
  root: "content",
  collections: { docs, blog, faq },
  mdx: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [
      rehypeSlug,
      [rehypeAutolinkHeadings, { behavior: "wrap" }],
      [rehypePrettyCode, { theme: "github-dark", keepBackground: true }],
    ],
  },
  markdown: {
    remarkPlugins: [remarkGfm],
  },
});
