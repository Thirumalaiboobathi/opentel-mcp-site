import type { Metadata } from "next";

import { ComparisonTable } from "@/components/landing/ComparisonTable";
import { CTA } from "@/components/landing/CTA";
import { DownloadsMilestone } from "@/components/landing/DownloadsMilestone";
import { Features } from "@/components/landing/Features";
import { Hero } from "@/components/landing/Hero";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { InstallSection } from "@/components/landing/InstallSection";
import { ProblemStatement } from "@/components/landing/ProblemStatement";
import { SocialProof } from "@/components/landing/SocialProof";
import { TrustBar } from "@/components/landing/TrustBar";
import { JsonLd } from "@/components/seo/JsonLd";
import { faq } from "@/.velite";
import { PACKAGE } from "@/lib/constants";
import { buildMetadata } from "@/lib/metadata";
import {
  buildFAQPageSchema,
  buildHowToSchema,
  buildSoftwareApplicationSchema,
  buildSoftwareSourceCodeSchema,
} from "@/lib/schema";

// A small, representative subset of the real FAQ content (content/faq/faq.mdx)
// — not invented copy — picked to cover the questions most relevant to the
// homepage: what the package is, the silent-failure gap, how it differs from
// raw OpenTelemetry, and Deep Failure Fingerprinting.
const HOMEPAGE_FAQ_QUESTIONS = [
  "What is opentel-mcp?",
  "What is a silent failure in an MCP server?",
  "How does opentel-mcp differ from the standard OpenTelemetry Node.js SDK?",
  "What is Deep Failure Fingerprinting?",
] as const;

const homepageFaqItems = faq.items.filter((item) =>
  (HOMEPAGE_FAQ_QUESTIONS as readonly string[]).includes(item.question)
);

export const metadata: Metadata = buildMetadata({
  title: `${PACKAGE.name} — OpenTelemetry for MCP silent failures`,
  description: `${PACKAGE.name} is a Node.js OpenTelemetry instrumentation library for Model Context Protocol servers. It detects CallToolResult.isError silent failures other libraries miss.`,
  path: "/",
});

export default function Home() {
  return (
    <>
      <JsonLd
        data={[
          buildSoftwareApplicationSchema(),
          buildSoftwareSourceCodeSchema(),
          buildFAQPageSchema(
            homepageFaqItems.map((item) => ({
              question: item.question,
              answer: item.answer,
            }))
          ),
          buildHowToSchema({
            name: "How to instrument an MCP server with opentel-mcp",
            description:
              "Install opentel-mcp, wrap your MCP server with instrumentMcpServer(), and see silent failures show up as ERROR spans.",
            steps: [
              {
                name: "Install",
                text: "Add opentel-mcp alongside your existing OpenTelemetry SDK setup.",
              },
              {
                name: "Instrument your server",
                text: "Wrap your MCP server once — every tools/call gets a span automatically.",
              },
              {
                name: "See silent failures in your traces",
                text: "Tool calls with isError: true show up as ERROR spans with a stable fingerprint, in any OTel-compatible backend.",
              },
            ],
          }),
        ]}
      />
      <Hero />
      <DownloadsMilestone />
      <TrustBar />
      <ProblemStatement />
      <Features />
      <HowItWorks />
      <ComparisonTable />
      <InstallSection />
      <SocialProof />
      <CTA />
    </>
  );
}
