import Link from "next/link";
import type { Metadata } from "next";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { JsonLd } from "@/components/seo/JsonLd";
import { faq } from "@/.velite";
import { PACKAGE, SITE } from "@/lib/constants";
import { buildMetadata } from "@/lib/metadata";
import { buildBreadcrumbListSchema, buildFAQPageSchema } from "@/lib/schema";

export const metadata: Metadata = buildMetadata({
  title: `FAQ — ${SITE.name}`,
  description: `${PACKAGE.name} frequently asked questions: silent failures, Deep Failure Fingerprinting, metrics, framework compatibility, and more.`,
  path: "/faq",
});

export default function FaqPage() {
  return (
    <>
      <JsonLd
        data={[
          buildFAQPageSchema(
            faq.items.map((item) => ({
              question: item.question,
              answer: item.answer,
            }))
          ),
          buildBreadcrumbListSchema([
            { name: "Home", path: "/" },
            { name: "FAQ", path: "/faq" },
          ]),
        ]}
      />
      <div className="mx-auto w-full max-w-[1200px] flex-1 px-4 py-16 sm:px-6 xl:px-8">
        <div className="mx-auto max-w-2xl">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">
            Frequently asked questions
          </h1>
          <p className="mt-4 text-muted-foreground">
            Questions developers ask most about {PACKAGE.name} — silent
            failures, Deep Failure Fingerprinting, metrics, and framework
            compatibility. For anything not covered here, see the{" "}
            <Link href="/docs" className="text-brand hover:underline">
              docs
            </Link>
            .
          </p>

          <Accordion type="single" collapsible className="mt-10">
            {faq.items.map((item, i) => (
              <AccordionItem key={i} value={`item-${i}`}>
                <AccordionTrigger>{item.question}</AccordionTrigger>
                <AccordionContent>
                  <div
                    className="prose-content [&_a]:text-brand [&_code]:rounded-md [&_code]:bg-muted [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[0.9em] [&_code]:text-foreground"
                    dangerouslySetInnerHTML={{ __html: item.answer }}
                  />
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </>
  );
}
