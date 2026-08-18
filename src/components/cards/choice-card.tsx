"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CardShell } from "@/components/cards/card-shell";
import { usePrefersReducedMotion } from "@/lib/hooks/use-prefers-reduced-motion";
import { duration, EASE_SOFT } from "@/lib/motion";
import type { Card } from "@/lib/content/types";

type ChoiceCardProps = {
  card: Card;
  onAnswer?: (cardId: string, correct: boolean) => void;
};

const LETTERS = ["A", "B", "C", "D", "E"];

export function ChoiceCard({ card, onAnswer }: ChoiceCardProps) {
  const reduced = usePrefersReducedMotion();
  const interaction = card.interaction;
  const [selected, setSelected] = useState<number | null>(null);

  if (!interaction || (interaction.kind !== "predict" && interaction.kind !== "quiz")) {
    return null;
  }

  const answered = selected !== null;
  const wasCorrect = answered ? interaction.options[selected!].correct : false;

  const choose = (i: number) => {
    if (answered) return;
    setSelected(i);
    onAnswer?.(card.id, interaction.options[i].correct);
  };

  return (
    <CardShell eyebrow={card.concept} tone={interaction.kind === "quiz" ? "success" : "warning"}>
      {card.hook && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: duration.fast, ease: EASE_SOFT }}
          className="text-sm font-medium tracking-wide text-muted uppercase"
        >
          {card.hook}
        </motion.p>
      )}

      <motion.h3
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: duration.base, ease: EASE_SOFT }}
        className="text-balance text-[clamp(1.25rem,4.5vw,1.7rem)] leading-snug font-semibold"
      >
        {interaction.prompt}
      </motion.h3>

      <div className="flex flex-col gap-2">
        {interaction.options.map((option, i) => {
          const isSelected = selected === i;
          const isCorrectOption = option.correct;
          const dim = answered && !isSelected && !isCorrectOption;
          const isWrongPick = isSelected && !isCorrectOption;

          return (
            <motion.button
              key={option.label}
              type="button"
              disabled={answered}
              onClick={() => choose(i)}
              initial={reduced ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0, scale: isWrongPick ? [1, 0.97, 1.01, 1] : 1 }}
              transition={{
                opacity: { duration: duration.fast, ease: EASE_SOFT, delay: 0.12 + i * 0.08 },
                scale: { duration: 0.35, ease: EASE_SOFT },
              }}
              whileTap={answered ? undefined : { scale: 0.985 }}
              className={`flex items-center gap-3 rounded-2xl border px-4 py-3 text-left transition-colors duration-300 ${
                isCorrectOption && answered
                  ? "border-success/60 bg-success/10"
                  : isWrongPick
                    ? "border-error/60 bg-error/10"
                    : "border-edge bg-surface/60 hover:border-edge-strong"
              } ${dim ? "opacity-40" : "opacity-100"}`}
            >
              <span
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border font-mono text-xs font-semibold ${
                  isCorrectOption && answered
                    ? "border-success/50 bg-success/15 text-success"
                    : isWrongPick
                      ? "border-error/50 bg-error/15 text-error"
                      : "border-edge-strong text-muted"
                }`}
              >
                {LETTERS[i]}
              </span>
              <span className="text-[0.95rem] leading-snug font-medium">
                {option.label}
              </span>
              {isCorrectOption && answered && (
                <span className="ml-auto text-success" aria-hidden="true">
                  ✓
                </span>
              )}
              {isWrongPick && (
                <span className="ml-auto text-error" aria-hidden="true">
                  ✕
                </span>
              )}
            </motion.button>
          );
        })}
      </div>

      <AnimatePresence>
        {answered && (
          <motion.div
            key="reveal"
            initial={{ opacity: 0, height: 0, y: 6 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: duration.base, ease: EASE_SOFT }}
            className="overflow-hidden"
          >
            <div
              className={`mt-1 rounded-2xl border px-4 py-3 text-[0.85rem] leading-relaxed ${
                wasCorrect
                  ? "border-success/25 bg-success/5 text-foreground/90"
                  : "border-warning/25 bg-warning/5 text-foreground/90"
              }`}
            >
              {interaction.options[selected!].explanation && (
                <p className="mb-1.5 font-medium text-success">
                  {wasCorrect ? "Correct." : "Not quite."}
                </p>
              )}
              <p>{interaction.options[selected!].explanation}</p>
              {card.reveal && (
                <p className="mt-2.5 border-t border-edge pt-2.5 text-muted">
                  {card.reveal}
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </CardShell>
  );
}