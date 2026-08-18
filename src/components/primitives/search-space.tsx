"use client";

import { useMemo } from "react";
import { motion } from "motion/react";
import type { SearchSpaceConfigType } from "@/lib/content/types";
import { usePrefersReducedMotion } from "@/lib/hooks/use-prefers-reduced-motion";
import { duration } from "@/lib/motion";

const W = 300;
const H = 190;
const TOP = 18;
const LEVEL_GAP = 26;

type SearchSpaceProps = {
  config: SearchSpaceConfigType;
  active: boolean;
  playKey: number;
  className?: string;
};

export function SearchSpace({ config, className = "" }: SearchSpaceProps) {
  const reduced = usePrefersReducedMotion();
  const { levels, branches, label } = config;

  const nodes = useMemo(() => {
    const out: { id: string; x: number; y: number; level: number }[] = [];
    const root = { id: "0", x: W / 2, y: TOP, level: 0 };
    out.push(root);
    const grow = (node: { id: string; x: number; y: number; level: number }, path: number) => {
      if (node.level >= levels - 1) return;
      const y = TOP + (node.level + 1) * LEVEL_GAP;
      const step = W / Math.max(1, Math.pow(branches, node.level + 1));
      for (let b = 0; b < branches; b++) {
        const childIdx = path * branches + b;
        const x = step / 2 + step * childIdx;
        const child = { id: `${node.id}-${b}`, x, y, level: node.level + 1 };
        out.push(child);
        grow(child, childIdx);
      }
    };
    grow(root, 0);
    return out;
  }, [levels, branches]);

  const leafCount = Math.pow(branches, levels - 1);
  const byLevel = useMemo(() => {
    const m = new Map<number, typeof nodes>();
    for (const n of nodes) {
      m.set(n.level, [...(m.get(n.level) ?? []), n]);
    }
    return m;
  }, [nodes]);

  const edges: { from: typeof nodes[0]; to: typeof nodes[0] }[] = [];
  const parentOf = (id: string) => id.slice(0, id.lastIndexOf("-"));
  for (const n of nodes) {
    if (n.level === 0) continue;
    const pid = parentOf(n.id);
    const parent = nodes.find((p) => p.id === pid);
    if (parent) edges.push({ from: parent, to: n });
  }

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <div className="relative overflow-hidden rounded-2xl border border-edge bg-surface/50">
        <svg viewBox={`0 0 ${W} ${H}`} className="block h-auto w-full" role="img" aria-label="A search space that branches and grows">
          {edges.map((e, i) => {
            const order = i;
            return (
              <motion.line
                key={`${e.from.id}-${e.to.id}`}
                x1={e.from.x}
                y1={e.from.y + 4}
                x2={e.to.x}
                y2={e.to.y - 6}
                stroke="rgba(167,139,250,0.3)"
                strokeWidth={1}
                initial={reduced ? { opacity: 1 } : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.15, delay: reduced ? 0 : 0.05 * order }}
              />
            );
          })}
          {nodes.map((n) => {
            const idxInLevel = byLevel.get(n.level)!.indexOf(n);
            return (
              <motion.g
                key={n.id}
                transform={`translate(${n.x} ${n.y})`}
                initial={reduced ? { opacity: 1 } : { opacity: 0, scale: 0.2 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: 0.2,
                  delay: reduced ? 0 : n.level * 0.14 + idxInLevel * 0.004,
                }}
              >
                <circle r={3} fill="var(--color-ai)" />
              </motion.g>
            );
          })}
          <motion.text
            x={W / 2}
            y={H - 8}
            textAnchor="middle"
            fontSize={10}
            fill="rgba(255,255,255,0.55)"
            fontFamily="var(--font-geist-mono)"
            initial={reduced ? { opacity: 1 } : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: reduced ? 0 : 0.6 + levels * 0.14, duration: duration.base }}
          >
            {label ?? `${leafCount.toLocaleString()} possible routes`}
          </motion.text>
        </svg>
      </div>
    </div>
  );
}