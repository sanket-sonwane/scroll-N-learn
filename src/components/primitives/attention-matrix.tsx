"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import { usePrefersReducedMotion } from "@/lib/hooks/use-prefers-reduced-motion";
import { duration, EASE_SOFT } from "@/lib/motion";

type AttentionMatrixProps = {
  config: {
    tokens: string[];
    highlights?: [number, number][];
    growToken?: string;
    heads?: { label: string; highlights: [number, number][] }[];
  };
  active: boolean;
  playKey: number;
  className?: string;
};

const HEAD_COLORS = [
  "91,155,255",
  "167,139,250",
  "52,211,153",
  "245,181,68",
  "244,114,182",
  "34,211,238",
];

function hash(n: number) {
  const x = Math.sin(n) * 10000;
  return x - Math.floor(x);
}

function baseWeight(i: number, j: number, n: number) {
  const diag = Math.abs(i - j);
  const structure = diag <= 1 ? 0.55 : diag <= 2 ? 0.34 : 0.2;
  const noise = hash(i * 31 + j * 17 + n * 7);
  return Math.min(1, structure + noise * 0.45);
}

function Cell({
  opacity,
  color,
  delay,
  animate,
  ring,
  className = "",
}: {
  opacity: number;
  color: string;
  delay: number;
  animate: boolean;
  ring?: boolean;
  className?: string;
}) {
  return (
    <motion.div
      className={`rounded-[3px] ${className}`}
      style={{
        backgroundColor: `rgba(${color}, ${opacity})`,
        boxShadow: ring ? `0 0 0 1.5px rgba(${color}, 0.9)` : undefined,
      }}
      initial={animate ? { opacity: 0 } : false}
      animate={{ opacity: 1 }}
      transition={{ delay, duration: animate ? duration.fast : 0 }}
    />
  );
}

export function AttentionMatrix({
  config,
  active,
  playKey,
  className = "",
}: AttentionMatrixProps) {
  if (!active) {
    return <div className={className} aria-hidden="true" />;
  }

  if (config.heads) {
    return (
      <HeadsMatrix key={playKey} config={config} className={className} />
    );
  }

  return <SingleMatrix key={playKey} config={config} className={className} />;
}

type MatrixConfig = AttentionMatrixProps["config"];

function HeadsMatrix({
  config,
  className = "",
}: {
  config: MatrixConfig;
  className?: string;
}) {
  const reduced = usePrefersReducedMotion();
  const n = config.tokens.length;
  const heads = config.heads ?? [];
  const weights = useMemo(() => {
    const map = new Map<string, number>();
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        map.set(`${i}|${j}`, baseWeight(i, j, n));
      }
    }
    return map;
  }, [n]);

  return (
    <div className={`grid w-full grid-cols-2 gap-3 sm:grid-cols-4 ${className}`}>
      {heads.map((head, hi) => {
        const color = HEAD_COLORS[hi % HEAD_COLORS.length];
        return (
          <motion.div
            key={hi}
            className="flex flex-col items-center gap-2"
            initial={reduced ? false : { opacity: 0, y: 12, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              delay: reduced ? 0 : 0.35 + hi * 0.22,
              duration: duration.base,
              ease: EASE_SOFT,
            }}
          >
            <div
              className="w-full rounded-lg border border-edge bg-surface/60 p-2"
              style={{
                display: "grid",
                gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))`,
                gap: 2,
              }}
            >
              {Array.from({ length: n * n }, (_, k) => {
                const i = Math.floor(k / n);
                const j = k % n;
                const isHighlight = head.highlights.some(
                  ([h, v]) => h === i && v === j,
                );
                const w = isHighlight ? 0.95 : (weights.get(`${i}|${j}`) ?? 0.2);
                return (
                  <Cell
                    key={k}
                    opacity={0.12 + w * 0.8}
                    color={color}
                    delay={reduced ? 0 : 0.15 * i}
                    animate={!reduced}
                    ring={isHighlight}
                    className="aspect-square"
                  />
                );
              })}
            </div>
            <span className="text-[0.62rem] font-medium tracking-wide text-muted uppercase">
              {head.label}
            </span>
          </motion.div>
        );
      })}
    </div>
  );
}

function SingleMatrix({
  config,
  className = "",
}: {
  config: MatrixConfig;
  className?: string;
}) {
  const reduced = usePrefersReducedMotion();
  const n = config.tokens.length;
  const [grown, setGrown] = useState<boolean>(() => reduced || !config.growToken);

  useEffect(() => {
    if (!config.growToken || reduced) return;
    const t = setTimeout(() => setGrown(true), 1700);
    return () => clearTimeout(t);
  }, [config.growToken, reduced]);

  const weights = useMemo(() => {
    const total = n + (config.growToken ? 1 : 0);
    const map = new Map<string, number>();
    for (let i = 0; i < total; i++) {
      for (let j = 0; j < total; j++) {
        map.set(`${i}|${j}`, baseWeight(i, j, total));
      }
    }
    return map;
  }, [n, config.growToken]);

  const total = n + (config.growToken ? 1 : 0);
  const visible = grown ? total : n;
  const color = "91,155,255";

  return (
    <div className={`flex w-full flex-col items-center ${className}`}>
      <div
        className="w-full max-w-[21rem] rounded-xl border border-edge bg-surface/60 p-3"
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${visible + 1}, minmax(0, 1fr))`,
          gap: 3,
          alignItems: "center",
        }}
      >
        <span />
        {Array.from({ length: visible }, (_, j) => (
          <motion.span
            key={j}
            className="text-center font-mono text-[0.6rem] text-muted"
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              delay: reduced ? 0 : 0.5 + j * 0.06,
              duration: duration.fast,
            }}
          >
            {config.tokens[j] ?? config.growToken}
          </motion.span>
        ))}
        {Array.from({ length: visible }, (_, i) => {
          const isGrownRow = i === n;
          return (
            <FragmentRow
              key={i}
              rowIndex={i}
              isGrownRow={isGrownRow}
              label={config.tokens[i] ?? config.growToken}
              total={visible}
              weights={weights}
              color={color}
              reduced={reduced}
              highlighted={config.highlights}
            />
          );
        })}
      </div>
    </div>
  );
}

function FragmentRow({
  rowIndex,
  isGrownRow,
  label,
  total,
  weights,
  color,
  reduced,
  highlighted,
}: {
  rowIndex: number;
  isGrownRow: boolean;
  label: string;
  total: number;
  weights: Map<string, number>;
  color: string;
  reduced: boolean;
  highlighted?: [number, number][];
}) {
  return (
    <>
      <motion.span
        className={`pr-1 text-right font-mono text-[0.6rem] ${
          isGrownRow ? "text-ai" : "text-muted"
        }`}
        initial={reduced ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: reduced ? 0 : 0.5, duration: duration.fast }}
      >
        {label}
      </motion.span>
      {Array.from({ length: total }, (_, j) => {
        const i = rowIndex;
        const isHighlight = highlighted?.some(([h, v]) => h === i && v === j);
        const w = isHighlight ? 0.95 : (weights.get(`${i}|${j}`) ?? 0.2);
        const popIn = isGrownRow;
        return (
          <motion.div
            key={j}
            className="aspect-square rounded-[3px]"
            style={{
              backgroundColor: `rgba(${isGrownRow ? "167,139,250" : color}, ${
                isHighlight ? 0.95 : 0.12 + w * 0.8
              })`,
              boxShadow: isHighlight
                ? `0 0 0 1.5px rgba(${color}, 0.9)`
                : popIn
                  ? "0 0 8px rgba(167,139,250,0.6)"
                  : undefined,
            }}
            initial={reduced || !popIn ? false : { opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={
              popIn && !reduced
                ? { delay: 0.15 * j, duration: duration.base, ease: EASE_SOFT }
                : { duration: 0 }
            }
          />
        );
      })}
    </>
  );
}