"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { CardShell } from "@/components/cards/card-shell";
import { PrimitiveVisual } from "@/components/cards/primitive-visual";
import { usePlayKey } from "@/lib/hooks/use-play-key";
import { usePrefersReducedMotion } from "@/lib/hooks/use-prefers-reduced-motion";
import { duration, EASE_SOFT } from "@/lib/motion";
import type { Card } from "@/lib/content/types";

type ExecutionCardProps = {
  card: Card;
  active: boolean;
  onReplay?: (cardId: string) => void;
  onInteract?: (cardId: string) => void;
};

export function ExecutionCard({ card, active, onReplay, onInteract }: ExecutionCardProps) {
  const reduced = usePrefersReducedMotion();
  const { playKey, replay } = usePlayKey();
  const interaction = card.interaction;
  const isCustom = interaction?.kind === "customInput";
  const [text, setText] = useState(interaction?.kind === "customInput" ? interaction.placeholder ?? "7,2,9,4,1" : "");
  const [customArray, setCustomArray] = useState<number[] | undefined>(undefined);
  const [runKey, setRunKey] = useState(0);

  const runCustom = () => {
    const arr = text
      .split(",")
      .map((t) => parseInt(t.trim(), 10))
      .filter((n) => Number.isFinite(n))
      .slice(0, 12);
    if (arr.length === 0) return;
    setCustomArray(arr);
    setRunKey((k) => k + 1);
    onInteract?.(card.id);
  };

  return (
    <CardShell eyebrow={card.concept} tone="info">
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

      {isCustom && (
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: duration.fast, delay: 0.15 }}
          className="flex items-center gap-2"
        >
          <label className="sr-only" htmlFor={`array-${card.id}`}>
            Your array
          </label>
          <input
            id={`array-${card.id}`}
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && runCustom()}
            placeholder="7,2,9,4,1"
            className="h-10 min-w-0 flex-1 rounded-xl border border-edge bg-surface/70 px-3 font-mono text-sm text-foreground placeholder:text-faint focus:border-info/60 focus:outline-none"
          />
          <button
            type="button"
            onClick={runCustom}
            className="h-10 shrink-0 rounded-xl border border-info/50 bg-info/10 px-4 font-mono text-sm text-info transition-colors hover:bg-info/20"
          >
            run it
          </button>
        </motion.div>
      )}

      {card.visual && (
        <div className="relative">
          <PrimitiveVisual
            visual={card.visual}
            active={active}
            playKey={playKey}
            onInteract={() => onInteract?.(card.id)}
            arrayOverride={customArray}
            runKey={runKey}
          />
          {!isCustom && (
            <motion.button
              type="button"
              aria-label="Replay execution"
              onClick={() => {
                replay();
                onReplay?.(card.id);
              }}
              initial={reduced ? false : { opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: reduced ? 0 : 1.4, duration: duration.fast }}
              whileTap={{ scale: 0.9 }}
              className="absolute -top-1 right-0 flex h-9 w-9 items-center justify-center rounded-full border border-edge bg-surface/80 text-muted backdrop-blur transition-colors hover:text-foreground"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
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