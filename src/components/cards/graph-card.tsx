"use client";

import { motion } from "motion/react";
import { CardShell } from "@/components/cards/card-shell";
import { PrimitiveVisual } from "@/components/cards/primitive-visual";
import { usePlayKey } from "@/lib/hooks/use-play-key";
import { usePrefersReducedMotion } from "@/lib/hooks/use-prefers-reduced-motion";
import { duration, EASE_SOFT } from "@/lib/motion";
import type { Card } from "@/lib/content/types";

type GraphCardProps = {
  card: Card;
  active: boolean;
  onInteract?: (cardId: string) => void;
};

export function GraphCard({ card, active, onInteract }: GraphCardProps) {
  const reduced = usePrefersReducedMotion();
  const { playKey } = usePlayKey();

  return (
    <CardShell eyebrow={card.concept} tone="ai">
      {card.hook && (
        <motion.h3
          initial={reduced ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: duration.fast, ease: EASE_SOFT }}
          className="text-balance text-[clamp(1.2rem,4vw,1.6rem)] leading-snug font-semibold"
        >
          {card.hook}
        </motion.h3>
      )}
      {card.statement && (
        <motion.p
          initial={reduced ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: duration.fast, ease: EASE_SOFT, delay: 0.08 }}
          className="text-sm leading-relaxed text-muted"
        >
          {card.statement}
        </motion.p>
      )}

      {card.visual && (
        <PrimitiveVisual
          visual={card.visual}
          active={active}
          playKey={playKey}
          onInteract={() => onInteract?.(card.id)}
        />
      )}
    </CardShell>
  );
}