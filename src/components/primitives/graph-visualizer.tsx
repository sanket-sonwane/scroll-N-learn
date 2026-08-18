"use client";

import { useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import type { GraphVisualConfigType } from "@/lib/content/types";
import { usePrefersReducedMotion } from "@/lib/hooks/use-prefers-reduced-motion";
import { duration, EASE_SOFT } from "@/lib/motion";

const W = 300;
const H = 210;

type GraphVisualizerProps = {
  config: GraphVisualConfigType;
  active: boolean;
  playKey: number;
  onInteract?: () => void;
  className?: string;
};

export function GraphVisualizer({
  config,
  playKey,
  onInteract,
  className = "",
}: GraphVisualizerProps) {
  const reduced = usePrefersReducedMotion();
  const { mode, nodes, edges, startNode, minimalSize, coverageTarget } = config;

  const nodeMap = useMemo(() => {
    const m = new Map<string, { x: number; y: number; label: string }>();
    for (const n of nodes) m.set(n.id, { x: (n.x / 100) * W, y: (n.y / 100) * H, label: n.label });
    return m;
  }, [nodes]);

  const adj = useMemo(() => {
    const m = new Map<string, string[]>();
    for (const n of nodes) m.set(n.id, []);
    for (const e of edges) {
      m.get(e.source)?.push(e.target);
      m.get(e.target)?.push(e.source);
    }
    return m;
  }, [nodes, edges]);

  const total = coverageTarget ?? edges.length;

  if (mode === "vertexCover") {
    return (
      <VertexCover
        key={playKey}
        nodes={nodes}
        nodeMap={nodeMap}
        edges={edges}
        total={total}
        minimalSize={minimalSize}
        reduced={reduced}
        onInteract={onInteract}
        className={className}
      />
    );
  }

  if (mode === "hamiltonian") {
    return (
      <Hamiltonian
        key={playKey}
        nodes={nodes}
        nodeMap={nodeMap}
        edges={edges}
        adj={adj}
        start={startNode ?? nodes[0]?.id}
        reduced={reduced}
        onInteract={onInteract}
        className={className}
      />
    );
  }

  return <ShowGraph key={playKey} nodes={nodes} nodeMap={nodeMap} edges={edges} reduced={reduced} className={className} />;
}

type Ctx = {
  nodes: GraphVisualConfigType["nodes"];
  nodeMap: Map<string, { x: number; y: number; label: string }>;
  edges: GraphVisualConfigType["edges"];
  reduced: boolean;
  onInteract?: () => void;
  className?: string;
};

function VertexCover({ nodes, nodeMap, edges, total, minimalSize, reduced, onInteract, className }: Ctx & { total: number; minimalSize?: number }) {
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const covered = edges.filter((e) => selected.has(e.source) || selected.has(e.target)).length;
  const solved = covered >= total;
  const minimal = solved && (minimalSize === undefined || selected.size <= minimalSize);

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
    onInteract?.();
  };

  return (
    <div className={`flex flex-col gap-2.5 ${className ?? ""}`}>
      <div className="relative overflow-hidden rounded-2xl border border-edge bg-surface/50">
        <svg viewBox={`0 0 ${W} ${H}`} className="block h-auto w-full" role="img" aria-label="Vertex cover puzzle graph">
          {edges.map((e, i) => {
            const a = nodeMap.get(e.source)!;
            const b = nodeMap.get(e.target)!;
            const isCovered = selected.has(e.source) || selected.has(e.target);
            return (
              <motion.line
                key={`${e.source}-${e.target}`}
                x1={a.x}
                y1={a.y}
                x2={b.x}
                y2={b.y}
                stroke={isCovered ? "var(--color-success)" : "rgba(255,255,255,0.22)"}
                strokeWidth={isCovered ? 3 : 1.5}
                strokeLinecap="round"
                initial={reduced ? { opacity: 1 } : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.15 + i * 0.08 }}
              />
            );
          })}
          {nodes.map((n, i) => {
            const p = nodeMap.get(n.id)!;
            const isSel = selected.has(n.id);
            return (
              <g key={n.id} transform={`translate(${p.x} ${p.y})`}>
                <motion.g
                  initial={reduced ? { opacity: 1 } : { opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: isSel ? 1.22 : 1 }}
                  transition={{ duration: 0.3, delay: 0.1 + i * 0.06 }}
                  style={{ transformOrigin: "50% 50%" }}
                >
                  <motion.circle
                    r={16}
                    fill={isSel ? "var(--color-success)" : "var(--color-surface)"}
                    stroke={isSel ? "var(--color-success)" : "rgba(255,255,255,0.45)"}
                    strokeWidth={2}
                    animate={{ scale: isSel ? [1, 1.15, 1] : 1 }}
                    transition={{ duration: 0.5, repeat: isSel ? 1 : 0 }}
                    className="cursor-pointer"
                    onPointerDown={(e) => e.stopPropagation()}
                    onClick={() => toggle(n.id)}
                  />
                  <motion.text
                    textAnchor="middle"
                    dy="0.35em"
                    fontSize={11}
                    fontWeight={600}
                    fill={isSel ? "#0a0b0f" : "var(--color-foreground)"}
                    className="pointer-events-none select-none"
                  >
                    {n.label}
                  </motion.text>
                </motion.g>
              </g>
            );
          })}
        </svg>

        <AnimatePresence>
          {solved && (
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className={`absolute top-3 left-1/2 -translate-x-1/2 rounded-full border px-3 py-1 font-mono text-xs font-semibold backdrop-blur ${
                minimal
                  ? "border-success/50 bg-success/15 text-success"
                  : "border-warning/50 bg-warning/15 text-warning"
              }`}
            >
              {minimal
                ? `covered in ${selected.size} — minimal ✓`
                : `covered — but can you do it with fewer?`}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex items-center justify-between px-0.5">
        <span className="font-mono text-[0.68rem] text-muted tabular-nums">
          {covered} / {total} edges covered
        </span>
        <button
          type="button"
          onClick={() => setSelected(new Set())}
          className="font-mono text-[0.68rem] text-faint uppercase transition-colors hover:text-muted"
        >
          reset
        </button>
      </div>
      <p className="px-0.5 text-[0.78rem] leading-relaxed text-muted">
        {selected.size === 0
          ? "Tap nodes. A node covers every edge it touches."
          : solved
            ? minimal
              ? "That's a vertex cover — and it's as small as it gets."
              : "Every edge is touched, but the goal is the fewest nodes."
            : "Every edge must be touched by at least one selected node."}
      </p>
    </div>
  );
}

function Hamiltonian({ nodes, nodeMap, edges, adj, start, reduced, onInteract, className }: Ctx & { adj: Map<string, string[]>; start?: string }) {
  const [path, setPath] = useState<string[]>([]);
  const [invalid, setInvalid] = useState<{ msg: string; key: number } | null>(null);
  const invalidKey = useRef(0);

  const visited = new Set(path);
  const last = path.length ? path[path.length - 1] : null;
  const allVisited = visited.size === nodes.length;
  const isCycle = allVisited && last === start;

  const tap = (id: string) => {
    if (isCycle) return;
    if (path.length === 0) {
      if (id === start) {
        setPath([id]);
        onInteract?.();
      }
      return;
    }
    const prev = last!;
    if (id === prev) return;
    if (visited.has(id)) {
      setInvalid({ msg: "You already visited this vertex.", key: invalidKey.current++ });
      return;
    }
    if (!adj.get(prev)?.includes(id)) {
      setInvalid({ msg: "No edge between these two.", key: invalidKey.current++ });
      return;
    }
    setPath([...path, id]);
    setInvalid(null);
    onInteract?.();
  };

  const pathD = (() => {
    const pts = path.map((id) => nodeMap.get(id)!).filter(Boolean);
    if (pts.length < 2) return "";
    return `M ${pts.map((p) => `${p.x} ${p.y}`).join(" L ")}`;
  })();

  const closing = isCycle && path.length >= 2 && last === start ? ` L ${nodeMap.get(start!)!.x} ${nodeMap.get(start!)!.y}` : "";

  return (
    <div className={`flex flex-col gap-2.5 ${className ?? ""}`}>
      <div className="relative overflow-hidden rounded-2xl border border-edge bg-surface/50">
        <svg viewBox={`0 0 ${W} ${H}`} className="block h-auto w-full" role="img" aria-label="Hamiltonian cycle puzzle graph">
          {edges.map((e, i) => {
            const a = nodeMap.get(e.source)!;
            const b = nodeMap.get(e.target)!;
            return (
              <motion.line
                key={`${e.source}-${e.target}`}
                x1={a.x}
                y1={a.y}
                x2={b.x}
                y2={b.y}
                stroke="rgba(255,255,255,0.16)"
                strokeWidth={1.5}
                strokeLinecap="round"
                initial={reduced ? { opacity: 1 } : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.1 + i * 0.06 }}
              />
            );
          })}

          {pathD && (
            <motion.path
              key={path.join(">")}
              d={pathD + closing}
              fill="none"
              stroke="var(--color-success)"
              strokeWidth={3}
              strokeLinecap="round"
              initial={reduced ? { pathLength: 1 } : { pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.5, ease: EASE_SOFT }}
            />
          )}

          {nodes.map((n, i) => {
            const p = nodeMap.get(n.id)!;
            const isStart = n.id === start;
            const order = path.indexOf(n.id);
            const inPath = order >= 0;
            const isLast = last === n.id && !isCycle;
            return (
              <g key={n.id} transform={`translate(${p.x} ${p.y})`}>
                <motion.g
                  initial={reduced ? { opacity: 1 } : { opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: isLast ? 1.1 : 1 }}
                  transition={{ duration: 0.3, delay: 0.08 + i * 0.05 }}
                  style={{ transformOrigin: "50% 50%" }}
                >
                  <motion.circle
                    r={15}
                    fill={inPath ? "var(--color-success)" : "var(--color-surface)"}
                    stroke={
                      isStart ? "var(--color-warning)" : inPath ? "var(--color-success)" : "rgba(255,255,255,0.45)"
                    }
                    strokeWidth={isLast ? 3 : 2}
                    animate={isLast ? { scale: [1, 1.12, 1] } : { scale: 1 }}
                    transition={{ duration: 0.6, repeat: isLast ? Infinity : 0 }}
                    className="cursor-pointer"
                    onPointerDown={(e) => e.stopPropagation()}
                    onClick={() => tap(n.id)}
                  />
                  <text
                    textAnchor="middle"
                    dy="0.35em"
                    fontSize={11}
                    fontWeight={600}
                    fill={inPath ? "#0a0b0f" : "var(--color-foreground)"}
                    className="pointer-events-none select-none"
                  >
                    {inPath ? order + 1 : n.label}
                  </text>
                  {isStart && !inPath && (
                    <text textAnchor="middle" dy={28} fontSize={8} fill="var(--color-warning)" fontFamily="var(--font-geist-mono)">
                      start
                    </text>
                  )}
                </motion.g>
              </g>
            );
          })}
        </svg>

        <AnimatePresence>
          {invalid && (
            <motion.div
              key={invalid.key}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: duration.fast, ease: EASE_SOFT }}
              className="absolute top-3 left-1/2 -translate-x-1/2 rounded-full border border-error/50 bg-error/15 px-3 py-1 font-mono text-xs text-error backdrop-blur"
            >
              {invalid.msg}
            </motion.div>
          )}
          {isCycle && (
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="absolute top-3 left-1/2 -translate-x-1/2 rounded-full border border-success/50 bg-success/15 px-3 py-1 font-mono text-xs font-semibold text-success backdrop-blur"
            >
              Hamiltonian cycle ✓
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex items-center justify-between px-0.5">
        <span className="font-mono text-[0.68rem] text-muted tabular-nums">
          {visited.size} / {nodes.length} vertices
        </span>
        <button
          type="button"
          onClick={() => {
            setPath([]);
            setInvalid(null);
          }}
          className="font-mono text-[0.68rem] text-faint uppercase transition-colors hover:text-muted"
        >
          clear
        </button>
      </div>
      <p className="px-0.5 text-[0.78rem] leading-relaxed text-muted">
        {path.length === 0
          ? `Start at ${start}. Tap the next vertex — visit every vertex once, then return to ${start}.`
          : invalid
            ? invalid.msg
            : isCycle
              ? "Every vertex visited once. The route closes back to the start."
              : "Keep going — don't revisit a vertex."}
      </p>
    </div>
  );
}

function ShowGraph({ nodes, nodeMap, edges, reduced, className }: Ctx) {
  return (
    <div className={`overflow-hidden rounded-2xl border border-edge bg-surface/50 ${className ?? ""}`}>
      <svg viewBox={`0 0 ${W} ${H}`} className="block h-auto w-full" role="img" aria-label="A graph of nodes and edges">
        {edges.map((e, i) => {
          const a = nodeMap.get(e.source)!;
          const b = nodeMap.get(e.target)!;
          return (
            <motion.line
              key={`${e.source}-${e.target}`}
              x1={a.x}
              y1={a.y}
              x2={b.x}
              y2={b.y}
              stroke="rgba(255,255,255,0.25)"
              strokeWidth={1.5}
              initial={reduced ? { opacity: 1 } : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.2 + i * 0.12 }}
            />
          );
        })}
        {nodes.map((n, i) => {
          const p = nodeMap.get(n.id)!;
          return (
            <g key={n.id} transform={`translate(${p.x} ${p.y})`}>
              <motion.g
                initial={reduced ? { opacity: 1 } : { opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: i * 0.1 }}
                style={{ transformOrigin: "50% 50%" }}
              >
                <circle r={14} fill="var(--color-surface)" stroke="rgba(255,255,255,0.5)" strokeWidth={2} />
                <text textAnchor="middle" dy="0.35em" fontSize={11} fontWeight={600} fill="var(--color-foreground)" className="pointer-events-none select-none">
                  {n.label}
                </text>
              </motion.g>
            </g>
          );
        })}
      </svg>
    </div>
  );
}