"use client";

import { CopyButton } from "@/components/landing/CopyButton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PACKAGE } from "@/lib/constants";

const MANAGERS = [
  { id: "npm", command: `npm install ${PACKAGE.name}` },
  { id: "pnpm", command: `pnpm add ${PACKAGE.name}` },
  { id: "yarn", command: `yarn add ${PACKAGE.name}` },
  { id: "bun", command: `bun add ${PACKAGE.name}` },
  { id: "pip", command: `pip install ${PACKAGE.name}` },
] as const;

const PYTHON_FACTS = [
  "mcp 1.25–2.x, Python 3.10–3.14",
  "Same silent-failure detection as the Node.js package",
  "Error fingerprints identical to JS (shared conformance fixtures)",
  "Same dashboard, via dev mode",
  "0.2.0 adds the security features: tool integrity hashes and pinning, secret leak detection, auth failure counter, sensitive tool audit events",
] as const;

export function InstallSection() {
  return (
    <section className="cv-auto mx-auto max-w-[1200px] px-4 py-16 sm:px-6 xl:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          Install in seconds
        </h2>
        <p className="mt-3 text-muted-foreground">
          npm {PACKAGE.version} · PyPI {PACKAGE.pypiVersion}
        </p>
      </div>

      <Tabs defaultValue="npm" className="mx-auto mt-8 max-w-lg">
        <TabsList className="mx-auto" aria-label="Package manager">
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

      <div className="mx-auto mt-10 max-w-2xl rounded-xl border border-border bg-card p-6">
        <h3 className="font-medium text-foreground">Python support</h3>
        <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm text-muted-foreground">
          {PYTHON_FACTS.map((fact) => (
            <li key={fact}>{fact}</li>
          ))}
        </ul>
        <a
          href={PACKAGE.pypi}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-block text-sm text-brand hover:underline"
        >
          opentel-mcp on PyPI
        </a>
      </div>
    </section>
  );
}
