"use client";

import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";
import { duration, EASE_SOFT } from "@/lib/motion";
import type { Track } from "@/lib/content/types";

type EndCardProps = {
  track: Track;
  onRestart: () => void;
};

export function EndCard({ track, onRestart }: EndCardProps) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-8 px-6 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: duration.base, ease: EASE_SPRING_ANIM }}
        className="flex h-16 w-16 items-center justify-center rounded-full border border-success/40 bg-success/10 text-success"
      >
        <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M20 6 9 17l-5-5" />
        </svg>
      </motion.div>

      <div className="flex flex-col items-center gap-3">
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: duration.fast, ease: EASE_SOFT, delay: 0.15 }}
          className="text-balance text-3xl font-semibold tracking-tight"
        >
          You just learned self-attention.
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: duration.fast, ease: EASE_SOFT, delay: 0.3 }}
          className="max-w-md text-balance text-base leading-relaxed text-muted"
        >
          Tokens → attention → Q/K/V → the growing matrix. The machinery inside
          every modern LLM, connected — not memorized.
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: duration.fast, ease: EASE_SOFT, delay: 0.45 }}
        className="flex flex-col items-center gap-4"
      >
        <Chip tone="ai">next chapter · KV cache</Chip>
        <p className="max-w-sm text-sm leading-relaxed text-faint">
          The recompute problem has a fix — the model can remember the K and V it
          already computed. That story is coming next.
        </p>
        <Button onClick={onRestart} className="mt-1">
          Replay the track
        </Button>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="text-[0.68rem] font-medium tracking-widest text-faint uppercase"
      >
        {track.title} · {track.domain}
      </motion.p>
    </div>
  );
}

const EASE_SPRING_ANIM = [0.34, 1.56, 0.64, 1] as const;