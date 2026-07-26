import Link from "next/link";

import { AUTHOR, PACKAGE, SITE } from "@/lib/constants";

const FOOTER_COLUMNS = [
  {
    heading: "Product",
    links: [
      { href: "/", label: "Home" },
      { href: "/comparison", label: "Comparison" },
      { href: "/changelog", label: "Changelog" },
      { href: "/faq", label: "FAQ" },
    ],
  },
  {
    heading: "Docs",
    links: [
      { href: "/docs", label: "Overview" },
      { href: "/docs/getting-started", label: "Getting Started" },
      { href: "/docs/silent-failures", label: "Silent Failures" },
      { href: "/docs/api-reference", label: "API Reference" },
    ],
  },
  {
    heading: "Community",
    links: [
      { href: PACKAGE.github, label: "GitHub", external: true },
      { href: PACKAGE.githubIssues, label: "Issues", external: true },
      { href: PACKAGE.npm, label: "npm", external: true },
      { href: "/blog", label: "Blog" },
    ],
  },
  {
    heading: "Author",
    links: [
      { href: "/about", label: `${AUTHOR.shortName} — ${AUTHOR.role}` },
      { href: AUTHOR.github, label: "GitHub", external: true },
      { href: AUTHOR.linkedin, label: "LinkedIn", external: true },
      { href: `mailto:${AUTHOR.email}`, label: "Email", external: true },
    ],
  },
] as const;

export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto max-w-[1200px] px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {FOOTER_COLUMNS.map((column) => (
            <div key={column.heading}>
              <h2 className="text-sm font-semibold text-foreground">
                {column.heading}
              </h2>
              <ul className="mt-4 flex flex-col gap-3">
                {column.links.map((link) => {
                  const isMailto = link.href.startsWith("mailto:");
                  if (isMailto) {
                    return (
                      <li key={link.label}>
                        <a
                          href={link.href}
                          rel="noopener"
                          className="text-sm text-muted-foreground hover:text-foreground"
                        >
                          {link.label}
                        </a>
                      </li>
                    );
                  }
                  return "external" in link && link.external ? (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-muted-foreground hover:text-foreground"
                      >
                        {link.label}
                      </a>
                    </li>
                  ) : (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-sm text-muted-foreground hover:text-foreground"
                      >
                        {link.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-border pt-6 text-xs text-text-tertiary sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {new Date().getFullYear()} {SITE.name}. {PACKAGE.license}{" "}
            licensed.
          </p>
          <p>Cookie-less analytics via Plausible.</p>
        </div>
      </div>
    </footer>
  );
}
