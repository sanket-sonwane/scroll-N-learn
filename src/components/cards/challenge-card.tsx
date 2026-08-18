"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CardShell } from "@/components/cards/card-shell";
import { usePrefersReducedMotion } from "@/lib/hooks/use-prefers-reduced-motion";
import { duration, EASE_SOFT } from "@/lib/motion";
import type { Card } from "@/lib/content/types";

type ChallengeCardProps = {
  card: Card;
  onInteract?: (cardId: string) => void;
};

type Stage = "hunt" | "broken" | "fixed";

export function ChallengeCard({ card, onInteract }: ChallengeCardProps) {
  const reduced = usePrefersReducedMotion();
  const config = card.challenge;
  const [stage, setStage] = useState<Stage>("hunt");
  const [picked, setPicked] = useState<string | null>(null);
  const [rejected, setRejected] = useState<Set<string>>(new Set());
  const [message, setMessage] = useState<string | null>(null);

  if (!config) return null;

  const flawedOf = (array: number[]) => Math.max(0, ...array);
  const trueMaxOf = (array: number[]) => Math.max(...array);

  const tap = (input: (typeof config.inputs)[number]) => {
    if (stage !== "hunt") return;
    if (input.breaks) {
      setPicked(input.id);
      setStage("broken");
      onInteract?.(card.id);
    } else {
      setRejected((prev) => new Set(prev).add(input.id));
      setMessage(`It survives this one. max = ${trueMaxOf(input.array)}. Keep hunting.`);
    }
  };

  const chosen = config.inputs.find((i) => i.id === picked) ?? null;
  const flawed = chosen ? flawedOf(chosen.array) : 0;
  const truth = chosen ? trueMaxOf(chosen.array) : 0;

  return (
    <CardShell eyebrow={card.concept} tone="warning">
      {card.hook && (
        <motion.h3
          initial={reduced ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: duration.base, ease: EASE_SOFT }}
          className="text-balance text-[clamp(1.3rem,4.5vw,1.8rem)] leading-snug font-semibold"
        >
          {card.hook}
        </motion.h3>
      )}

      <div className="overflow-hidden rounded-xl border border-edge bg-surface/60 px-4 py-3 font-mono text-[0.82rem] leading-relaxed">
        <p className="mb-1 text-[0.62rem] tracking-widest text-faint uppercase">
          {config.label} · as written
        </p>
        {config.pseudocode.map((line, i) => (
          <p key={i} className={line.startsWith("→") ? "text-muted" : "text-foreground"}>
            {line}
          </p>
        ))}
      </div>

      <div>
        <p className="mb-2 text-sm font-medium text-muted">
          Which input breaks it?
        </p>
        <div className="flex flex-wrap gap-2">
          {config.inputs.map((input) => {
            const isChosen = chosen?.id === input.id;
            const isRejected = rejected.has(input.id);
            return (
              <button
                key={input.id}
                type="button"
                disabled={stage !== "hunt" || isRejected}
                onClick={() => tap(input)}
                className={`rounded-xl border px-3 py-2 font-mono text-[0.82rem] tabular-nums transition-all duration-200 ${
                  isChosen
                    ? "border-success/60 bg-success/15 text-success"
                    : isRejected
                      ? "border-error/30 bg-error/5 text-error/60 line-through"
                      : "border-edge bg-surface/70 text-foreground hover:border-edge-strong"
                }`}
              >
                {input.array.join("  ")}
              </button>
            );
          })}
        </div>
        {message && (
          <motion.p
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-2 text-sm text-muted"
          >
            {message}
          </motion.p>
        )}
      </div>

      <AnimatePresence mode="wait">
        {stage === "broken" && chosen && (
          <motion.div
            key="broken"
            initial={reduced ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: duration.base, ease: EASE_SOFT }}
            className="flex flex-col gap-3"
          >
            <div className="rounded-2xl border border-success/40 bg-success/10 px-4 py-3">
              <p className="font-mono text-lg font-semibold text-success">
                {config.success}
              </p>
              <p className="mt-1 text-sm leading-relaxed text-foreground/90">
                The algorithm returned <span className="font-mono text-error">{flawed}</span> — but the true maximum is{" "}
                <span className="font-mono text-success">{truth}</span>.
              </p>
            </div>
            <div className="rounded-xl border border-edge bg-surface/60 px-4 py-3 text-sm leading-relaxed text-muted">
              <span className="text-foreground">Why:</span> max started at{" "}
              <span className="font-mono text-error">0</span>. Every value here is negative, so{" "}
              <span className="font-mono">0</span> “won” without being in the array. The algorithm assumed a
              value ≥ 0 always exists.
            </div>
            <button
              type="button"
              onClick={() => {
                setStage("fixed");
                onInteract?.(card.id);
              }}
              className="h-11 rounded-full bg-foreground font-medium text-background transition-colors hover:bg-white/90"
            >
              Fix it
            </button>
          </motion.div>
        )}

        {stage === "fixed" && chosen && (
          <motion.div
            key="fixed"
            initial={reduced ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: duration.base, ease: EASE_SOFT }}
            className="flex flex-col gap-3"
          >
            <div className="overflow-hidden rounded-xl border border-success/40 bg-success/5 px-4 py-3 font-mono text-[0.82rem] leading-relaxed">
              <p className="mb-1 text-[0.62rem] tracking-widest text-success/80 uppercase">
                repaired
              </p>
              <p className="text-foreground">max = a[0]</p>
              <p className="text-foreground">for each value x:</p>
              <p className="pl-4 text-muted">if x &gt; max: max = x</p>
            </div>
            <div className="rounded-2xl border border-success/40 bg-success/10 px-4 py-3 text-sm">
              Same input. Now returns{" "}
              <span className="font-mono font-semibold text-success">{truth}</span>. The failure disappears.
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </CardShell>
  );
}