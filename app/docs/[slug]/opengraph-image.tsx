import { ImageResponse } from "next/og";

import { docs } from "@/.velite";
import { PACKAGE, SITE } from "@/lib/constants";

export const dynamic = "force-static";
export const alt = "Doc page";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return docs.map((doc) => ({ slug: doc.slug }));
}

export default async function DocOpengraphImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const doc = docs.find((d) => d.slug === slug);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px",
          backgroundColor: "#0a0a0b",
          backgroundImage:
            "radial-gradient(rgba(245,245,247,0.12) 1.5px, transparent 1.5px)",
          backgroundSize: "28px 28px",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 24,
            color: "#8b7fd8",
            fontFamily: "monospace",
          }}
        >
          {PACKAGE.name} / docs
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 52,
            fontWeight: 600,
            color: "#f5f5f7",
            lineHeight: 1.15,
            letterSpacing: "-0.02em",
          }}
        >
          {doc?.title ?? SITE.name}
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 20,
            color: "#71717a",
            fontFamily: "monospace",
          }}
        >
          {SITE.domain}
        </div>
      </div>
    ),
    { ...size }
  );
}
