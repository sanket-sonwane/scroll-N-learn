"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import type { RulesBreakConfigType } from "@/lib/content/types";
import { usePrefersReducedMotion } from "@/lib/hooks/use-prefers-reduced-motion";
import { duration, EASE_SOFT } from "@/lib/motion";

type RulesBreakProps = {
  config: RulesBreakConfigType;
  active: boolean;
  playKey: number;
  onInteract?: () => void;
  className?: string;
};

const norm = (s: string) => s.toLowerCase();

const verdictOf = (
  active: string[],
  text: string,
  spam: boolean,
): "blocked" | "slipped" | "passed" | "overblocked" => {
  const caught = active.some((k) => norm(text).includes(norm(k)));
  if (caught && !spam) return "overblocked";
  if (caught) return "blocked";
  return spam ? "slipped" : "passed";
};

const ROW_STYLE: Record<string, string> = {
  blocked: "border-error/40 bg-error/10 text-error",
  slipped: "border-warning/40 bg-warning/10 text-warning",
  overblocked: "border-error/40 bg-error/10 text-error/90",
  passed: "border-success/40 bg-success/10 text-success",
  modelCaught: "border-success/40 bg-success/10 text-success",
  modelMissed: "border-warning/40 bg-warning/10 text-warning",
};

const ROW_BADGE: Record<string, string> = {
  blocked: "✕ rule",
  slipped: "↗ slipped",
  overblocked: "⚠ block",
  passed: "✓ ok",
  modelCaught: "✕ caught",
  modelMissed: "↗ miss",
};

export function RulesBreak({
  config,
  active,
  onInteract,
  className = "",
}: RulesBreakProps) {
  const reduced = usePrefersReducedMotion();
  const { mode, rules, messages, interactive, modelMisses } = config;
  const n = messages.length;
  const spamTotal = messages.filter((m) => m.spam).length;
  const totalSteps = mode === "model" ? n * 2 : n;

  const [toggles, setToggles] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(rules.map((r) => [r.id, r.active ?? true])),
  );
  const [armed, setArmed] = useState(mode === "model");
  const [revealed, setRevealed] = useState(0);

  useEffect(() => {
    if (!armed || reduced) return;
    if (revealed >= totalSteps) return;
    const t = setTimeout(
      () => setRevealed((r) => Math.min(totalSteps, r + 1)),
      revealed === 0 ? 200 : 430,
    );
    return () => clearTimeout(t);
  }, [armed, revealed, totalSteps, reduced]);

  const shownCount = reduced ? totalSteps : revealed;

  const activeKeywords = useMemo(
    () => rules.filter((r) => toggles[r.id] ?? true).map((r) => r.keyword),
    [rules, toggles],
  );

  const ruleVerdicts = useMemo(
    () => messages.map((m) => verdictOf(activeKeywords, m.text, m.spam)),
    [messages, activeKeywords],
  );

  const caught = ruleVerdicts.filter((v) => v === "blocked").length;
  const slipped = ruleVerdicts.filter((v) => v === "slipped").length;
  const over = ruleVerdicts.filter((v) => v === "overblocked").length;
  const modelCaught = messages.filter(
    (m) => m.spam && !(modelMisses?.includes(m.id) ?? false),
  ).length;
  const modelMissed = spamTotal - modelCaught;

  if (!active) return <div className={className} aria-hidden="true" />;

const renderRow = (text: string, verdict: string, delay: number, key: string) => (
    <motion.div
      key={key}
      initial={reduced ? false : { opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{
        delay: reduced ? 0 : delay,
        duration: duration.fast,
        ease: EASE_SOFT,
      }}
      className={`flex items-center gap-2 rounded-md border px-2.5 py-1.5 ${ROW_STYLE[verdict]}`}
    >
      <span className="min-w-0 flex-1 truncate font-mono text-[0.78rem] leading-tight text-foreground/85">
        {text}
      </span>
      <span className="shrink-0 text-[0.62rem] font-semibold">
        {ROW_BADGE[verdict]}
      </span>
    </motion.div>
  );

  const renderBar = (label: string, pct: number, good: boolean) => (
    <div className="flex items-center gap-2">
      <span className="w-12 shrink-0 text-left font-mono text-[0.62rem] text-muted">
        {label}
      </span>
      <div className="h-2 flex-1 overflow-hidden rounded-full bg-surface-2">
        <motion.div
          className={`h-full rounded-full ${good ? "bg-success" : "bg-error"}`}
          initial={{ width: "0%" }}
          animate={{ width: `${Math.max(0, Math.min(100, pct))}%` }}
          transition={{ duration: duration.base, ease: EASE_SOFT }}
        />
      </div>
      <span className="w-9 shrink-0 text-right font-mono text-[0.62rem] tabular-nums text-muted">
        {pct}%
      </span>
    </div>
  );

  if (mode === "model") {
    return (
      <div className={`flex flex-col gap-2.5 ${className}`}>
        <div className="flex items-center justify-between gap-2">
          <span className="text-[0.68rem] font-medium tracking-widest text-faint uppercase">
            your rules
          </span>
          <span className="font-mono text-[0.7rem] tabular-nums text-muted">
            {caught} caught · {slipped} slipped{over ? ` · ${over} overblocked` : ""}
          </span>
        </div>
        <div className="overflow-hidden rounded-xl border border-edge bg-surface/40">
          <div className="flex flex-col gap-1.5 p-2.5">
            {messages.map((m, i) =>
              shownCount > i
                ? renderRow(m.text, ruleVerdicts[i], i * 0.26, `a-${m.id}`)
                : null,
            )}
            {revealed === 0 && (
              <p className="py-2 text-center text-[0.7rem] text-faint">waiting…</p>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between gap-2">
          <span className="text-[0.68rem] font-medium tracking-widest text-ai uppercase">
            model · learned pattern
          </span>
          <span className="font-mono text-[0.7rem] tabular-nums text-muted">
            {modelCaught} caught · {modelMissed} missed
          </span>
        </div>
        <div className="overflow-hidden rounded-xl border border-ai/40 bg-surface/40">
          <div className="flex flex-col gap-1.5 p-2.5">
            {messages.map((m, i) => {
              const verdict = m.spam
                ? modelMisses?.includes(m.id)
                  ? "modelMissed"
                  : "modelCaught"
                : "passed";
              return shownCount > n + i
                ? renderRow(m.text, verdict, i * 0.22, `b-${m.id}`)
                : null;
            })}
          </div>
        </div>

        {shownCount >= totalSteps && (
          <div className="flex flex-col gap-2">
            {renderBar("rules", Math.round((caught / spamTotal) * 100), false)}
            {renderBar("model", Math.round((modelCaught / spamTotal) * 100), true)}
          </div>
        )}
      </div>
    );
  }

return (
    <div className={`flex flex-col gap-2.5 ${className}`}>
      {interactive && (
        <div className="rounded-xl border border-edge bg-surface/50 px-3 py-2">
          <p className="mb-1.5 text-[0.6rem] tracking-widest text-faint uppercase">
            your rules — tap to toggle
          </p>
          <div className="flex flex-wrap gap-1.5">
            {rules.map((r) => {
              const on = toggles[r.id] ?? true;
              return (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => {
                    setToggles((prev) => ({
                      ...prev,
                      [r.id]: !(prev[r.id] ?? true),
                    }));
                    setArmed(false);
                    setRevealed(0);
                    onInteract?.();
                  }}
                  className={`rounded-full border px-2.5 py-1 font-mono text-[0.7rem] transition-colors ${
                    on
                      ? "border-info/50 bg-info/10 text-info"
                      : "border-edge-strong bg-surface/60 text-muted line-through"
                  }`}
                >
                  {r.label}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="flex items-center justify-between gap-2">
        <span className="font-mono text-[0.7rem] tabular-nums text-muted">
          {caught} caught · {slipped} slipped{over ? ` · ${over} honest email blocked` : ""}
        </span>
        {interactive && !armed && (
          <button
            type="button"
            onClick={() => {
              setArmed(true);
              onInteract?.();
            }}
            className="h-8 shrink-0 rounded-full bg-foreground px-4 font-mono text-xs font-semibold text-background transition-colors hover:bg-white/90"
          >
            run attack
          </button>
        )}
        {armed && shownCount < totalSteps && (
          <span className="shrink-0 font-mono text-[0.7rem] text-faint animate-pulse">
            checking…
          </span>
        )}
      </div>

      <div className="overflow-hidden rounded-xl border border-edge bg-surface/40">
        <div className="flex flex-col gap-1.5 p-2.5">
          {revealed === 0 && !armed && (
            <p className="py-3 text-center text-[0.75rem] text-faint">
              press run attack — messages slide through your rules
            </p>
          )}
          {messages.map((m, i) =>
            shownCount > i ? renderRow(m.text, ruleVerdicts[i], i * 0.3, m.id) : null,
          )}
        </div>
      </div>
    </div>
  );
}