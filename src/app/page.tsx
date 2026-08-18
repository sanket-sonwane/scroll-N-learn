"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { Chip } from "@/components/ui/chip";
import { getTrack } from "@/lib/content/loader";
import { readProgress, clearProgress } from "@/lib/state/progress";
import { duration, EASE_SOFT } from "@/lib/motion";

const TRACK_ID = "ai-engineering";

export default function Home() {
  const track = getTrack(TRACK_ID);
  const total = track.cards.length;
  const state = useState(() => readProgress(TRACK_ID))[0];

  const resume = Math.min(state.index, total);
  const finished = state.completed.length >= total || resume >= total;
  const completed = Math.min(state.completed.length, total);
  const pct = Math.round((completed / total) * 100);
  const isFresh = completed === 0;

  return (
    <main className="flex h-full w-full flex-col items-center justify-center gap-10 overflow-y-auto px-6">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: duration.base, ease: EASE_SOFT }}
        className="flex flex-col items-center gap-3 text-center"
      >
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-ai/40 bg-ai/10 text-lg">
            <span aria-hidden="true">∞</span>
          </span>
          <span className="text-2xl font-semibold tracking-tight">
            ScrollLearn
          </span>
        </div>
        <p className="text-balance max-w-xs text-sm leading-relaxed text-muted">
          Short-form learning for technically curious people. Open it because
          you want to scroll. Leave understanding something.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: duration.base, ease: EASE_SOFT, delay: 0.15 }}
        className="glass-panel w-full max-w-sm rounded-3xl p-6"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold tracking-tight">
              {track.title}
            </h2>
            <p className="mt-1 text-sm leading-relaxed text-muted">
              {track.subtitle}
            </p>
          </div>
          <Chip tone="ai">{track.topic}</Chip>
        </div>

        <div className="mt-6">
          <div className="mb-2 flex items-center justify-between font-mono text-xs text-muted">
            <span>
              {completed} / {total} concepts
            </span>
            <span className="text-ai">{pct}%</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-2">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-info to-ai"
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: duration.base, ease: EASE_SOFT }}
            />
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-2.5">
          <Link
            href={`/feed/${finished ? 0 : resume}`}
            className="inline-flex h-12 w-full items-center justify-center rounded-full bg-foreground text-background font-medium transition-colors hover:bg-white/90"
          >
            {finished ? "Replay the track" : isFresh ? "Begin the track" : "Continue"}
          </Link>
          <button
            type="button"
            onClick={() => clearProgress(TRACK_ID)}
            className="text-sm text-faint transition-colors hover:text-muted"
          >
            Start over
          </button>
        </div>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="max-w-xs text-center text-xs leading-relaxed text-faint"
      >
        10 cards · ~6 minutes · one connected idea — why LLMs slow down as
        conversations grow.
      </motion.p>
    </main>
  );
}