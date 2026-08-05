import { Card, CardContent } from "@/components/ui/card";
import { PACKAGE } from "@/lib/constants";

export function SocialProof() {
  return (
    <section className="mx-auto max-w-[1200px] px-4 py-20 sm:px-6 xl:px-8">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardContent>
            <p className="text-foreground">
              After trying {PACKAGE.name} in production MCP servers,
              developers praised its silent-failure detection for addressing
              a long-standing gap in MCP observability — something standard
              OpenTelemetry instrumentation doesn&apos;t capture.
            </p>
            <p className="mt-3 text-sm text-muted-foreground">
              Paraphrased from feedback on LinkedIn.
            </p>
          </CardContent>
        </Card>

        <div className="flex flex-col gap-4">
          <Card size="sm">
            <CardContent>
              <p className="text-sm text-foreground">
                Filed and fixed an upstream fastmcp bug related to error
                propagation —{" "}
                <a
                  href={PACKAGE.upstreamIssue}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand hover:underline"
                >
                  fastmcp#4549
                </a>
                .
              </p>
            </CardContent>
          </Card>
          <Card size="sm">
            <CardContent>
              <p className="text-sm text-foreground">
                Discussed by the community on{" "}
                <span className="font-mono text-muted-foreground">
                  r/OpenTelemetry
                </span>
                .
              </p>
            </CardContent>
          </Card>
          <Card size="sm">
            <CardContent className="flex flex-col gap-3">
              <ul className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs tracking-wide text-text-tertiary uppercase">
                <li>
                  <span className="text-brand">1,000+</span> total downloads
                </li>
                <li aria-hidden="true">·</li>
                <li>
                  <span className="text-brand">{PACKAGE.testCount}</span>{" "}
                  tests
                </li>
                <li aria-hidden="true">·</li>
                <li>
                  <span className="text-brand">{PACKAGE.license}</span>{" "}
                  licensed
                </li>
              </ul>
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm text-muted-foreground">
                  npm downloads (weekly)
                </span>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`https://img.shields.io/npm/dw/${PACKAGE.name}?style=flat-square&label=&color=8B7FD8`}
                  alt={`Weekly npm downloads for ${PACKAGE.name}`}
                  height={20}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
