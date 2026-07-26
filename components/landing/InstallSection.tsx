"use client";

import { CopyButton } from "@/components/landing/CopyButton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PACKAGE } from "@/lib/constants";

const MANAGERS = [
  { id: "pnpm", command: `pnpm add ${PACKAGE.name}` },
  { id: "npm", command: `npm install ${PACKAGE.name}` },
  { id: "yarn", command: `yarn add ${PACKAGE.name}` },
  { id: "bun", command: `bun add ${PACKAGE.name}` },
] as const;

export function InstallSection() {
  return (
    <section className="mx-auto max-w-[1200px] px-4 py-20 sm:px-6 xl:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          Install in seconds
        </h2>
      </div>

      <Tabs defaultValue="pnpm" className="mx-auto mt-8 max-w-lg">
        <TabsList className="mx-auto">
          {MANAGERS.map((manager) => (
            <TabsTrigger key={manager.id} value={manager.id}>
              {manager.id}
            </TabsTrigger>
          ))}
        </TabsList>
        {MANAGERS.map((manager) => (
          <TabsContent key={manager.id} value={manager.id}>
            <div className="flex items-center justify-between gap-3 rounded-lg border border-border bg-surface px-4 py-3 font-mono text-sm">
              <code className="overflow-x-auto text-foreground">
                {manager.command}
              </code>
              <CopyButton value={manager.command} />
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </section>
  );
}
