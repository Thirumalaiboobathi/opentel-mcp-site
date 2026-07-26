"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

const FRAMES = [
  {
    label: "1. Tool call",
    lines: [
      { text: '{ "method": "tools/call",', tone: "muted" },
      { text: '  "params": { "name": "query_database" } }', tone: "muted" },
    ],
  },
  {
    label: "2. Response — isError: true",
    lines: [
      { text: '{ "result": {', tone: "muted" },
      { text: '  "isError": true,', tone: "danger" },
      { text: '  "content": [{ "text": "Connection timeout" }] } }', tone: "muted" },
    ],
  },
  {
    label: "3. Standard OTel span",
    lines: [
      { text: "span: tools/call query_database", tone: "muted" },
      { text: "status: OK", tone: "teal" },
      { text: "// HTTP 200 — the failure is invisible", tone: "muted" },
    ],
  },
  {
    label: "4. opentel-mcp span",
    lines: [
      { text: "span: tools/call query_database", tone: "muted" },
      { text: "status: ERROR", tone: "danger" },
      { text: "fingerprint: a1b2c3d4e5f6a7b8", tone: "brand" },
    ],
  },
] as const;

const TONE_CLASS: Record<string, string> = {
  muted: "text-muted-foreground",
  danger: "text-danger",
  teal: "text-brand-teal",
  brand: "text-brand",
};

export function AnimatedTerminal() {
  const [frame, setFrame] = useState(0);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const id = setInterval(() => {
      setFrame((f) => (f + 1) % FRAMES.length);
    }, 3000);
    return () => clearInterval(id);
  }, []);

  const current = FRAMES[frame]!;

  return (
    <div className="w-full max-w-md overflow-hidden rounded-xl border border-border bg-surface-elevated shadow-2xl">
      <div className="flex items-center gap-1.5 border-b border-border px-4 py-3">
        <span className="size-2.5 rounded-full bg-danger/60" />
        <span className="size-2.5 rounded-full bg-[#f5d76e]/60" />
        <span className="size-2.5 rounded-full bg-brand-teal/60" />
        <AnimatePresence mode="wait">
          <motion.span
            key={frame}
            initial={prefersReducedMotion ? undefined : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={prefersReducedMotion ? undefined : { opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="ml-2 font-mono text-xs text-text-tertiary"
          >
            {current.label}
          </motion.span>
        </AnimatePresence>
      </div>
      <div className="min-h-[140px] p-4 font-mono text-[13px] leading-relaxed">
        <AnimatePresence mode="wait">
          <motion.div
            key={frame}
            initial={prefersReducedMotion ? undefined : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={prefersReducedMotion ? undefined : { opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            {current.lines.map((line, i) => (
              <div key={i} className={TONE_CLASS[line.tone]}>
                {line.text}
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
