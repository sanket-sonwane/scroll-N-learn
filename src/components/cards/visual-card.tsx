"use client";

import { motion } from "motion/react";
import { CardShell } from "@/components/cards/card-shell";
import { PrimitiveVisual } from "@/components/cards/primitive-visual";
import { usePlayKey } from "@/lib/hooks/use-play-key";
import { usePrefersReducedMotion } from "@/lib/hooks/use-prefers-reduced-motion";
import { duration, EASE_SOFT } from "@/lib/motion";
import type { Card } from "@/lib/content/types";

type VisualCardProps = {
  card: Card;
  active: boolean;
  onReplay?: (cardId: string) => void;
  onInteract?: (cardId: string) => void;
};

export function VisualCard({ card, active, onReplay, onInteract }: VisualCardProps) {
  const reduced = usePrefersReducedMotion();
  const { playKey, replay } = usePlayKey();
  const isSimulation = card.type === "simulation";

  return (
    <CardShell eyebrow={card.concept} tone={isSimulation ? "ai" : "info"}>
      <div className="flex flex-col gap-3">
        {card.hook && (
          <motion.h3
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: duration.fast, ease: EASE_SOFT }}
            className="text-lg font-semibold text-foreground sm:text-xl"
          >
            {card.hook}
          </motion.h3>
        )}
        {card.statement && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: duration.fast, ease: EASE_SOFT, delay: 0.08 }}
            className="text-sm leading-relaxed text-muted sm:text-base"
          >
            {card.statement}
          </motion.p>
        )}
      </div>

      {card.interaction?.kind === "sim" && card.interaction.prompt && (
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: duration.fast, delay: 0.2 }}
          className="rounded-xl border border-ai/25 bg-ai/10 px-4 py-2.5 text-center text-[0.95rem] font-medium text-ai"
        >
          {card.interaction.prompt}
        </motion.p>
      )}

      {card.visual && (
        <div className="relative">
          <PrimitiveVisual
            visual={card.visual}
            active={active}
            playKey={playKey}
            onInteract={() => onInteract?.(card.id)}
          />
          {card.visual && card.visual.kind !== "attentionMatrix" && (
            <motion.button
              type="button"
              aria-label="Replay animation"
              onClick={() => {
                replay();
                onReplay?.(card.id);
              }}
              initial={reduced ? false : { opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                delay: reduced ? 0 : 1.4,
                duration: duration.fast,
                ease: EASE_SPRING_ANIM,
              }}
              whileTap={{ scale: 0.9 }}
              className="absolute -top-1 right-0 flex h-9 w-9 items-center justify-center rounded-full border border-edge bg-surface/80 text-muted backdrop-blur transition-colors hover:text-foreground"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.8}
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M21 12a9 9 0 1 1-2.64-6.36" />
                <path d="M21 3v6h-6" />
              </svg>
            </motion.button>
          )}
        </div>
      )}
    </CardShell>
  );
}

const EASE_SPRING_ANIM = [0.34, 1.56, 0.64, 1] as const;