export const SITE = {
  name: "opentel-mcp",
  domain: "opentel-mcp-site.pages.dev",
  url: "https://opentel-mcp-site.pages.dev",
  tagline: "Catch MCP silent failures and tool tampering — in Node.js and Python.",
  description:
    "opentel-mcp is OpenTelemetry instrumentation for Model Context Protocol servers in Node.js and Python. It detects silent failures (isError inside a 200 OK), tool definition tampering and secret leaks, and marks spans ERROR. It detects, never blocks.",
  // This marketing site's own repo (distinct from PACKAGE.github, which is
  // the npm package's repo), used for "Edit this page on GitHub" links.
  repoUrl: "https://github.com/Thirumalaiboobathi/opentel-mcp-site",
} as const;

export const PACKAGE = {
  name: "opentel-mcp",
  version: "0.18.1",
  uiVersion: "0.4.1",
  pypiVersion: "0.2.0",
  pypi: "https://pypi.org/project/opentel-mcp/",
  npmUi: "https://www.npmjs.com/package/opentel-mcp-ui",
  downloads: "15,000+",
  license: "MIT",
  runtime: "Node.js 20+",
  testCount: 748,
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
  linkedin: "https://www.linkedin.com/in/thirumalaiboobathi-b-902a51233/",
  github: "https://github.com/Thirumalaiboobathi",
  email: "thiru260402@gmail.com",
  awsBuilderCentre: "https://builder.aws.com/community/@thirumalaiboobathi2",
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
      { href: "/docs/cost-tracking", label: "Cost & Token Attribution" },
      { href: "/docs/instance-state", label: "Tracker State Under Stateless HTTP" },
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
