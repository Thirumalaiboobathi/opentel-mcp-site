import type { MetadataRoute } from "next";

import { blog, docs } from "@/.velite";
import { SITE } from "@/lib/constants";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE.url, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE.url}/docs`, changeFrequency: "weekly", priority: 0.9 },
  ];

  const docRoutes: MetadataRoute.Sitemap = docs.map((doc) => ({
    url: `${SITE.url}${doc.permalink}`,
    lastModified: doc.dateModified,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const blogRoutes: MetadataRoute.Sitemap = blog.map((post) => ({
    url: `${SITE.url}${post.permalink}`,
    lastModified: post.dateModified,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  // Additional static routes (faq, comparison, changelog, about, blog index)
  // are added here as their pages ship in later phases.
  return [...staticRoutes, ...docRoutes, ...blogRoutes];
}
