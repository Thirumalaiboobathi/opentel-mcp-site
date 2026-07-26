// Generates public output/llms-full.txt (written directly into out/,
// overwriting whatever `next build` copied from public/) from real
// content: raw MDX source for docs/blog, hand-parsed FAQ frontmatter,
// and the built HTML for the three pages that have no MDX source
// (comparison, changelog, about — plain TSX/React, not Velite content).
//
// Runs as a post-build step (see package.json's `build` script) because
// the TSX-page extraction reads from `out/**/index.html`, which only
// exists after `next build` has run.

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const SITE_URL = "https://opentel-mcp.dev";

function readMdxBody(relPath) {
  const raw = readFileSync(path.join(ROOT, relPath), "utf8");
  const frontmatterMatch = raw.match(/^---\n([\s\S]*?)\n---\n?/);
  const frontmatter = frontmatterMatch ? frontmatterMatch[1] : "";
  let body = frontmatterMatch ? raw.slice(frontmatterMatch[0].length) : raw;

  // Strip Callout JSX, keeping its text as a bold-prefixed line.
  body = body.replace(
    /<Callout\s+variant="(\w+)"\s+title="([^"]+)">/g,
    "> **$2**\n>"
  );
  body = body.replace(/<\/Callout>/g, "");
  // Strip any stray MDX comments.
  body = body.replace(/\{\/\*[\s\S]*?\*\/\}/g, "");

  return { frontmatter, body: body.trim() };
}

function parseFaqItems(relPath) {
  const raw = readFileSync(path.join(ROOT, relPath), "utf8");
  const items = [];
  const re = /-\s*question:\s*"(.*?)"\s*\n\s*answer:\s*"(.*?)"/g;
  let m;
  while ((m = re.exec(raw))) {
    items.push({ question: m[1], answer: m[2] });
  }
  return items;
}

// Extracts the inner HTML of the first element whose class attribute
// contains `className`, using proper nesting depth (a naive regex would
// stop at the first nested </div>, not the matching one).
function extractByClass(html, tagName, className) {
  const openRe = new RegExp(`<${tagName}\\b[^>]*class="[^"]*\\b${className}\\b[^"]*"[^>]*>`);
  const openMatch = html.match(openRe);
  if (!openMatch) return null;

  const start = openMatch.index + openMatch[0].length;
  const tagRe = new RegExp(`<${tagName}\\b[^>]*>|</${tagName}>`, "g");
  tagRe.lastIndex = start;

  let depth = 1;
  let m;
  while ((m = tagRe.exec(html))) {
    if (m[0].startsWith("</")) {
      depth--;
      if (depth === 0) return html.slice(start, m.index);
    } else {
      depth++;
    }
  }
  return html.slice(start);
}

function htmlToText(html) {
  // Scope to the page's real prose content, skipping header/footer/sidebar
  // nav chrome that's present in the static HTML regardless of the CSS
  // that hides it at certain breakpoints.
  const prose = extractByClass(html, "div", "prose-content");
  const mainMatch = html.match(/<main[^>]*>([\s\S]*?)<\/main>/);
  let content = prose ?? (mainMatch ? mainMatch[1] : html);

  // Drop script/style/svg blocks entirely.
  content = content.replace(/<(script|style|svg)[\s\S]*?<\/\1>/g, "");

  // Nav-style "<a>Title</a><p>description</p>" pairs (no text between
  // them in the source JSX) -> "Title: description" once stripped.
  content = content.replace(/<\/a>\s*<p[^>]*>/g, "</a>: <p>");

  // Headings -> markdown #. Adjacent inline elements inside a heading
  // (e.g. a version link, a title span, a date span with no separating
  // text in the source JSX) get a space so they don't run together.
  content = content.replace(
    /<h([1-6])[^>]*>([\s\S]*?)<\/h\1>/g,
    (_, level, inner) => {
      const spaced = inner.replace(/(<\/(?:a|span)>)\s*(<(?:a|span)\b)/g, "$1 $2");
      return `\n${"#".repeat(Number(level))} ${stripTags(spaced).trim()}\n`;
    }
  );
  // List items -> "- ".
  content = content.replace(
    /<li[^>]*>([\s\S]*?)<\/li>/g,
    (_, inner) => `- ${stripTags(inner)}\n`
  );
  // Table rows -> pipe-separated line (good enough for text consumption).
  content = content.replace(
    /<tr[^>]*>([\s\S]*?)<\/tr>/g,
    (_, inner) => {
      const cells = [...inner.matchAll(/<t[hd][^>]*>([\s\S]*?)<\/t[hd]>/g)].map(
        (c) => stripTags(c[1]).trim()
      );
      return cells.length ? `| ${cells.join(" | ")} |\n` : "";
    }
  );
  // Paragraphs / divs / sections -> newline-terminated blocks.
  content = content.replace(/<\/(p|div|section|article)>/g, "\n");
  // Line breaks.
  content = content.replace(/<br\s*\/?>/g, "\n");

  content = stripTags(content);
  content = decodeEntities(content);
  // Collapse excess blank lines.
  content = content.replace(/\n{3,}/g, "\n\n").trim();
  return content;
}

function stripTags(html) {
  return html.replace(/<[^>]+>/g, "");
}

function decodeEntities(text) {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&#x27;|&apos;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&mdash;/g, "—")
    .replace(/&ldquo;|&rdquo;/g, '"')
    .replace(/&rsquo;|&lsquo;/g, "'")
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, dec) => String.fromCodePoint(parseInt(dec, 10)));
}

function readPageHtml(route) {
  const filePath = path.join(ROOT, "out", route, "index.html");
  if (!existsSync(filePath)) {
    throw new Error(
      `generate-llms-full: expected built page at out${route}/index.html — run \`next build\` first.`
    );
  }
  return readFileSync(filePath, "utf8");
}

function section(title, url, body) {
  return `---\n\n# ${title}\n\nSource: ${url}\n\n${body}\n`;
}

function main() {
  const parts = [];

  // 1. Flagship + docs, in the curated reading order (not DOCS_NAV order).
  const docsOrder = [
    ["silent-failures", "content/docs/silent-failures.mdx"],
    ["getting-started", "content/docs/getting-started.mdx"],
    ["deep-fingerprinting", "content/docs/deep-fingerprinting.mdx"],
    ["metrics", "content/docs/metrics.mdx"],
    ["api-reference", "content/docs/api-reference.mdx"],
    ["migration", "content/docs/migration.mdx"],
  ];

  const toc = ["# opentel-mcp — full documentation text", ""];
  toc.push("Table of contents:");

  for (const [slug, relPath] of docsOrder) {
    const { frontmatter, body } = readMdxBody(relPath);
    const titleMatch = frontmatter.match(/title:\s*"([^"]+)"/);
    const title = titleMatch ? titleMatch[1] : slug;
    const url = `${SITE_URL}/docs/${slug}`;
    toc.push(`- [${title}](${url})`);
    parts.push(
      section(title, url, `\`\`\`yaml\n${frontmatter}\n\`\`\`\n\n${body}`)
    );
  }

  // 2. Docs overview (TSX, extract from built HTML).
  {
    const title = "Docs overview";
    const url = `${SITE_URL}/docs`;
    toc.push(`- [${title}](${url})`);
    parts.push(section(title, url, htmlToText(readPageHtml("/docs"))));
  }

  // 3. FAQ — regenerated from the source items list, not the compiled HTML.
  {
    const title = "FAQ";
    const url = `${SITE_URL}/faq`;
    toc.push(`- [${title}](${url})`);
    const items = parseFaqItems("content/faq/faq.mdx");
    const body = items
      .map((item) => `## ${item.question}\n\n${item.answer}`)
      .join("\n\n");
    parts.push(section(title, url, body));
  }

  // 4. Comparison, Changelog, About — TSX-only pages, extracted from built HTML.
  for (const [route, title] of [
    ["/comparison", "Comparison"],
    ["/changelog", "Changelog"],
    ["/about", "About"],
  ]) {
    const url = `${SITE_URL}${route}`;
    toc.push(`- [${title}](${url})`);
    parts.push(section(title, url, htmlToText(readPageHtml(route))));
  }

  // 5. Blog seed post.
  {
    const relPath =
      "content/blog/2026-introducing-deep-failure-fingerprinting.mdx";
    const { frontmatter, body } = readMdxBody(relPath);
    const titleMatch = frontmatter.match(/title:\s*"([^"]+)"/);
    const title = titleMatch ? titleMatch[1] : "Blog post";
    const url = `${SITE_URL}/blog/introducing-deep-failure-fingerprinting`;
    toc.push(`- [${title}](${url})`);
    parts.push(
      section(title, url, `\`\`\`yaml\n${frontmatter}\n\`\`\`\n\n${body}`)
    );
  }

  const output = [toc.join("\n"), "", ...parts].join("\n");

  const outPath = path.join(ROOT, "out", "llms-full.txt");
  writeFileSync(outPath, output, "utf8");
  console.log(
    `generate-llms-full: wrote out/llms-full.txt (${(
      output.length / 1024
    ).toFixed(1)} KB, ${parts.length} documents)`
  );
}

main();
