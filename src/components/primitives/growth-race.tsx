"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { animate, motion } from "motion/react";
import type { GrowthFn, GrowthRaceConfigType } from "@/lib/content/types";
import {
  growthValue,
  growthLog10,
  GROWTH_COLORS,
  GROWTH_LABELS,
  isExplosive,
  formatOps,
  formatN,
} from "@/lib/growth";
import { usePrefersReducedMotion } from "@/lib/hooks/use-prefers-reduced-motion";
import { EASE_SOFT } from "@/lib/motion";

const W = 320;
const H = 200;
const PAD = { l: 10, r: 16, t: 14, b: 20 };
const PW = W - PAD.l - PAD.r;
const PH = H - PAD.t - PAD.b;
const SAMPLES = 56;
const N_MAX_CLAMP = 1e18;

type GrowthRaceProps = {
  config: GrowthRaceConfigType;
  active: boolean;
  playKey: number;
  onInteract?: () => void;
  className?: string;
};

export function GrowthRace({
  config,
  active,
  playKey,
  onInteract,
  className = "",
}: GrowthRaceProps) {
  const reduced = usePrefersReducedMotion();
  const { display, functions, initialN, maxN, interactive, leaveFrame, steps, label } = config;

  const refs = useMemo(() => functions.filter((f) => !isExplosive(f)), [functions]);
  const explosives = useMemo(() => functions.filter(isExplosive), [functions]);

  const [n, setN] = useState(initialN);
  const [zoomed, setZoomed] = useState(false);
  const nRef = useRef(initialN);
  useEffect(() => {
    nRef.current = n;
  }, [n]);

  const runSweep = useCallback(() => {
    if (reduced) {
      setN(maxN);
      return;
    }
    setZoomed(false);
    animate(nRef.current, maxN, {
      duration: 2.8,
      ease: EASE_SOFT,
      onUpdate: (v) => {
        setN(v);
        if (leaveFrame && v >= maxN * 0.9 && explosives.length > 0) {
          setZoomed(true);
        }
      },
    });
  }, [reduced, maxN, leaveFrame, explosives.length]);

  useEffect(() => {
    if (interactive) return;
    const id = requestAnimationFrame(() => runSweep());
    return () => cancelAnimationFrame(id);
  }, [playKey, interactive, runSweep]);

  if (display === "universe") {
    return (
      <div className={`flex flex-col ${className}`}>
        <GrowthUniverse functions={functions} maxN={maxN} reduced={reduced} />
      </div>
    );
  }

  const xOf = (ni: number) => PAD.l + ((ni - 1) / (maxN - 1)) * PW;
  const ceilingAt = (ni: number) =>
    refs.length ? Math.max(...refs.map((f) => growthValue(f, ni))) : 1;
  const yRef = (v: number, ni: number) => PAD.t + (1 - v / ceilingAt(ni)) * PH;

  const refCeilingMax = refs.length
    ? Math.max(...refs.map((f) => growthValue(f, maxN)))
    : 1;
  const yExplosive = (v: number) => PAD.t + (1 - v / refCeilingMax) * PH;

  const buildPath = (fn: GrowthFn): string => {
    let d = "";
    for (let i = 0; i < SAMPLES; i++) {
      const ni = 1 + (i / (SAMPLES - 1)) * (maxN - 1);
      const v = growthValue(fn, ni);
      if (!isFinite(v) || v > N_MAX_CLAMP) break;
      const x = xOf(ni);
      const y = isExplosive(fn) ? yExplosive(v) : yRef(v, ni);
      d += `${i === 0 ? "M" : "L"}${x.toFixed(2)} ${y.toFixed(2)} `;
    }
    return d;
  };

  const dot = (fn: GrowthFn) => {
    const v = growthValue(fn, n);
    const x = xOf(n);
    const y = isExplosive(fn) ? yExplosive(v) : yRef(v, n);
    return { x, y, off: y < PAD.t + 2 };
  };

  const scanX = xOf(n);
  const showOffChart = explosives.some((f) => dot(f).off);

  return (
    <div className={`flex flex-col ${className}`}>
      <div className="flex items-baseline justify-between px-0.5">
        <span className="font-mono text-xs text-muted">{label ?? "operations"}</span>
        <span className="font-mono text-base font-semibold text-foreground tabular-nums">
          n = {formatN(n)}
        </span>
      </div>

      <div className="relative mt-2 overflow-hidden rounded-2xl border border-edge bg-surface/50">
        <motion.svg
          viewBox={`0 0 ${W} ${H}`}
          className="block h-auto w-full"
          animate={zoomed ? { scale: 0.42, y: 8 } : { scale: 1, y: 0 }}
          transition={{ duration: 1.2, ease: EASE_SOFT }}
          style={{ transformOrigin: "50% 0%" }}
          role="img"
          aria-label="Growth curves racing as input size grows"
        >
          <defs>
            <clipPath id="plot">
              <rect x={PAD.l} y={PAD.t} width={PW} height={PH} />
            </clipPath>
          </defs>

          {[0.25, 0.5, 0.75, 1].map((f) => (
            <line
              key={f}
              x1={PAD.l}
              x2={W - PAD.r}
              y1={PAD.t + PH * (1 - f)}
              y2={PAD.t + PH * (1 - f)}
              stroke="rgba(255,255,255,0.06)"
              strokeWidth={1}
              strokeDasharray="3 4"
            />
          ))}

          <g clipPath="url(#plot)">
            {refs.map((fn) => (
              <path
                key={fn}
                d={buildPath(fn)}
                fill="none"
                stroke={GROWTH_COLORS[fn]}
                strokeWidth={2}
                opacity={0.9}
              />
            ))}
            {explosives.map((fn) => (
              <path
                key={fn}
                d={buildPath(fn)}
                fill="none"
                stroke={GROWTH_COLORS[fn]}
                strokeWidth={2}
                strokeDasharray="5 4"
                opacity={0.95}
              />
            ))}
          </g>

          <line
            x1={scanX}
            x2={scanX}
            y1={PAD.t}
            y2={H - PAD.b}
            stroke="rgba(255,255,255,0.28)"
            strokeWidth={1}
          />

          {refs.map((fn) => {
            const { x, y } = dot(fn);
            return (
              <circle
                key={fn}
                cx={x}
                cy={y}
                r={3.5}
                fill={GROWTH_COLORS[fn]}
                stroke="#0a0b0f"
                strokeWidth={1}
              />
            );
          })}
          {explosives.map((fn) => {
            const d = dot(fn);
            if (!d.off) {
              return (
                <circle
                  key={fn}
                  cx={d.x}
                  cy={d.y}
                  r={3.5}
                  fill={GROWTH_COLORS[fn]}
                  stroke="#0a0b0f"
                  strokeWidth={1}
                />
              );
            }
            return (
              <g key={fn} pointerEvents="none">
                <path
                  d={`M${d.x} ${PAD.t + 6} l-5 -6 l10 0 Z`}
                  fill={GROWTH_COLORS[fn]}
                />
                <text
                  x={d.x}
                  y={PAD.t - 2}
                  textAnchor="middle"
                  fontSize={9}
                  fill={GROWTH_COLORS[fn]}
                  fontFamily="var(--font-geist-mono)"
                >
                  ∞
                </text>
              </g>
            );
          })}

          <text
            x={W - PAD.r}
            y={H - 6}
            textAnchor="end"
            fontSize={9}
            fill="rgba(255,255,255,0.4)"
            fontFamily="var(--font-geist-mono)"
          >
            n →
          </text>
        </motion.svg>

        <AnimatePresenceMinimal
          show={showOffChart && (leaveFrame || !interactive)}
          color={explosives[0] ? GROWTH_COLORS[explosives[0]] : "#f87171"}
          label={
            explosives.length > 0 ? `${GROWTH_LABELS[explosives[0]]} — off the chart` : ""
          }
        />
      </div>

      <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 px-0.5">
        {functions.map((fn) => (
          <span
            key={fn}
            className="flex items-center gap-1.5 font-mono text-[0.68rem] text-muted"
          >
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ backgroundColor: GROWTH_COLORS[fn] }}
            />
            {GROWTH_LABELS[fn]}
          </span>
        ))}
      </div>

      {interactive && (
        <div className="mt-3 flex flex-col gap-2.5">
          <input
            type="range"
            aria-label="Input size"
            min={2}
            max={maxN}
            step={1}
            value={Math.min(maxN, Math.max(2, Math.round(n)))}
            onChange={(e) => {
              setN(Number(e.target.value));
              onInteract?.();
            }}
            className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-surface-2 accent-[#5b9bff]"
          />
          <div className="flex items-center justify-between gap-2">
            <div className="flex gap-1.5">
              {(steps ?? []).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => {
                    setN(s);
                    onInteract?.();
                  }}
                  className={`rounded-full border px-2.5 py-1 font-mono text-[0.68rem] transition-colors ${
                    n >= s * 0.99 && n <= s * 1.01
                      ? "border-info/50 bg-info/15 text-info"
                      : "border-edge text-muted hover:text-foreground"
                  }`}
                >
                  {formatN(s)}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => {
                runSweep();
                onInteract?.();
              }}
              className="flex items-center gap-1.5 rounded-full border border-edge bg-surface/80 px-3 py-1 font-mono text-[0.68rem] text-foreground transition-colors hover:border-edge-strong"
            >
              ▶ run
            </button>
          </div>
        </div>
      )}

      {!interactive && active && (
        <button
          type="button"
          onClick={onInteract}
          className="mt-2 self-start text-[0.68rem] font-medium tracking-widest text-faint uppercase transition-colors hover:text-muted"
        >
          ↻ replay race
        </button>
      )}
    </div>
  );
}

function AnimatePresenceMinimal({
  show,
  color,
  label,
}: {
  show: boolean;
  color: string;
  label: string;
}) {
  return (
    <motion.div
      initial={false}
      animate={show ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }}
      transition={{ duration: 0.5, ease: EASE_SOFT }}
      className="pointer-events-none absolute top-2 left-1/2 -translate-x-1/2 rounded-full border px-3 py-1 font-mono text-[0.68rem] font-medium backdrop-blur"
      style={{ borderColor: `${color}55`, backgroundColor: "rgba(10,11,15,0.72)", color }}
    >
      {label}
    </motion.div>
  );
}

function GrowthUniverse({
  functions,
  maxN,
  reduced,
}: {
  functions: GrowthFn[];
  maxN: number;
  reduced: boolean;
}) {
  const maxLog = useMemo(
    () => Math.max(...functions.map((f) => growthLog10(f, maxN))),
    [functions, maxN],
  );
  const xOf = (ni: number) => PAD.l + ((ni - 1) / (maxN - 1)) * PW;
  const yOf = (logV: number) => PAD.t + (1 - logV / maxLog) * PH;

  const paths = functions.map((fn) => {
    let d = "";
    for (let i = 0; i < SAMPLES; i++) {
      const ni = 1 + (i / (SAMPLES - 1)) * (maxN - 1);
      const lv = growthLog10(fn, ni);
      const y = yOf(lv);
      const x = xOf(ni);
      d += `${i === 0 ? "M" : "L"}${x.toFixed(2)} ${y.toFixed(2)} `;
    }
    const endY = yOf(growthLog10(fn, maxN));
    return { fn, d, endX: xOf(maxN), endY };
  });

  return (
    <div className="flex flex-col gap-1.5">
      <div className="overflow-hidden rounded-2xl border border-edge bg-surface/50">
        <svg viewBox={`0 0 ${W} ${H}`} className="block h-auto w-full" role="img" aria-label="The complexity universe">
          <defs>
            <clipPath id="universe-plot">
              <rect x={PAD.l} y={PAD.t} width={PW} height={PH} />
            </clipPath>
          </defs>
          {[0.25, 0.5, 0.75, 1].map((f) => (
            <line
              key={f}
              x1={PAD.l}
              x2={W - PAD.r}
              y1={PAD.t + PH * (1 - f)}
              y2={PAD.t + PH * (1 - f)}
              stroke="rgba(255,255,255,0.06)"
              strokeWidth={1}
              strokeDasharray="3 4"
            />
          ))}
          <g clipPath="url(#universe-plot)">
            {paths.map((p, idx) => (
              <motion.path
                key={p.fn}
                d={p.d}
                fill="none"
                stroke={GROWTH_COLORS[p.fn]}
                strokeWidth={2}
                initial={reduced ? { opacity: 1 } : { pathLength: 0, opacity: 0.4 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: reduced ? 0 : 0.7, ease: EASE_SOFT, delay: idx * 0.12 }}
              />
            ))}
          </g>
          {paths.map((p) => (
            <g key={`${p.fn}-label`}>
              <motion.text
                x={Math.min(p.endX + 4, W - PAD.r - 2)}
                y={p.endY + 3}
                fontSize={9}
                fill={GROWTH_COLORS[p.fn]}
                fontFamily="var(--font-geist-mono)"
                initial={reduced ? { opacity: 1 } : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: reduced ? 0 : 0.6 + p.fn.length * 0.1, duration: 0.3 }}
              >
                {GROWTH_LABELS[p.fn]}
              </motion.text>
            </g>
          ))}
        </svg>
      </div>
      <p className="px-0.5 font-mono text-[0.68rem] text-muted">
        log scale · {formatOps(growthValue(functions[functions.length - 1], Math.min(maxN, 12)))} ops at n≈{Math.min(maxN, 12)}
      </p>
    </div>
  );
}