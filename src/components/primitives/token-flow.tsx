"use client";

import { motion } from "motion/react";
import type { MotionProps } from "motion/react";
import { usePrefersReducedMotion } from "@/lib/hooks/use-prefers-reduced-motion";
import { duration, EASE_SOFT, EASE_SPRING } from "@/lib/motion";

type TokenFlowProps = {
  config: {
    tokens: string[];
    predicted?: string;
    emphasis?: number[];
  };
  active: boolean;
  playKey: number;
  className?: string;
};

const CHIP_W = 13;
const CHIP_H = 9;
const GAP = 1.6;

export function TokenFlow({
  config,
  active,
  playKey,
  className = "",
}: TokenFlowProps) {
  const reduced = usePrefersReducedMotion();
  const count = config.tokens.length;
  const hasPredicted = Boolean(config.predicted);
  const totalW =
    count * CHIP_W + (count - 1) * GAP + (hasPredicted ? CHIP_W + 3 : 0);
  const startX = (100 - totalW) / 2;
  const baseY = 24;

  if (!active) {
    return (
      <svg viewBox="0 0 100 40" className={className} aria-hidden="true" />
    );
  }

  const anim = (delay: number): MotionProps =>
    reduced
      ? { initial: false, animate: { opacity: 1, x: 0, y: 0, scale: 1 } }
      : {
          initial: { opacity: 0, x: -4, y: 6, scale: 0.92 },
          animate: { opacity: 1, x: 0, y: 0, scale: 1 },
          transition: {
            delay,
            duration: duration.fast,
            ease: EASE_SPRING,
          },
        };

  const streamKey = `stream-${playKey}`;

  return (
    <svg
      viewBox="0 0 100 40"
      className={`block h-full w-full ${className}`}
      aria-label="Tokens flowing into the model, then the next token prediction"
    >
      <motion.line
        key={streamKey}
        x1={startX}
        y1={baseY + CHIP_H / 2}
        x2={startX + totalW}
        y2={baseY + CHIP_H / 2}
        stroke="currentColor"
        strokeOpacity={0.18}
        strokeDasharray="1.4 1.6"
        initial={reduced ? false : { pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: EASE_SOFT }}
      />

      {config.tokens.map((token, i) => {
        const x = startX + i * (CHIP_W + GAP);
        const emphasize = config.emphasis?.includes(i);
        return (
          <motion.g key={`${playKey}-${i}`} {...anim(reduced ? 0 : 0.15 * i)}>
            <rect
              x={x}
              y={baseY}
              width={CHIP_W}
              height={CHIP_H}
              rx={CHIP_H / 2}
              fill={emphasize ? "rgba(91,155,255,0.16)" : "rgba(255,255,255,0.06)"}
              stroke={emphasize ? "rgba(91,155,255,0.55)" : "rgba(255,255,255,0.16)"}
              strokeWidth={0.4}
            />
            <text
              x={x + CHIP_W / 2}
              y={baseY + CHIP_H / 2}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize={3.6}
              fill="currentColor"
              opacity={emphasize ? 1 : 0.85}
              style={{ fontFamily: "var(--font-geist-sans)" }}
            >
              {token}
            </text>
          </motion.g>
        );
      })}

      {hasPredicted && (
        <motion.g
          key={`pred-${playKey}`}
          initial={
            reduced
              ? { opacity: 1, scale: 1 }
              : { opacity: 0, scale: 0.5, y: 14 }
          }
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{
            delay: reduced ? 0 : 0.15 * count + 0.55,
            duration: duration.base,
            ease: EASE_SPRING,
          }}
        >
          <motion.circle
            cx={startX + count * CHIP_W + (count - 1) * GAP + CHIP_W / 2}
            cy={baseY + CHIP_H / 2}
            r={CHIP_H * 0.85}
            fill="none"
            stroke="rgba(167,139,250,0.7)"
            strokeWidth={0.35}
            animate={{ scale: [1, 1.25, 1], opacity: [0.7, 0, 0.7] }}
            transition={{
              duration: 1.6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <rect
            x={startX + count * CHIP_W + (count - 1) * GAP}
            y={baseY}
            width={CHIP_W}
            height={CHIP_H}
            rx={CHIP_H / 2}
            fill="rgba(167,139,250,0.22)"
            stroke="rgba(167,139,250,0.85)"
            strokeWidth={0.5}
            style={{ filter: "drop-shadow(0 0 5px rgba(167,139,250,0.5))" }}
          />
          <text
            x={startX + count * CHIP_W + (count - 1) * GAP + CHIP_W / 2}
            y={baseY + CHIP_H / 2}
            textAnchor="middle"
            dominantBaseline="central"
            fontSize={3.6}
            fontWeight={600}
            fill="#d8ccff"
            style={{ fontFamily: "var(--font-geist-sans)" }}
          >
            {config.predicted}
          </text>
        </motion.g>
      )}
    </svg>
  );
}