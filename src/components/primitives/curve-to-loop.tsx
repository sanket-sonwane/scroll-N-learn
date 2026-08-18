"use client";

import { motion } from "motion/react";
import type { CurveToLoopConfigType } from "@/lib/content/types";
import { usePrefersReducedMotion } from "@/lib/hooks/use-prefers-reduced-motion";
import { duration, EASE_SOFT } from "@/lib/motion";

const W = 300;
const H = 120;

type CurveToLoopProps = {
  config: CurveToLoopConfigType;
  active: boolean;
  playKey: number;
  className?: string;
};

export function CurveToLoop({ config, className = "" }: CurveToLoopProps) {
  const reduced = usePrefersReducedMotion();
  const n = config.n;

  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      <div className="overflow-hidden rounded-2xl border border-edge bg-surface/50">
        <svg viewBox={`0 0 ${W} ${H}`} className="block h-auto w-full" role="img" aria-label="An O(n) curve transforming into a loop">
          <line x1={14} x2={14} y1={10} y2={H - 10} stroke="rgba(255,255,255,0.15)" strokeWidth={1} />
          <line x1={14} x2={W - 10} y1={H - 10} y2={H - 10} stroke="rgba(255,255,255,0.15)" strokeWidth={1} />
          <motion.line
            x1={14}
            y1={H - 10}
            x2={W - 10}
            y2={10}
            stroke="var(--color-info)"
            strokeWidth={2}
            initial={reduced ? { pathLength: 1 } : { pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: reduced ? 0 : 1.1, ease: EASE_SOFT }}
          />
          <motion.circle
            cx={W - 10}
            cy={10}
            r={4}
            fill="var(--color-info)"
            initial={reduced ? { opacity: 1 } : { opacity: 0, scale: 0.4 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: reduced ? 0 : 1.1, duration: 0.3 }}
          />
          <motion.text
            x={30}
            y={24}
            fontSize={10}
            fill="var(--color-info)"
            fontFamily="var(--font-geist-mono)"
            initial={reduced ? { opacity: 1 } : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: reduced ? 0 : 0.5, duration: duration.fast }}
          >
            work ≈ n
          </motion.text>
        </svg>
      </div>

      <motion.div
        initial={reduced ? { opacity: 1 } : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: reduced ? 0 : 1.3, duration: duration.base, ease: EASE_SOFT }}
        className="mx-auto w-full max-w-sm rounded-xl border border-edge bg-surface/70 px-4 py-3 font-mono text-sm"
      >
        <p className="text-muted">
          <span className="text-foreground">for</span> <span className="text-info">i</span>{" "}
          <span className="text-foreground">in range(n):</span>
        </p>
        <p className="mt-1 pl-5 text-success">count_comparison()</p>
        <motion.p
          initial={reduced ? { opacity: 1 } : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: reduced ? 0 : 2.0, duration: duration.base }}
          className="mt-2 border-t border-edge pt-2 text-[0.78rem] leading-relaxed text-muted"
        >
          One pass through {n} elements → about {n} operations.
        </motion.p>
      </motion.div>
    </div>
  );
}