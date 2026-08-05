"use client";

import { TrendingUp } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

import { PACKAGE } from "@/lib/constants";

export function DownloadsMilestone() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="relative overflow-hidden border-y border-border bg-gradient-to-b from-brand/10 via-brand/[0.03] to-transparent">
      <div className="mx-auto max-w-2xl px-4 py-14 text-center sm:px-6 sm:py-20 xl:px-8">
        <motion.div
          initial={prefersReducedMotion ? undefined : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <TrendingUp
            className="mx-auto size-6 text-brand"
            aria-hidden="true"
          />
          <p className="mt-4 font-mono text-[clamp(2.75rem,9vw,6rem)] leading-none font-semibold tracking-tight text-brand">
            1,000+
          </p>
          <p className="mt-4 text-lg text-muted-foreground">
            Total npm downloads since launch.
          </p>
          <p className="mt-1 text-sm text-text-tertiary">
            Currently on v{PACKAGE.version}.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
