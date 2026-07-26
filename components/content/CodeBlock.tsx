"use client";

import { isValidElement, type ReactNode } from "react";

import { CopyButton } from "@/components/landing/CopyButton";
import { cn } from "@/lib/utils";

function extractText(node: ReactNode): string {
  if (node == null || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(extractText).join("");
  if (isValidElement<{ children?: ReactNode }>(node)) {
    return extractText(node.props.children);
  }
  return "";
}

function extractLanguage(node: ReactNode): string | undefined {
  if (!isValidElement<Record<string, unknown>>(node)) return undefined;
  const dataLang = node.props["data-language"];
  if (typeof dataLang === "string") return dataLang;
  const className = node.props.className;
  if (typeof className === "string") {
    const match = className.match(/language-(\w+)/);
    if (match) return match[1];
  }
  return undefined;
}

export function CodeBlock({
  children,
  className,
  ...props
}: React.ComponentProps<"pre">) {
  const codeText = extractText(children);
  const language = extractLanguage(children);

  return (
    <div className="group/codeblock relative my-6 overflow-hidden rounded-lg border border-border bg-surface">
      <div className="flex items-center justify-between border-b border-border px-3 py-1.5">
        <span className="font-mono text-xs text-text-tertiary uppercase">
          {language ?? "text"}
        </span>
        <CopyButton value={codeText} />
      </div>
      <pre
        className={cn(
          "overflow-x-auto px-4 py-3 font-mono text-[13px] leading-relaxed",
          className
        )}
        {...props}
      >
        {children}
      </pre>
    </div>
  );
}
