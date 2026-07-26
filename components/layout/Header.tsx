import Link from "next/link";
import { Package } from "lucide-react";

import { GitHubIcon } from "@/components/icons/GitHubIcon";
import { Button } from "@/components/ui/button";
import { MobileNav } from "@/components/layout/MobileNav";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { NAV_LINKS, PACKAGE, SITE } from "@/lib/constants";

export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur-md supports-backdrop-filter:bg-background/60">
      <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="font-mono text-base font-semibold tracking-tight text-foreground"
        >
          {SITE.name}
        </Link>

        <nav aria-label="Primary" className="hidden md:flex md:items-center md:gap-1">
          {NAV_LINKS.map((link) => (
            <Button key={link.href} variant="ghost" size="sm" asChild>
              <Link href={link.href}>{link.label}</Link>
            </Button>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            aria-label="View on GitHub"
            className="hidden md:inline-flex"
            asChild
          >
            <a href={PACKAGE.github} target="_blank" rel="noopener noreferrer">
              <GitHubIcon className="size-4" aria-hidden="true" />
            </a>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            aria-label="View on npm"
            className="hidden md:inline-flex"
            asChild
          >
            <a href={PACKAGE.npm} target="_blank" rel="noopener noreferrer">
              <Package aria-hidden="true" />
            </a>
          </Button>
          <ThemeToggle />
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
