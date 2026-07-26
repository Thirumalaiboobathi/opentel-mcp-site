import type { Metadata } from "next";

import { SITE } from "@/lib/constants";

const TITLE_MAX = 60;
const DESCRIPTION_MAX = 155;

function truncate(value: string, max: number): string {
  if (value.length <= max) return value;
  return `${value.slice(0, max - 1).trimEnd()}…`;
}

export function buildMetadata({
  title,
  description,
  path,
  image,
}: {
  title: string;
  description: string;
  path: string;
  image?: string;
}): Metadata {
  const safeTitle = truncate(title, TITLE_MAX);
  const safeDescription = truncate(description, DESCRIPTION_MAX);
  const url = `${SITE.url}${path}`;

  // Only set an explicit image when one is passed — and only include the
  // `images` key at all in that case. Every route already has a real,
  // dynamically-generated OG image via an opengraph-image.tsx file
  // (root-level, or per-doc under app/docs/[slug]/) that Next.js injects
  // automatically, but only when openGraph.images/twitter.images isn't
  // present on the returned metadata at all — even an explicit `undefined`
  // value still suppresses that automatic fallback, so the key must be
  // omitted entirely, not just emptied.
  const imagesField = image ? { images: [{ url: image }] } : {};

  return {
    title: safeTitle,
    description: safeDescription,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: safeTitle,
      description: safeDescription,
      url,
      siteName: SITE.name,
      type: "website",
      ...imagesField,
    },
    twitter: {
      card: "summary_large_image",
      title: safeTitle,
      description: safeDescription,
      ...imagesField,
    },
  };
}
