"use client";

import Link from "next/link";
import { Menu, Package } from "lucide-react";

import { GitHubIcon } from "@/components/icons/GitHubIcon";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { NAV_LINKS, PACKAGE, SITE } from "@/lib/constants";

export function MobileNav() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Open menu"
          className="md:hidden"
        >
          <Menu aria-hidden="true" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="flex h-full w-3/4 flex-col">
        <SheetHeader>
          <SheetTitle className="font-mono">{SITE.name}</SheetTitle>
        </SheetHeader>
        <nav
          aria-label="Mobile"
          className="flex flex-1 flex-col gap-1 px-4 pb-4"
        >
          {NAV_LINKS.map((link) => (
            <SheetClose asChild key={link.href}>
              <Link
                href={link.href}
                className="flex min-h-11 items-center rounded-lg px-3 text-base font-medium text-foreground hover:bg-muted"
              >
                {link.label}
              </Link>
            </SheetClose>
          ))}
          <div className="mt-4 flex flex-col gap-1 border-t border-border pt-4">
            <SheetClose asChild>
              <a
                href={PACKAGE.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex min-h-11 items-center gap-2 rounded-lg px-3 text-base font-medium text-foreground hover:bg-muted"
              >
                <GitHubIcon className="size-4" aria-hidden="true" />
                GitHub
              </a>
            </SheetClose>
            <SheetClose asChild>
              <a
                href={PACKAGE.npm}
                target="_blank"
                rel="noopener noreferrer"
                className="flex min-h-11 items-center gap-2 rounded-lg px-3 text-base font-medium text-foreground hover:bg-muted"
              >
                <Package className="size-4" aria-hidden="true" />
                npm
              </a>
            </SheetClose>
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
