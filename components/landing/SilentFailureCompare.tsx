import { Check, TriangleAlert } from "lucide-react";

const code =
  "rounded bg-muted px-1.5 py-0.5 font-mono text-[0.9em] text-foreground";

function SpanCard({
  tone,
  label,
  status,
  rows,
  note,
}: {
  tone: "ok" | "bad";
  label: string;
  status: string;
  rows: [string, string][];
  note: string;
}) {
  const bad = tone === "bad";
  return (
    <div
      className={`rounded-xl border p-5 ${
        bad
          ? "border-danger/60 bg-danger/5"
          : "border-emerald-600/40 bg-emerald-600/5"
      }`}
    >
      <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
        {label}
      </p>
      <div className="mt-3 flex flex-wrap items-center gap-2 font-mono text-sm text-foreground">
        <span
          className={`inline-flex size-6 items-center justify-center rounded-full text-white ${
            bad ? "bg-danger" : "bg-emerald-700"
          }`}
        >
          {bad ? (
            <TriangleAlert className="size-3.5" aria-hidden="true" />
          ) : (
            <Check className="size-3.5" aria-hidden="true" />
          )}
        </span>
        tools/call search_docs
        <span
          className={`ml-auto rounded px-2 py-0.5 text-xs font-semibold text-white ${
            bad ? "bg-danger" : "bg-emerald-700"
          }`}
        >
          {status}
        </span>
      </div>
      <dl className="mt-4 space-y-1.5 font-mono text-xs">
        {rows.map(([k, v]) => (
          <div key={k} className="flex flex-wrap justify-between gap-x-4">
            <dt className="text-muted-foreground">{k}</dt>
            <dd className="text-foreground">{v}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-4 text-sm text-muted-foreground">{note}</p>
    </div>
  );
}

export function SilentFailureCompare() {
  return (
    <section className="cv-auto mx-auto max-w-[1200px] px-4 py-16 sm:px-6 xl:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          200 OK, but the tool failed.
        </h2>
        <p className="mt-4 text-muted-foreground">
          MCP reports success at the JSON-RPC envelope while the failure sits
          inside <code className={code}>CallToolResult.isError</code>. Same
          call, two traces:
        </p>
      </div>
      <div className="mt-10 grid gap-4 md:grid-cols-2">
        <SpanCard
          tone="ok"
          label="Standard OTel span"
          status="OK"
          rows={[
            ["http.status_code", "200"],
            ["span.status", "UNSET / OK"],
            ["result.isError", "(never inspected)"],
          ]}
          note="Dashboards stay green. The failure is invisible."
        />
        <SpanCard
          tone="bad"
          label="With opentel-mcp"
          status="ERROR"
          rows={[
            ["http.status_code", "200"],
            ["span.status", "ERROR"],
            ["mcp.failure.fingerprint", "stable 16-hex hash"],
          ]}
          note="isError detected, span flagged, identical failures grouped."
        />
      </div>
    </section>
  );
}
