"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CardShell } from "@/components/cards/card-shell";
import { usePrefersReducedMotion } from "@/lib/hooks/use-prefers-reduced-motion";
import { duration, EASE_SOFT } from "@/lib/motion";
import type { Card } from "@/lib/content/types";

type ComparisonCardProps = {
  card: Card;
  onInteract?: (cardId: string) => void;
  onRank?: (cardId: string, correct: boolean) => void;
};

const ROW_H = 46;

export function ComparisonCard({ card, onInteract, onRank }: ComparisonCardProps) {
  const reduced = usePrefersReducedMotion();
  const interaction = card.interaction;

  const [order, setOrder] = useState(() => (interaction?.kind === "rank" ? interaction.items.map((i) => i.id) : []));
  const [checked, setChecked] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const dragRef = useRef<{ index: number } | null>(null);
  const listRef = useRef<HTMLDivElement>(null);

  if (!interaction || interaction.kind !== "rank") return null;

  const correct = order.join(",") === interaction.correctOrder.join(",");
  const itemById = new Map(interaction.items.map((i) => [i.id, i.label]));

  const moveTo = (id: string, to: number) => {
    setOrder((prev) => {
      const next = prev.filter((x) => x !== id);
      next.splice(Math.max(0, Math.min(to, next.length)), 0, id);
      return next;
    });
  };

  const onPointerDown = (index: number, e: React.PointerEvent) => {
    if (checked) return;
    e.stopPropagation();
    dragRef.current = { index };
    setActiveId(order[index]);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const drag = dragRef.current;
    if (!drag) return;
    const rect = listRef.current?.getBoundingClientRect();
    if (!rect || rect.height === 0) return;
    const target = Math.max(
      0,
      Math.min(order.length - 1, Math.round((e.clientY - rect.top - ROW_H / 2) / ROW_H)),
    );
    if (target === drag.index) return;
    const id = order[drag.index];
    drag.index = target;
    moveTo(id, target);
  };

  const onPointerUp = () => {
    dragRef.current = null;
    setActiveId(null);
  };

  return (
    <CardShell eyebrow={card.concept} tone="warning">
      {card.hook && (
        <motion.h3
          initial={reduced ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: duration.fast, ease: EASE_SOFT }}
          className="text-balance text-[clamp(1.2rem,4vw,1.6rem)] leading-snug font-semibold"
        >
          {card.hook}
        </motion.h3>
      )}

      <motion.p
        initial={reduced ? false : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: duration.fast, ease: EASE_SOFT, delay: 0.08 }}
        className="text-sm leading-relaxed text-muted"
      >
        {interaction.prompt}
      </motion.p>

      <div
        ref={listRef}
        className="flex flex-col gap-2"
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        {order.map((id, i) => {
          const isActive = activeId === id;
          const correctPos = interaction.correctOrder.indexOf(id);
          return (
            <motion.div
              key={id}
              layout={!reduced}
              transition={{ type: "spring", stiffness: 380, damping: 30 }}
              onPointerDown={(e) => onPointerDown(i, e)}
              style={{ touchAction: "none" }}
              className={`flex h-11 cursor-grab items-center gap-3 rounded-xl border px-3.5 transition-colors duration-200 active:cursor-grabbing ${
                checked
                  ? correctPos === i
                    ? "border-success/50 bg-success/10"
                    : "border-error/50 bg-error/10"
                  : isActive
                    ? "border-info/60 bg-info/10"
                    : "border-edge bg-surface/70"
              } ${checked ? "" : "hover:border-edge-strong"}`}
            >
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-edge-strong font-mono text-[0.68rem] text-muted">
                {i + 1}
              </span>
              <span className={`font-mono text-sm font-medium ${checked && correctPos === i ? "text-success" : checked ? "text-error/90" : "text-foreground"}`}>
                {itemById.get(id)}
              </span>
              {checked && (
                <span className={`ml-auto text-sm ${correctPos === i ? "text-success" : "text-error"}`}>
                  {correctPos === i ? "✓" : "✕"}
                </span>
              )}
              {!checked && (
                <span className="ml-auto text-faint" aria-hidden="true">
                  ⋮⋮
                </span>
              )}
            </motion.div>
          );
        })}
      </div>

      <div className="flex items-center justify-center gap-2">
        <button
          type="button"
          disabled={checked}
          onClick={() => {
            setChecked(true);
            onInteract?.(card.id);
            onRank?.(card.id, correct);
          }}
          className="h-10 rounded-full border border-edge bg-surface/80 px-6 font-mono text-sm text-foreground transition-colors hover:border-edge-strong disabled:opacity-40"
        >
          check order
        </button>
        {checked && (
          <button
            type="button"
            onClick={() => {
              setChecked(false);
              setOrder(interaction.correctOrder.map((id) => id));
              onInteract?.(card.id);
            }}
            className="h-10 rounded-full border border-edge bg-surface/80 px-6 font-mono text-sm text-foreground transition-colors hover:border-edge-strong"
          >
            show answer
          </button>
        )}
      </div>

      <AnimatePresence>
        {checked && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <p className={`mt-1 rounded-xl border px-4 py-3 text-center text-sm ${correct ? "border-success/30 bg-success/5 text-success" : "border-warning/30 bg-warning/5 text-warning"}`}>
              {correct
                ? "Slower to faster — that's the whole growth hierarchy."
                : "Not yet. Compare how fast each one accelerates, then drag to reorder."}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </CardShell>
  );
}