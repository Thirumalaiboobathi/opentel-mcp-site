import { PACKAGE } from "@/lib/constants";

const TRUST_ITEMS = [
  "OpenTelemetry",
  "Model Context Protocol",
  PACKAGE.runtime,
  "TypeScript",
  PACKAGE.license + " licensed",
  `${PACKAGE.testCount} tests`,
] as const;

export function TrustBar() {
  return (
    <section className="border-y border-border">
      <div className="mx-auto max-w-[1200px] px-4 py-6 sm:px-6 xl:px-8">
        <ul className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-center">
          {TRUST_ITEMS.map((item) => (
            <li
              key={item}
              className="font-mono text-xs tracking-wide text-text-tertiary uppercase"
            >
              {item}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
