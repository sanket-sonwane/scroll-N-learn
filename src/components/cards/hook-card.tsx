"use client";

import { motion } from "motion/react";
import { CardShell } from "@/components/cards/card-shell";
import { duration, EASE_SOFT } from "@/lib/motion";
import type { Card } from "@/lib/content/types";

type HookCardProps = { card: Card };

export function HookCard({ card }: HookCardProps) {
  return (
    <CardShell eyebrow={card.concept} tone="ai" hint="swipe to continue">
      <motion.h2
        initial={{ opacity: 0, y: 24, filter: "blur(6px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.7, ease: EASE_SOFT, delay: 0.05 }}
        className="text-balance text-[clamp(1.9rem,7vw,3.4rem)] leading-[1.08] font-semibold tracking-tight"
      >
        {card.hook}
      </motion.h2>
      {card.statement && (
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: duration.base, ease: EASE_SOFT, delay: 0.35 }}
          className="text-balance max-w-xl text-base leading-relaxed text-muted sm:text-lg"
        >
          {card.statement}
        </motion.p>
      )}
    </CardShell>
  );
}