export function ProblemStatement() {
  return (
    <section className="mx-auto max-w-[1200px] px-4 py-20 sm:px-6 xl:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          A tool can fail and your traces will still say it succeeded.
        </h2>
        <p className="mt-4 text-muted-foreground">
          MCP&apos;s JSON-RPC 2.0 transport reports success at the envelope level
          even when the tool itself failed — the failure is nested inside{" "}
          <code className="rounded-md bg-muted px-1.5 py-0.5 font-mono text-[0.9em] text-foreground">
            CallToolResult.isError
          </code>
          . Standard instrumentation only looks at the envelope.
        </p>
      </div>

      <svg
        role="img"
        aria-label="Diagram: a JSON-RPC 2.0 response reporting HTTP 200 success, with an isError true field hidden inside the result that standard instrumentation never inspects."
        viewBox="0 0 640 200"
        className="mx-auto mt-12 h-auto w-full max-w-xl"
      >
        <title>Silent failure inside a successful JSON-RPC envelope</title>
        <rect
          x="8"
          y="8"
          width="624"
          height="184"
          rx="12"
          className="fill-surface stroke-border"
          strokeWidth="1.5"
        />
        <text
          x="28"
          y="36"
          className="fill-brand-teal font-mono text-[13px]"
        >
          JSON-RPC 2.0 response — HTTP 200 OK
        </text>
        <rect
          x="28"
          y="56"
          width="584"
          height="112"
          rx="8"
          className="fill-transparent stroke-danger"
          strokeWidth="1.5"
          strokeDasharray="4 4"
        />
        <text x="48" y="86" className="fill-danger font-mono text-[13px]">
          result.isError = true
        </text>
        <text
          x="48"
          y="112"
          className="fill-text-tertiary font-mono text-xs"
        >
          content: [ &quot;Connection timeout&quot; ]
        </text>
        <text
          x="48"
          y="148"
          className="fill-text-tertiary font-mono text-xs"
        >
          ⚠ never inspected by standard OTel instrumentation
        </text>
      </svg>
    </section>
  );
}
