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

export function buildSoftwareApplicationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: PACKAGE.name,
    applicationCategory: "DeveloperApplication",
    operatingSystem: PACKAGE.runtime,
    softwareVersion: PACKAGE.version,
    license: `https://opensource.org/licenses/${PACKAGE.license}`,
    downloadUrl: PACKAGE.npm,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    author: {
      "@type": "Person",
      name: AUTHOR.name,
    },
  } as const;
}

export function buildSoftwareSourceCodeSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareSourceCode",
    name: PACKAGE.name,
    codeRepository: PACKAGE.github,
    programmingLanguage: "TypeScript",
    runtimePlatform: PACKAGE.runtime,
    license: `https://opensource.org/licenses/${PACKAGE.license}`,
    author: {
      "@type": "Person",
      name: AUTHOR.name,
    },
  } as const;
}

export function buildTechArticleSchema(params: {
  title: string;
  description: string;
  path: string;
  datePublished: string;
  dateModified: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: params.title,
    description: params.description,
    url: `${SITE.url}${params.path}`,
    datePublished: params.datePublished,
    dateModified: params.dateModified,
    author: {
      "@type": "Person",
      name: AUTHOR.name,
      url: AUTHOR.github,
    },
    publisher: {
      "@type": "Organization",
      name: SITE.name,
      url: SITE.url,
    },
  } as const;
}

export function buildBreadcrumbListSchema(
  items: { name: string; path: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${SITE.url}${item.path}`,
    })),
  } as const;
}

export function buildFAQPageSchema(
  items: { question: string; answer: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  } as const;
}

export function buildHowToSchema(params: {
  name: string;
  description: string;
  steps: { name: string; text: string }[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: params.name,
    description: params.description,
    step: params.steps.map((step) => ({
      "@type": "HowToStep",
      name: step.name,
      text: step.text,
    })),
  } as const;
}

export function buildPersonSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: AUTHOR.name,
    jobTitle: AUTHOR.role,
    address: {
      "@type": "PostalAddress",
      addressLocality: AUTHOR.location,
    },
    url: `${SITE.url}/about`,
    sameAs: [AUTHOR.github, AUTHOR.linkedin, AUTHOR.twitter].filter(
      (url) => !url.endsWith("_URL")
    ),
  } as const;
}

export function buildBlogPostingSchema(params: {
  title: string;
  description: string;
  path: string;
  datePublished: string;
  dateModified: string;
  author?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: params.title,
    description: params.description,
    url: `${SITE.url}${params.path}`,
    datePublished: params.datePublished,
    dateModified: params.dateModified,
    author: {
      "@type": "Person",
      name: params.author ?? AUTHOR.name,
    },
    publisher: {
      "@type": "Organization",
      name: SITE.name,
      url: SITE.url,
    },
  } as const;
}
