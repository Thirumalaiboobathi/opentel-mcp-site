import { Check, Minus, X } from "lucide-react";

import { PACKAGE } from "@/lib/constants";

type Cell = "yes" | "no" | "unverified";

const ROWS: { label: string; cells: [Cell, Cell, Cell, Cell] }[] = [
  {
    label: "MCP-aware spans (tools, resources, prompts)",
    cells: ["yes", "no", "yes", "unverified"],
  },
  {
    label: "Detects isError inside a successful response",
    cells: ["yes", "no", "no", "unverified"],
  },
  {
    label: "Deep failure fingerprinting",
    cells: ["yes", "no", "no", "unverified"],
  },
  {
    label: "Built-in metrics instruments",
    cells: ["yes", "no", "no", "unverified"],
  },
  {
    label: "Cardinality-safe metric attributes",
    cells: ["yes", "no", "no", "unverified"],
  },
  {
    label: "Never throws (fail-safe by design)",
    cells: ["yes", "unverified", "unverified", "unverified"],
  },
];

const COLUMNS = [
  PACKAGE.name,
  "@opentelemetry/api (raw)",
  "fastmcp built-in",
  "mcp-tracer",
] as const;

function CellIcon({ value }: { value: Cell }) {
  if (value === "yes") {
    return (
      <Check className="mx-auto size-4 text-brand-teal" aria-label="Yes" />
    );
  }
  if (value === "no") {
    return <X className="mx-auto size-4 text-danger" aria-label="No" />;
  }
  return (
    <Minus
      className="mx-auto size-4 text-text-tertiary"
      aria-label="Unverified"
    />
  );
}

export function ComparisonTable() {
  return (
    <section className="mx-auto max-w-[1200px] px-4 py-20 sm:px-6 xl:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          How {PACKAGE.name} compares
        </h2>
      </div>

      <div className="mt-10 overflow-x-auto rounded-xl border border-border">
        <table className="w-full min-w-[640px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-border bg-surface">
              <th scope="col" className="px-4 py-3 text-left font-medium text-foreground">
                Capability
              </th>
              {COLUMNS.map((col) => (
                <th
                  key={col}
                  scope="col"
                  className="px-4 py-3 text-center font-mono font-medium text-foreground"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ROWS.map((row) => (
              <tr key={row.label} className="border-b border-border last:border-0">
                <th
                  scope="row"
                  className="px-4 py-3 text-left font-normal text-muted-foreground"
                >
                  {row.label}
                </th>
                {row.cells.map((cell, i) => (
                  <td key={i} className="px-4 py-3">
                    <CellIcon value={cell} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-xs text-text-tertiary">
        mcp-tracer&apos;s feature set is unverified at time of writing — see the
        full comparison page for methodology and sources.
      </p>
    </section>
  );
}
