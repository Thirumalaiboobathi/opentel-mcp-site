import {
  BellRing,
  Fingerprint,
  KeyRound,
  LayoutDashboard,
  LockKeyhole,
  type LucideIcon,
} from "lucide-react";

import { PACKAGE } from "@/lib/constants";

const ITEMS: { icon: LucideIcon; title: string; text: string }[] = [
  {
    icon: Fingerprint,
    title: "Tool definition integrity",
    text: "SHA-256 hashes plus pinning detect rug-pulls: a tool that changes after you approved it.",
  },
  {
    icon: KeyRound,
    title: "Secret leak detection",
    text: "Opt-in. Reports the type and count of secrets in tool outputs, never the value.",
  },
  {
    icon: LockKeyhole,
    title: "Auth failure counter",
    text: "A metric for rejected credentials across your tool surface.",
  },
  {
    icon: BellRing,
    title: "Sensitive tool audit events",
    text: "Audit events for the tools you mark sensitive, with wildcard matching.",
  },
  {
    icon: LayoutDashboard,
    title: "Security panel",
    text: "Everything above in the dashboard, with the same hash in JS and Python.",
  },
];

export function SecuritySection() {
  return (
    <section className="cv-auto border-y border-border bg-surface">
      <div className="mx-auto grid max-w-[1200px] gap-10 px-4 py-16 sm:px-6 lg:grid-cols-5 xl:px-8">
        <div className="lg:col-span-2">
          <p className="text-sm font-medium text-brand">
            Security observability · v0.18 · Python {PACKAGE.pypiVersion}
          </p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Notice when a tool changes underneath you.
          </h2>
          <p className="mt-4 max-w-[60ch] text-muted-foreground">
            opentel-mcp detects and reports. It never blocks a call or alters a
            result.
          </p>

          <figure
            className="mt-8 rounded-xl border border-border bg-background p-4 font-mono text-xs"
            aria-label="Illustrative example of a pinned hash that no longer matches"
          >
            <div className="flex justify-between gap-3">
              <span className="text-muted-foreground">pinned</span>
              <span className="text-foreground">sha256:9f2c…41ab</span>
            </div>
            <div className="mt-2 flex justify-between gap-3">
              <span className="text-muted-foreground">observed</span>
              <span className="text-danger">sha256:e07d…b390</span>
            </div>
            <div className="mt-3 inline-block rounded bg-danger px-2 py-0.5 font-semibold text-white">
              MISMATCH
            </div>
            <figcaption className="mt-3 text-text-tertiary">
              Illustrative values.
            </figcaption>
          </figure>
        </div>

        <ul className="grid gap-4 sm:grid-cols-2 lg:col-span-3">
          {ITEMS.map((item) => (
            <li
              key={item.title}
              className="rounded-xl border border-border bg-card p-5"
            >
              <item.icon className="size-5 text-brand" aria-hidden="true" />
              <h3 className="mt-3 font-medium text-foreground">{item.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{item.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
