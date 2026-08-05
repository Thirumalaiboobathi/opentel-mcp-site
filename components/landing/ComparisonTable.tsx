import Link from "next/link";
import { Check, Minus, X } from "lucide-react";

import { PACKAGE } from "@/lib/constants";

type Cell = "yes" | "no" | "unverified" | "na";

const ROWS: { label: string; cells: [Cell, Cell] }[] = [
  { label: "Instruments tools/call automatically", cells: ["yes", "no"] },
  { label: "Detects isError: true inside a successful response", cells: ["yes", "no"] },
  { label: "Deep failure fingerprinting", cells: ["yes", "no"] },
  { label: "Built-in mcp.tool.* metrics instruments", cells: ["yes", "no"] },
  { label: "LLM cost tracking on tool calls", cells: ["yes", "no"] },
  { label: "Detects an agent retrying the same failure repeatedly", cells: ["yes", "no"] },
  { label: "Detects a tool's input schema changing between observations", cells: ["yes", "no"] },
  { label: "Cardinality-safe metric attributes, structurally enforced", cells: ["yes", "na"] },
  { label: "Never throws into the instrumented handler", cells: ["yes", "unverified"] },
  { label: "Requires manual span code per handler", cells: ["no", "yes"] },
];

const COLUMNS = [PACKAGE.name, "@opentelemetry/api (raw)"] as const;

function CellIcon({ value }: { value: Cell }) {
  if (value === "yes") {
    return (
      <Check className="mx-auto size-4 text-brand-teal" aria-label="Yes" />
    );
  }
  if (value === "no") {
    return <X className="mx-auto size-4 text-danger" aria-label="No" />;
  }
  if (value === "na") {
    return (
      <Minus
        className="mx-auto size-4 text-text-tertiary"
        aria-label="Not applicable"
      />
    );
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
        <table className="w-full min-w-[480px] border-collapse text-sm">
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
        Raw <code>@opentelemetry/api</code> has no concept of MCP or{" "}
        <code>CallToolResult</code> — that&apos;s true by definition, not a
        knock against it. See the{" "}
        <Link href="/comparison" className="text-brand hover:underline">
          full comparison page
        </Link>{" "}
        for the reasoning behind every row, including why fastmcp and
        mcp-tracer aren&apos;t columns here.
      </p>
    </section>
  );
}
