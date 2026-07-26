import { cn } from "@/lib/utils";

export function CodeSnippet({
  children,
  className,
}: {
  children: string;
  className?: string;
}) {
  return (
    <pre
      className={cn(
        "overflow-x-auto rounded-lg border border-border bg-surface p-4 font-mono text-[13px] leading-relaxed text-foreground",
        className
      )}
    >
      <code>{children}</code>
    </pre>
  );
}
