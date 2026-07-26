import { ImageResponse } from "next/og";

import { PACKAGE, SITE } from "@/lib/constants";

export const dynamic = "force-static";
export const alt = SITE.tagline;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
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
            alignItems: "center",
            gap: "12px",
            fontSize: 28,
            color: "#8b7fd8",
            fontFamily: "monospace",
          }}
        >
          {PACKAGE.name}
          <div
            style={{
              display: "flex",
              fontSize: 16,
              color: "#0a0a0b",
              backgroundColor: "#8b7fd8",
              borderRadius: "9999px",
              padding: "4px 14px",
            }}
          >
            v{PACKAGE.version}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 56,
            fontWeight: 600,
            color: "#f5f5f7",
            lineHeight: 1.15,
            letterSpacing: "-0.02em",
          }}
        >
          {SITE.tagline}
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 22,
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
