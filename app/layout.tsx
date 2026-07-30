import type { Metadata } from "next";
import localFont from "next/font/local";
import Script from "next/script";
import "./globals.css";

import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { JsonLd } from "@/components/seo/JsonLd";
import { SITE } from "@/lib/constants";
import { buildMetadata } from "@/lib/metadata";
import { buildOrganizationSchema, buildWebSiteSchema } from "@/lib/schema";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff2",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff2",
  variable: "--font-geist-mono",
  weight: "100 900",
});

// Fallback metadata for any route that doesn't set its own (e.g. the
// generated 404 page). Every real page calls buildMetadata() directly
// with its own final title — no title template here, since one page's
// title already includes "opentel-mcp" in context-appropriate form;
// templating would append it a second time.
export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  ...buildMetadata({
    title: `${SITE.name} — OpenTelemetry for MCP silent failures`,
    description: SITE.description,
    path: "/",
    image: `${SITE.url}/opengraph-image`,
  }),
  other: {
    "google-site-verification": "google92f180131040636b",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <JsonLd data={[buildOrganizationSchema(), buildWebSiteSchema()]} />
        <Script
          defer
          data-domain={SITE.domain}
          src="https://plausible.io/js/script.js"
          strategy="afterInteractive"
        />
      </head>
      <body className="min-h-full flex flex-col">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <a
            href="#main-content"
            className="sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:top-4 focus-visible:left-4 focus-visible:z-50 focus-visible:rounded-lg focus-visible:bg-primary focus-visible:px-4 focus-visible:py-2 focus-visible:text-primary-foreground"
          >
            Skip to content
          </a>
          <Header />
          <main id="main-content" className="flex flex-1 flex-col">
            {children}
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
