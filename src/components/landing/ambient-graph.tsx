"use client";

import { motion } from "motion/react";
import { usePrefersReducedMotion } from "@/lib/hooks/use-prefers-reduced-motion";

const W = 400;
const H = 300;
const NODES = [
  { id: "a", x: 80, y: 60 },
  { id: "b", x: 210, y: 40 },
  { id: "c", x: 320, y: 90 },
  { id: "d", x: 60, y: 180 },
  { id: "e", x: 190, y: 150 },
  { id: "f", x: 330, y: 210 },
  { id: "g", x: 120, y: 250 },
];
const EDGES = [
  ["a", "b"],
  ["b", "c"],
  ["a", "d"],
  ["a", "e"],
  ["b", "e"],
  ["c", "f"],
  ["d", "g"],
  ["e", "g"],
  ["e", "f"],
  ["f", "c"],
];

export function AmbientGraph() {
  const reduced = usePrefersReducedMotion();
  const pos = Object.fromEntries(NODES.map((n) => [n.id, n]));

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <svg
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="xMidYMid slice"
        className="h-full w-full opacity-[0.16]"
      >
        {EDGES.map(([s, t]) => {
          const a = pos[s];
          const b = pos[t];
          return (
            <motion.line
              key={`${s}-${t}`}
              x1={a.x}
              y1={a.y}
              x2={b.x}
              y2={b.y}
              stroke="url(#ambient-edge)"
              strokeWidth={1}
              initial={{ opacity: 0.4 }}
              animate={{ opacity: [0.25, 0.7, 0.25] }}
              transition={
                reduced
                  ? { duration: 0 }
                  : { duration: 6 + ((s.charCodeAt(0) + t.charCodeAt(0)) % 4), repeat: Infinity, ease: "easeInOut" }
              }
            />
          );
        })}
        {NODES.map((n, i) => (
          <motion.circle
            key={n.id}
            cx={n.x}
            cy={n.y}
            r={4}
            fill="#5b9bff"
            initial={{ opacity: 0.5 }}
            animate={{ opacity: [0.35, 0.9, 0.35] }}
            transition={
              reduced
                ? { duration: 0 }
                : { duration: 5 + i, repeat: Infinity, ease: "easeInOut", delay: i * 0.6 }
            }
          />
        ))}
        <defs>
          <linearGradient id="ambient-edge" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#5b9bff" />
            <stop offset="100%" stopColor="#a78bfa" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}