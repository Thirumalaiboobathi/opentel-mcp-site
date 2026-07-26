import { AUTHOR, PACKAGE, SITE } from "@/lib/constants";

export function buildOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE.name,
    url: SITE.url,
    logo: `${SITE.url}/og-default.png`,
    sameAs: [PACKAGE.github, PACKAGE.npm],
    founder: {
      "@type": "Person",
      name: AUTHOR.name,
    },
  } as const;
}

export function buildWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE.name,
    url: SITE.url,
    description: SITE.description,
    inLanguage: "en",
  } as const;
}
