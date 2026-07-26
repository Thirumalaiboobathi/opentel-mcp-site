"use client";

import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

interface TocEntry {
  title: string;
  url: string;
  items: TocEntry[];
}

function flattenIds(entries: TocEntry[]): string[] {
  return entries.flatMap((entry) => [
    entry.url.replace(/^#/, ""),
    ...flattenIds(entry.items),
  ]);
}

function TocList({
  entries,
  activeId,
}: {
  entries: TocEntry[];
  activeId: string | null;
}) {
  if (entries.length === 0) return null;

  return (
    <ul className="space-y-2">
      {entries.map((entry) => {
        const id = entry.url.replace(/^#/, "");
        const isActive = id === activeId;
        return (
          <li key={entry.url}>
            <a
              href={entry.url}
              className={cn(
                "block text-sm text-muted-foreground transition-colors hover:text-foreground",
                isActive && "font-medium text-brand"
              )}
            >
              {entry.title}
            </a>
            {entry.items.length > 0 && (
              <div className="mt-2 ml-3 border-l border-border pl-3">
                <TocList entries={entry.items} activeId={activeId} />
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}

export function TableOfContents({ toc }: { toc: TocEntry[] }) {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const ids = flattenIds(toc);
    if (ids.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((entry) => entry.isIntersecting);
        if (visible) setActiveId(visible.target.id);
      },
      { rootMargin: "-96px 0px -70% 0px" }
    );

    for (const id of ids) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, [toc]);

  if (toc.length === 0) return null;

  return (
    <nav aria-label="On this page" className="text-sm">
      <p className="mb-4 font-medium text-foreground">On this page</p>
      <TocList entries={toc} activeId={activeId} />
    </nav>
  );
}
