import { CodeSnippet } from "@/components/landing/CodeSnippet";
import { PACKAGE } from "@/lib/constants";

const STEPS = [
  {
    number: "01",
    title: "Install",
    description: `Add ${PACKAGE.name} alongside your existing OpenTelemetry SDK setup.`,
    code: `pnpm add ${PACKAGE.name}`,
  },
  {
    number: "02",
    title: "Instrument your server",
    description:
      "Wrap your MCP server once — every tool, resource, and prompt call gets a span automatically.",
    code: `import { instrumentMcpServer } from "${PACKAGE.name}";

instrumentMcpServer(server);`,
  },
  {
    number: "03",
    title: "See silent failures in your traces",
    description:
      "Tool calls with isError: true now show up as ERROR spans with a stable fingerprint, in any OTel-compatible backend.",
    code: `span: tools/call query_database
status: ERROR
fingerprint: a1b2c3d4e5f6a7b8`,
  },
] as const;

export function HowItWorks() {
  return (
    <section className="mx-auto max-w-[1200px] px-4 py-20 sm:px-6 xl:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          How it works
        </h2>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-3">
        {STEPS.map((step) => (
          <div key={step.number}>
            <span className="font-mono text-sm text-brand">
              {step.number}
            </span>
            <h3 className="mt-2 text-lg font-semibold text-foreground">
              {step.title}
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              {step.description}
            </p>
            <CodeSnippet className="mt-4">{step.code}</CodeSnippet>
          </div>
        ))}
      </div>
    </section>
  );
}
