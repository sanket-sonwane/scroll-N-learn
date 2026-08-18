"use client";

import { motion } from "motion/react";
import { CardShell } from "@/components/cards/card-shell";
import { usePrefersReducedMotion } from "@/lib/hooks/use-prefers-reduced-motion";
import { duration, EASE_SOFT } from "@/lib/motion";
import type { Card } from "@/lib/content/types";

type EquationCardProps = { card: Card };

export function EquationCard({ card }: EquationCardProps) {
  const reduced = usePrefersReducedMotion();

  return (
    <CardShell eyebrow={card.concept} tone="success">
      {card.hook && (
        <motion.h3
          initial={reduced ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: duration.base, ease: EASE_SOFT }}
          className="text-balance text-[clamp(1.2rem,4vw,1.6rem)] leading-snug font-semibold"
        >
          {card.hook}
        </motion.h3>
      )}
      {card.statement && (
        <motion.p
          initial={reduced ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: duration.base, ease: EASE_SOFT, delay: 0.1 }}
          className="text-balance text-base leading-relaxed text-muted"
        >
          {card.statement}
        </motion.p>
      )}
      {card.notation && (
        <motion.div
          initial={reduced ? false : { opacity: 0, scale: 0.92, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: duration.base, ease: EASE_SOFT, delay: 0.25 }}
          className="relative mx-auto mt-1 w-full max-w-sm overflow-hidden rounded-2xl border border-success/30 bg-success/5 px-6 py-5 text-center"
        >
          <motion.span
            className="font-mono text-[clamp(2rem,9vw,3.2rem)] font-semibold tracking-tight text-success"
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: duration.base, delay: 0.6 }}
          >
            {card.notation}
          </motion.span>
          <motion.div
            initial={reduced ? false : { scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: duration.base, ease: EASE_SOFT, delay: 0.45 }}
            className="mx-auto mt-2 h-px w-16 bg-success/50"
          />
        </motion.div>
      )}
      {card.footnote && (
        <motion.p
          initial={reduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: duration.base, delay: 0.8 }}
          className="text-center text-sm leading-relaxed text-muted"
        >
          {card.footnote}
        </motion.p>
      )}
    </CardShell>
  );
}