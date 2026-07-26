import Link from "next/link";
import type { Metadata } from "next";

import { GitHubIcon } from "@/components/icons/GitHubIcon";
import { JsonLd } from "@/components/seo/JsonLd";
import { AUTHOR, PACKAGE, SITE } from "@/lib/constants";
import { buildMetadata } from "@/lib/metadata";
import { buildBreadcrumbListSchema, buildPersonSchema } from "@/lib/schema";

const PATH = "/about";

export const metadata: Metadata = buildMetadata({
  title: `About — ${SITE.name}`,
  description: `${AUTHOR.name} — ${AUTHOR.role} in ${AUTHOR.location}, author of ${PACKAGE.name}.`,
  path: PATH,
  image: `${SITE.url}/opengraph-image`,
});

export default function AboutPage() {
  return (
    <>
      <JsonLd
        data={[
          buildPersonSchema(),
          buildBreadcrumbListSchema([
            { name: "Home", path: "/" },
            { name: "About", path: PATH },
          ]),
        ]}
      />
      <div className="mx-auto w-full max-w-[1200px] flex-1 px-4 py-16 sm:px-6 xl:px-8">
        <div className="prose-content">
          <div className="flex items-center gap-4">
            <div
              aria-hidden="true"
              className="flex size-16 shrink-0 items-center justify-center rounded-full bg-muted font-mono text-lg font-semibold text-foreground"
            >
              TB
            </div>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                {AUTHOR.name}
              </h1>
              <p className="text-muted-foreground">
                {AUTHOR.role} — {AUTHOR.location}
              </p>
            </div>
          </div>
          {/* Photo placeholder — a real headshot replaces the initials
              avatar above in a later asset pass. */}

          <p className="mt-8 text-muted-foreground">
            {AUTHOR.shortName} is the author of{" "}
            <a
              href={PACKAGE.npm}
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand hover:underline"
            >
              {PACKAGE.name}
            </a>
            , an OpenTelemetry instrumentation library for Model Context
            Protocol (MCP) servers. Outside of that,{" "}
            {AUTHOR.shortName} is Builder Circle Owner for the AWS User
            Group Madurai and a member of the Madurai AI Community, and
            has the AWS Certified AI Practitioner (AIF-C01) exam in
            progress.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight text-foreground">
            Background
          </h2>
          <p className="mt-4 text-muted-foreground">
            {AUTHOR.shortName} studied Computer Science and Engineering at
            Mepco Schlenk Engineering College, and works as a{" "}
            {AUTHOR.role}. {PACKAGE.name} grew out of hitting the same
            problem repeatedly while building MCP tooling: a tool call can
            report success at the JSON-RPC level while failing at the tool
            level, and nothing in standard OpenTelemetry instrumentation
            was set up to catch that — see{" "}
            <Link href="/docs/silent-failures" className="text-brand hover:underline">
              Silent Failures
            </Link>{" "}
            for the full explanation.
          </p>

          <h2 className="mt-10 text-xl font-semibold tracking-tight text-foreground">
            Where to find {AUTHOR.shortName}
          </h2>
          <ul className="mt-4 flex flex-col gap-3 text-muted-foreground">
            <li className="flex items-center gap-2">
              <GitHubIcon className="size-4 shrink-0" aria-hidden="true" />
              <a
                href={AUTHOR.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand hover:underline"
              >
                GitHub — @Thirumalaiboobathi
              </a>
            </li>
            <li>
              <a
                href={AUTHOR.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand hover:underline"
              >
                LinkedIn
              </a>
            </li>
            <li>
              <a
                href={AUTHOR.awsBuilderCentre}
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand hover:underline"
              >
                AWS Builder Centre
              </a>
            </li>
            <li>
              <a
                href={PACKAGE.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand hover:underline"
              >
                {PACKAGE.name} on GitHub
              </a>
            </li>
            <li>
              <a
                href={PACKAGE.npm}
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand hover:underline"
              >
                {PACKAGE.name} on npm
              </a>
            </li>
          </ul>

          <h2 className="mt-10 text-xl font-semibold tracking-tight text-foreground">
            Get in touch
          </h2>
          <p className="mt-4 text-muted-foreground">
            <a
              href={`mailto:${AUTHOR.email}`}
              rel="noopener"
              className="text-brand hover:underline"
            >
              {AUTHOR.email}
            </a>
            . LinkedIn is generally the faster way to reach{" "}
            {AUTHOR.shortName}.
          </p>
        </div>
      </div>
    </>
  );
}
