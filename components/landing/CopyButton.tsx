"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function CopyButton({
  value,
  className,
}: {
  value: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-sm"
      aria-label="Copy to clipboard"
      className={cn("shrink-0", className)}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value);
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        } catch {
          // Clipboard permission denied or unavailable — nothing to recover.
        }
      }}
    >
      {copied ? (
        <Check className="text-brand-teal" aria-hidden="true" />
      ) : (
        <Copy aria-hidden="true" />
      )}
    </Button>
  );
}
