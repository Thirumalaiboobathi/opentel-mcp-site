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
  const ogImage = image ?? `${SITE.url}/og-default.png`;

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
      images: [{ url: ogImage }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: safeTitle,
      description: safeDescription,
      images: [ogImage],
    },
  };
}
