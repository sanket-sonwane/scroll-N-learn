"use client";

import { motion } from "motion/react";
import { CardShell } from "@/components/cards/card-shell";
import { PrimitiveVisual } from "@/components/cards/primitive-visual";
import { usePlayKey } from "@/lib/hooks/use-play-key";
import { usePrefersReducedMotion } from "@/lib/hooks/use-prefers-reduced-motion";
import { duration, EASE_SOFT } from "@/lib/motion";
import type { Card } from "@/lib/content/types";

type ConceptCardProps = { card: Card; active: boolean };

export function ConceptCard({ card, active }: ConceptCardProps) {
  const reduced = usePrefersReducedMotion();
  const { playKey } = usePlayKey();

  return (
    <CardShell eyebrow={card.concept} tone="info">
      {card.hook && (
        <motion.h3
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: duration.fast, ease: EASE_SOFT }}
          className="text-lg font-semibold text-foreground sm:text-xl"
        >
          {card.hook}
        </motion.h3>
      )}
      {card.statement && (
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: duration.fast, ease: EASE_SOFT, delay: 0.1 }}
          className="text-base leading-relaxed text-foreground/90 sm:text-lg"
        >
          {card.statement}
        </motion.p>
      )}
      {card.facts && (
        <ul className="flex flex-col gap-2.5">
          {card.facts.map((fact, i) => (
            <motion.li
              key={fact}
              initial={reduced ? false : { opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: duration.fast,
                ease: EASE_SOFT,
                delay: 0.2 + i * 0.14,
              }}
              className="flex items-start gap-3 text-[0.95rem] leading-snug text-foreground/90"
            >
              <span
                aria-hidden="true"
                className="mt-1 flex h-1.5 w-1.5 shrink-0 rounded-full bg-info"
              />
              {fact}
            </motion.li>
          ))}
        </ul>
      )}
      {card.visual && (
        <PrimitiveVisual
          visual={card.visual}
          active={active}
          playKey={playKey}
        />
      )}
    </CardShell>
  );
}