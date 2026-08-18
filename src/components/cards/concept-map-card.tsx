"use client";

import { motion } from "motion/react";
import { CardShell } from "@/components/cards/card-shell";
import { usePrefersReducedMotion } from "@/lib/hooks/use-prefers-reduced-motion";
import { duration, EASE_SOFT } from "@/lib/motion";
import type { Card } from "@/lib/content/types";

type ConceptMapCardProps = { card: Card };

export function ConceptMapCard({ card }: ConceptMapCardProps) {
  const reduced = usePrefersReducedMotion();
  const map = card.conceptMap;
  if (!map) return null;

  const outgoing = new Set(map.links.map((l) => l.from));
  const outgoingLabels = new Map(map.links.map((l) => [l.to, l.label]));

  return (
    <CardShell eyebrow={card.concept} tone="success">
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

      <div className="flex flex-col items-center gap-1 py-1">
        {map.nodes.map((node, i) => {
          const isHighlight = node.kind === "highlight";
          const isTeaser = !outgoing.has(node.id) && !isHighlight;
          const incomingLabel = outgoingLabels.get(node.id);

          return (
            <motion.div
              key={node.id}
              className="flex w-full flex-col items-center"
              initial={reduced ? false : { opacity: 0, y: 10, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{
                duration: duration.fast,
                ease: EASE_SOFT,
                delay: reduced ? 0 : 0.25 + i * 0.12,
              }}
            >
              {i > 0 && (
                <div className="relative flex h-5 items-center justify-center">
                  <motion.span
                    initial={reduced ? false : { scaleY: 0 }}
                    animate={{ scaleY: 1 }}
                    transition={{
                      delay: reduced ? 0 : 0.2 + i * 0.12,
                      duration: duration.fast,
                    }}
                    className="block h-4 w-px origin-top bg-edge-strong"
                    aria-hidden="true"
                  />
                  {incomingLabel && (
                    <span className="absolute ml-20 rounded-full border border-edge bg-surface px-2 py-0.5 font-mono text-[0.6rem] text-ai">
                      {incomingLabel}
                    </span>
                  )}
                </div>
              )}
              <motion.div
                animate={
                  isHighlight
                    ? { boxShadow: [
                        "0 0 0 0 rgba(167,139,250,0)",
                        "0 0 18px 0 rgba(167,139,250,0.45)",
                        "0 0 0 0 rgba(167,139,250,0)",
                      ] }
                    : undefined
                }
                transition={{ duration: 2.2, repeat: isHighlight ? Infinity : 0 }}
                className={`rounded-xl border px-5 py-2.5 text-[0.9rem] font-medium ${
                  isHighlight
                    ? "border-ai/60 bg-ai/15 text-ai"
                    : isTeaser
                      ? "border-dashed border-edge-strong bg-surface/40 text-muted"
                      : "border-edge bg-surface/80 text-foreground"
                }`}
              >
                {node.label}
                {isTeaser && (
                  <span className="ml-2 rounded-full bg-ai/15 px-2 py-0.5 font-mono text-[0.6rem] font-semibold text-ai">
                    next
                  </span>
                )}
              </motion.div>
            </motion.div>
          );
        })}
      </div>
    </CardShell>
  );
}