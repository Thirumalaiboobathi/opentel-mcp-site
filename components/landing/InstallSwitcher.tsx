"use client";

import { CopyButton } from "@/components/landing/CopyButton";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { PACKAGE } from "@/lib/constants";

const OPTIONS = [
  { id: "npm", label: "npm", command: `npm i ${PACKAGE.name}` },
  { id: "pip", label: "pip", command: `pip install ${PACKAGE.name}` },
] as const;

export function InstallSwitcher() {
  return (
    <Tabs defaultValue="npm" className="max-w-md">
      <TabsList aria-label="Package manager">
        {OPTIONS.map((o) => (
          <TabsTrigger key={o.id} value={o.id}>
            {o.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {OPTIONS.map((o) => (
        <TabsContent key={o.id} value={o.id}>
          <div className="flex items-center justify-between gap-3 rounded-lg border border-border bg-surface px-4 py-3 font-mono text-sm">
            <code className="overflow-x-auto text-foreground">{o.command}</code>
            <CopyButton value={o.command} />
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
}
