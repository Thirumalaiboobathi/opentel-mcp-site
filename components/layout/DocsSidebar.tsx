"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { DOCS_NAV } from "@/lib/constants";

export function DocsSidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <nav aria-label="Docs" className="flex flex-col gap-6">
      {DOCS_NAV.map((group) => (
        <div key={group.section}>
          <p className="text-xs font-semibold tracking-wide text-text-tertiary uppercase">
            {group.section}
          </p>
          <ul className="mt-3 flex flex-col gap-1">
            {group.items.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onNavigate}
                    aria-current={isActive ? "page" : undefined}
                    className={cn(
                      "block min-h-9 rounded-lg px-3 py-1.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground",
                      isActive && "bg-muted font-medium text-foreground"
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}

export function DocsSidebar() {
  return (
    <aside className="hidden shrink-0 lg:block lg:w-56 xl:w-64">
      <div className="sticky top-24">
        <DocsSidebarNav />
      </div>
    </aside>
  );
}
