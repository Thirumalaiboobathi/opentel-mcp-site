import { AlertOctagon, AlertTriangle, Info, Lightbulb } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

const VARIANTS = {
  info: {
    icon: Info,
    className: "border-brand-teal/40 bg-brand-teal/10 text-foreground",
    iconClassName: "text-brand-teal",
  },
  tip: {
    icon: Lightbulb,
    className: "border-brand/40 bg-brand/10 text-foreground",
    iconClassName: "text-brand",
  },
  warning: {
    icon: AlertTriangle,
    className: "border-amber-400/40 bg-amber-400/10 text-foreground",
    iconClassName: "text-amber-400",
  },
  critical: {
    icon: AlertOctagon,
    className: "border-danger/40 bg-danger/10 text-foreground",
    iconClassName: "text-danger",
  },
} as const;

export function Callout({
  variant = "info",
  title,
  children,
}: {
  variant?: keyof typeof VARIANTS;
  title?: string;
  children: ReactNode;
}) {
  const { icon: Icon, className, iconClassName } = VARIANTS[variant];

  return (
    <div
      role="note"
      className={cn(
        "my-6 flex gap-3 rounded-lg border px-4 py-3 text-sm",
        className
      )}
    >
      <Icon
        className={cn("mt-0.5 size-4 shrink-0", iconClassName)}
        aria-hidden="true"
      />
      <div className="[&>p]:m-0 [&>p+p]:mt-2">
        {title ? <p className="font-semibold">{title}</p> : null}
        {children}
      </div>
    </div>
  );
}
