"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import type { ArrayRunnerConfigType } from "@/lib/content/types";
import { buildTrace, averageCaseArray } from "@/lib/execution";
import { usePrefersReducedMotion } from "@/lib/hooks/use-prefers-reduced-motion";
import { duration, EASE_SOFT } from "@/lib/motion";

type ArrayRunnerProps = {
  config: ArrayRunnerConfigType;
  active: boolean;
  playKey: number;
  onInteract?: () => void;
  className?: string;
  arrayOverride?: number[];
  runKey?: number;
};

export function ArrayRunner({
  config,
  active,
  playKey,
  onInteract,
  className = "",
  arrayOverride,
  runKey,
}: ArrayRunnerProps) {
  const reduced = usePrefersReducedMotion();
  const { algorithm, mode, flaw, dominantOp, controllable } = config;

  const { array, target, isAverage } = useMemo(() => {
    if (mode === "average") {
      const { array: a } = averageCaseArray(config.array, (playKey ?? 1) + (runKey ?? 0));
      return { array: a, target: config.target ?? 42, isAverage: true };
    }
    return {
      array: arrayOverride ?? config.array,
      target: config.target,
      isAverage: false,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config, arrayOverride, runKey, mode]);

  const trace = useMemo(
    () => buildTrace({ algorithm, array, target, flaw }),
    [algorithm, array, target, flaw],
  );

  const [idx, setIdx] = useState(0);
  const [playing, setPlaying] = useState(true);

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      setIdx(reduced ? trace.steps.length - 1 : 0);
      setPlaying(true);
    });
    return () => cancelAnimationFrame(id);
  }, [playKey, runKey, trace, reduced]);

  useEffect(() => {
    if (!playing) return;
    if (idx >= trace.steps.length - 1) return;
    const t = setTimeout(() => setIdx(idx + 1), 640);
    return () => clearTimeout(t);
  }, [playing, idx, trace.steps.length]);

  const step = trace.steps[Math.min(idx, trace.steps.length - 1)];
  const done = idx >= trace.steps.length - 1;
  const L = array.length;

  const cellClass =
    L > 12
      ? "h-9 w-7 text-[0.65rem]"
      : L > 8
        ? "h-11 w-9 text-sm"
        : "h-12 w-12 text-base sm:h-14 sm:w-14";

  const cellColor = (i: number) => {
    const isPointer = step.pointer === i && !done;
    if (isPointer && step.kind === "update") return "border-success/70 bg-success/15 text-success";
    if (isPointer && step.kind === "compare") return "border-info/70 bg-info/15 text-info";
    if (step.kind === "found" && step.i === i) return "border-success/70 bg-success/15 text-success";
    if (step.kind === "miss" && done && i === trace.steps[0].pointer) return "border-error/60 bg-error/10 text-error/80";
    if (step.kind === "init" && i === step.pointer) return "border-info/60 bg-info/10 text-info";
    if (step.max !== null && algorithm === "findMax" && step.max === array[i] && step.pointer === i)
      return "border-success/60 bg-success/10 text-success";
    return "border-edge bg-surface/70 text-foreground";
  };

  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      <div className="flex flex-col gap-2">
        <div className="flex justify-between px-0.5 font-mono text-[0.68rem] text-muted">
          <span>
            {algorithm === "findMax" ? "find the maximum" : `find ${target}`}
            {mode !== "run" && mode !== "custom" ? ` · ${mode} case` : ""}
          </span>
          <AnimatePresence mode="wait">
            <motion.span
              key={step.message}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="text-foreground/80"
            >
              {step.message}
            </motion.span>
          </AnimatePresence>
        </div>

        <div className="relative">
          <div className="flex flex-wrap justify-center gap-1">
            {array.map((v, i) => (
              <div
                key={`${i}-${v}-${mode}-${isAverage}`}
                className={`flex items-center justify-center rounded-lg border font-mono font-semibold tabular-nums transition-colors duration-200 ${cellClass} ${cellColor(i)}`}
              >
                {v}
              </div>
            ))}
          </div>

          <div className="mt-1.5 flex justify-center">
            {step.pointer >= 0 && !done && (
              <motion.div
                key={step.pointer}
                initial={{ x: -999 }}
                animate={{ x: 0 }}
                transition={{ type: "spring", stiffness: 320, damping: 26 }}
                style={{ transform: "translateX(0)" }}
                className="flex w-12 justify-center"
              >
                <span className="text-info">▲</span>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-stretch justify-center gap-2">
        <StateBox label="i" value={String(step.i)} tone="default" />
        <StateBox
          label={algorithm === "findMax" ? "max" : "target"}
          value={step.max === null ? "—" : String(step.max)}
          tone={step.kind === "update" || step.kind === "found" ? "success" : "default"}
        />
        <StateBox label="comparisons" value={String(step.comparisons)} tone={step.kind === "compare" ? "info" : "default"} />
      </div>

      {dominantOp && (
        <motion.div
          animate={step.kind === "compare" ? { scale: [1, 1.06, 1] } : { scale: 1 }}
          transition={{ duration: 0.5, repeat: step.kind === "compare" ? Infinity : 0 }}
          className="mx-auto rounded-full border border-warning/40 bg-warning/10 px-3 py-1 font-mono text-[0.7rem] text-warning"
        >
          counting: {dominantOp}
        </motion.div>
      )}

      {controllable && (
        <div className="flex items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => {
              if (done) setIdx(0);
              setPlaying((p) => !p);
              onInteract?.();
            }}
            className="flex h-9 items-center gap-1.5 rounded-full border border-edge bg-surface/80 px-4 font-mono text-xs text-foreground transition-colors hover:border-edge-strong"
          >
            {playing ? "❚❚ pause" : "▶ play"}
          </button>
          <button
            type="button"
            onClick={() => {
              setPlaying(false);
              setIdx((i) => Math.min(i + 1, trace.steps.length - 1));
              onInteract?.();
            }}
            className="flex h-9 items-center gap-1.5 rounded-full border border-edge bg-surface/80 px-4 font-mono text-xs text-foreground transition-colors hover:border-edge-strong"
          >
            step
          </button>
        </div>
      )}

      {!controllable && active && done && (
        <button
          type="button"
          onClick={onInteract}
          className="mx-auto text-[0.68rem] font-medium tracking-widest text-faint uppercase transition-colors hover:text-muted"
        >
          ↻ replay
        </button>
      )}
    </div>
  );
}

function StateBox({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "default" | "info" | "success";
}) {
  const color =
    tone === "success"
      ? "text-success border-success/40 bg-success/5"
      : tone === "info"
        ? "text-info border-info/40 bg-info/5"
        : "text-foreground border-edge bg-surface/60";
  return (
    <motion.div
      key={label + value}
      initial={{ opacity: 0.6, y: 2 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: duration.fast, ease: EASE_SOFT }}
      className={`flex min-w-[4.5rem] flex-col items-center gap-0.5 rounded-xl border px-3 py-1.5 ${color}`}
    >
      <span className="font-mono text-[0.6rem] tracking-wider text-muted uppercase">{label}</span>
      <span className="font-mono text-sm font-semibold tabular-nums">{value}</span>
    </motion.div>
  );
}