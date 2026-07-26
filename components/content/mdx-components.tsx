import Link from "next/link";
import type { MDXComponents } from "mdx/types";
import type { ComponentProps } from "react";

import { Callout } from "@/components/content/Callout";
import { CodeBlock } from "@/components/content/CodeBlock";

function MDXLink(props: ComponentProps<"a">) {
  const { href = "", ...rest } = props;
  const isExternal = /^https?:\/\//.test(href);

  if (isExternal) {
    return <a href={href} target="_blank" rel="noopener noreferrer" {...rest} />;
  }
  return <Link href={href} {...rest} />;
}

export const mdxComponents: MDXComponents = {
  Callout,
  pre: CodeBlock,
  a: MDXLink,
  figcaption: (props: ComponentProps<"figcaption">) => (
    <figcaption
      className="rounded-t-lg border border-b-0 border-border bg-surface-elevated px-4 py-2 font-mono text-xs text-text-tertiary"
      {...props}
    />
  ),
  h2: (props: ComponentProps<"h2">) => (
    <h2 className="mt-10 scroll-mt-24 text-xl font-semibold tracking-tight text-foreground" {...props} />
  ),
  h3: (props: ComponentProps<"h3">) => (
    <h3 className="mt-8 scroll-mt-24 text-lg font-semibold tracking-tight text-foreground" {...props} />
  ),
  p: (props: ComponentProps<"p">) => (
    <p className="mt-4 leading-7 text-muted-foreground" {...props} />
  ),
  ul: (props: ComponentProps<"ul">) => (
    <ul className="mt-4 ml-6 list-disc space-y-2 text-muted-foreground" {...props} />
  ),
  ol: (props: ComponentProps<"ol">) => (
    <ol className="mt-4 ml-6 list-decimal space-y-2 text-muted-foreground" {...props} />
  ),
  blockquote: (props: ComponentProps<"blockquote">) => (
    <blockquote
      className="mt-4 border-l-2 border-border pl-4 text-muted-foreground italic"
      {...props}
    />
  ),
};
