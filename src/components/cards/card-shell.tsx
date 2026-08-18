"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";
import { Chip } from "@/components/ui/chip";
import { duration, EASE_SOFT } from "@/lib/motion";

type CardShellProps = {
  eyebrow: string;
  tone?: "default" | "info" | "success" | "ai" | "warning";
  children: ReactNode;
  footnote?: string;
  hint?: string;
};

export function CardShell({
  eyebrow,
  tone = "info",
  children,
  footnote,
  hint,
}: CardShellProps) {
  return (
    <div className="flex h-full w-full flex-col px-6 pt-[max(env(safe-area-inset-top),1.5rem)] pb-[max(env(safe-area-inset-bottom),1.5rem)] sm:px-10">
      <div className="flex h-full w-full max-w-2xl flex-col justify-between gap-4 self-center">
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: duration.fast, ease: EASE_SOFT }}
          className="flex items-center justify-between"
        >
          <Chip tone={tone}>{eyebrow}</Chip>
        </motion.div>

        <div className="flex min-h-0 flex-1 flex-col justify-center gap-4">
          {children}
        </div>

        {(footnote || hint) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: duration.base }}
            className="flex flex-col items-center gap-3"
          >
            {footnote && (
              <p className="text-center text-sm leading-relaxed text-muted">
                {footnote}
              </p>
            )}
            {hint && (
              <div className="flex items-center gap-2 text-[0.68rem] font-medium tracking-widest text-faint uppercase">
                <motion.span
                  animate={{ y: [0, 3, 0] }}
                  transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                  aria-hidden="true"
                >
                  ↓
                </motion.span>
                {hint}
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}