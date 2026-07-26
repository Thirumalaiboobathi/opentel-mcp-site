export const SITE = {
  name: "opentel-mcp",
  domain: "opentel-mcp.dev",
  url: "https://opentel-mcp.dev",
  tagline: "OpenTelemetry for MCP servers that actually catches silent failures.",
  description:
    "opentel-mcp is a Node.js OpenTelemetry instrumentation library for Model Context Protocol servers. It uniquely detects silent failures — CallToolResult.isError=true inside successful JSON-RPC responses — and marks OpenTelemetry spans as ERROR.",
  // Placeholder: this marketing site's own repo (distinct from PACKAGE.github,
  // which is the npm package's repo), used for "Edit this page on GitHub" links.
  repoUrl: "SITE_REPO_URL",
} as const;

export const PACKAGE = {
  name: "opentel-mcp",
  version: "0.4.0",
  license: "MIT",
  runtime: "Node.js 20+",
  testCount: 136,
  npm: "https://www.npmjs.com/package/opentel-mcp",
  github: "https://github.com/Thirumalaiboobathi/opentel-mcp",
  githubIssues: "https://github.com/Thirumalaiboobathi/opentel-mcp/issues",
  upstreamIssue: "https://github.com/PrefectHQ/fastmcp/issues/4549",
  upstreamPR: "https://github.com/PrefectHQ/fastmcp/pull/4587",
} as const;

export const AUTHOR = {
  name: "Thirumalaiboobathi B",
  shortName: "Thiru",
  role: "GenAI & Full Stack Engineer",
  location: "Madurai, Tamil Nadu, India",
  linkedin: "LINKEDIN_URL",
  twitter: "TWITTER_URL",
  github: "https://github.com/Thirumalaiboobathi",
  email: "EMAIL",
} as const;

export const KEYWORDS = [
  "opentel-mcp",
  "MCP OpenTelemetry",
  "MCP observability",
  "Model Context Protocol tracing",
  "MCP silent failures",
  "CallToolResult isError",
  "OpenTelemetry Node.js MCP",
  "MCP metrics",
  "fastmcp instrumentation",
  "MCP server monitoring",
] as const;

export const NAV_LINKS = [
  { href: "/docs", label: "Docs" },
  { href: "/faq", label: "FAQ" },
  { href: "/comparison", label: "Comparison" },
  { href: "/blog", label: "Blog" },
] as const;

export const DOCS_NAV = [
  {
    section: "Introduction",
    items: [
      { href: "/docs", label: "Overview" },
      { href: "/docs/getting-started", label: "Getting Started" },
    ],
  },
  {
    section: "Concepts",
    items: [
      { href: "/docs/silent-failures", label: "Silent Failures" },
      { href: "/docs/deep-fingerprinting", label: "Deep Failure Fingerprinting" },
    ],
  },
  {
    section: "Reference",
    items: [
      { href: "/docs/metrics", label: "Metrics" },
      { href: "/docs/api-reference", label: "API Reference" },
    ],
  },
  {
    section: "Guides",
    items: [{ href: "/docs/migration", label: "Migration Guide" }],
  },
] as const;
