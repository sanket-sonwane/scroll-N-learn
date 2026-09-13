"use client";

import { useMemo, useState } from "react";
import { motion } from "motion/react";
import type { ExampleStreamConfigType } from "@/lib/content/types";
import { usePrefersReducedMotion } from "@/lib/hooks/use-prefers-reduced-motion";
import { duration, EASE_SOFT, EASE_SPRING } from "@/lib/motion";

type ExampleStreamProps = {
  config: ExampleStreamConfigType;
  active: boolean;
  playKey: number;
  onInteract?: () => void;
  className?: string;
};

function mulberry32(seed: number) {
  let s = (seed & 0xffffffff) || 1;
  return () => {
    s += 0x6d2b79f5;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const shownAt = (
  examples: { id: number; truth: boolean; flip: number }[],
  noise: number,
  i: number,
) => {
  const flipped = noise > 0 && examples[i].flip < noise / 100;
  return flipped ? !examples[i].truth : examples[i].truth;
};

const STEP = 0.4;

export function ExampleStream({
  config,
  active,
  playKey,
  onInteract,
  className = "",
}: ExampleStreamProps) {
  const reduced = usePrefersReducedMotion();
  const { positive, negative, count, mode, noiseDial, seed } = config;
  const labeled = mode === "labeled";
  const [noise, setNoise] = useState(0);

  const examples = useMemo(() => {
    const a = mulberry32(seed);
    const b = mulberry32(seed + 7001);
    const out: { id: number; f: number; truth: boolean; flip: number }[] = [];
    for (let i = 0; i < count; i++) {
      const f = a() * 100;
      const truth = f >= 55 ? true : f < 45 ? false : a() < 0.5;
      out.push({ id: i, f, truth, flip: b() });
    }
    return out;
  }, [seed, count]);

  const shown = (i: number) => shownAt(examples, noise, i);

  const perOk = useMemo(() => {
    if (!labeled) return null;
    const ok: boolean[] = [];
    for (let i = 0; i < examples.length; i++) {
      const tgt = examples[i];
      if (i === 0) {
        ok.push(true === tgt.truth);
        continue;
      }
      const seen = examples
        .slice(0, i)
        .map((e) => ({ f: e.f, p: shownAt(examples, noise, e.id) }))
        .sort((x, y) => Math.abs(x.f - tgt.f) - Math.abs(y.f - tgt.f));
      const k = Math.min(3, seen.length);
      const pos = seen.slice(0, k).filter((x) => x.p).length;
      const pred = pos * 2 >= k;
      ok.push(pred === tgt.truth);
    }
    return ok;
  }, [examples, labeled, noise]);

  const cumAcc = useMemo(() => {
    if (!perOk) return null;
    const out: number[] = [];
    let c = 0;
    for (let i = 0; i < perOk.length; i++) {
      if (perOk[i]) c++;
      out.push(c / (i + 1));
    }
    return out;
  }, [perOk]);

  const finalAcc = cumAcc?.[count - 1] ?? 0;
  const checkpoints = [4, 6, 8, 10, 12].filter((i) => i <= count);

  if (!active) return <div className={className} aria-hidden="true" />;

return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {labeled && (
        <div className="rounded-xl border border-edge bg-surface/50 px-3 py-2">
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-[1.3rem] font-semibold tabular-nums text-foreground">
              {Math.round(finalAcc * 100)}%
            </span>
            <span className="text-[0.68rem] leading-tight text-muted">
              model accuracy · {count} examples taught
            </span>
          </div>
          <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-surface-2">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-info to-ai"
              initial={{ width: "0%" }}
              animate={{ width: `${Math.round(finalAcc * 100)}%` }}
              transition={{
                delay: reduced ? 0 : count * STEP + 0.3,
                duration: duration.base,
                ease: EASE_SOFT,
              }}
            />
          </div>
        </div>
      )}

      {noiseDial && (
        <label className="flex items-center gap-2 text-[0.7rem] text-muted">
          <span className="shrink-0 font-mono text-[0.62rem] text-faint uppercase">
            noise
          </span>
          <input
            type="range"
            min={0}
            max={30}
            step={5}
            value={noise}
            onChange={(e) => {
              setNoise(Number(e.target.value));
              onInteract?.();
            }}
            className="h-1.5 w-full"
            style={{ accentColor: "var(--color-error)" }}
            aria-label="Label noise level"
          />
          <span className="w-24 shrink-0 text-right font-mono tabular-nums text-error">
            {noise}% mislabeled
          </span>
        </label>
      )}

      <div className="overflow-hidden rounded-xl border border-edge bg-surface/40 px-2.5 py-2.5">
        <div className="flex flex-wrap items-end gap-x-1.5 gap-y-1.5">
          {examples.map((e) => {
            const pos = labeled ? shown(e.id) : e.truth;
            const ok = perOk?.[e.id];
            const dotCls = labeled
              ? pos
                ? "border-error/60 bg-error/15 text-error"
                : "border-success/60 bg-success/15 text-success"
              : "border-edge-strong bg-surface/60 text-muted";
            return (
              <motion.div
                key={`${playKey}-${e.id}`}
                initial={reduced ? false : { opacity: 0, scale: 0.3, y: 4 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{
                  delay: reduced ? 0 : e.id * STEP,
                  duration: duration.fast,
                  ease: EASE_SPRING,
                }}
                className="flex flex-col items-center gap-0.5"
              >
                <span
                  className={`flex h-6 w-6 items-center justify-center rounded-full border text-[0.62rem] font-bold ${dotCls}`}
                >
                  {labeled && ok !== undefined ? (ok ? "✓" : "✗") : ""}
                </span>
                {labeled && (
                  <span
                    className={`whitespace-nowrap rounded-full border px-1 text-[0.5rem] uppercase tracking-wider ${
                      pos
                        ? "border-error/40 bg-error/10 text-error"
                        : "border-success/40 bg-success/10 text-success"
                    }`}
                  >
                    {pos ? positive : negative}
                  </span>
                )}
              </motion.div>
            );
          })}
        </div>
        {!labeled && (
          <p className="mt-2 text-center text-[0.7rem] text-faint">
            same dots · no labels · the structure is there, the answers aren&apos;t
          </p>
        )}
      </div>

      {labeled && cumAcc && (
        <div className="flex flex-wrap gap-1.5">
          {checkpoints.map((c) => (
            <span
              key={c}
              className="rounded-full border border-edge bg-surface/70 px-2 py-0.5 font-mono text-[0.62rem] tabular-nums text-muted"
            >
              n={c} · {Math.round(100 * (cumAcc[c - 1] ?? 0))}%
            </span>
          ))}
        </div>
      )}
    </div>
  );
}