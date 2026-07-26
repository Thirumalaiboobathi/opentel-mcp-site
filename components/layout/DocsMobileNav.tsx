"use client";

import { useState } from "react";
import { PanelLeft } from "lucide-react";

import { DocsSidebarNav } from "@/components/layout/DocsSidebar";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export function DocsMobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="lg:hidden">
          <PanelLeft aria-hidden="true" />
          Docs menu
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-3/4">
        <SheetHeader>
          <SheetTitle>Docs</SheetTitle>
        </SheetHeader>
        <div className="overflow-y-auto px-4 pb-4">
          <DocsSidebarNav onNavigate={() => setOpen(false)} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
