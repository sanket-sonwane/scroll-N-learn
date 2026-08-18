"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { motion } from "motion/react";
import { usePrefersReducedMotion } from "@/lib/hooks/use-prefers-reduced-motion";
import { duration, EASE_SOFT } from "@/lib/motion";

type Node = {
  id: string;
  label: string;
  kind?: "token" | "query" | "key" | "value" | "target";
  x: number;
  y: number;
};

type Edge = { source: string; target: string; weight: number };

type ConnectionGraphProps = {
  config: {
    nodes: Node[];
    edges: Edge[];
    interactive?: {
      draggableNode: string;
      title: string;
      hint: string;
    };
  };
  active: boolean;
  playKey: number;
  onInteract?: () => void;
  className?: string;
};

const RADIUS: Record<string, number> = {
  token: 3.4,
  key: 3.8,
  query: 4.6,
  target: 4.2,
  value: 3.8,
};

const FILL: Record<string, string> = {
  token: "rgba(255,255,255,0.08)",
  key: "rgba(91,155,255,0.12)",
  query: "rgba(167,139,250,0.2)",
  target: "rgba(52,211,153,0.16)",
  value: "rgba(91,155,255,0.12)",
};

const STROKE: Record<string, string> = {
  token: "rgba(255,255,255,0.28)",
  key: "rgba(91,155,255,0.55)",
  query: "rgba(167,139,250,0.85)",
  target: "rgba(52,211,153,0.7)",
  value: "rgba(91,155,255,0.4)",
};

function edgeWeight(a: { x: number; y: number }, b: { x: number; y: number }) {
  const d = Math.hypot(a.x - b.x, a.y - b.y);
  return Math.max(0, Math.min(1, Math.exp(-d / 22)));
}

export function ConnectionGraph({
  config,
  active,
  playKey,
  onInteract,
  className = "",
}: ConnectionGraphProps) {
  const reduced = usePrefersReducedMotion();
  const interactive = config.interactive;
  const draggableId = interactive?.draggableNode;

  const [positions, setPositions] = useState<Record<string, { x: number; y: number }>>(
    () => Object.fromEntries(config.nodes.map((n) => [n.id, { x: n.x, y: n.y }])),
  );

  const svgRef = useRef<SVGSVGElement | null>(null);
  const draggingRef = useRef(false);
  const reportedRef = useRef(false);

  const { edgeWeights, topMatch } = useMemo(() => {
    const edgeWeights = new Map<string, number>();
    for (const edge of config.edges) {
      const from = positions[edge.source];
      const to = positions[edge.target];
      if (!from || !to) continue;
      const involvesDrag =
        draggableId &&
        (edge.source === draggableId || edge.target === draggableId);
      edgeWeights.set(
        `${edge.source}|${edge.target}`,
        involvesDrag ? edgeWeight(from, to) : edge.weight,
      );
    }

    let topMatch: string | null = null;
    if (draggableId) {
      const q = positions[draggableId];
      if (q) {
        let best: string | null = null;
        let bestW = -1;
        for (const n of config.nodes) {
          if (n.id === draggableId) continue;
          const p = positions[n.id];
          if (!p) continue;
          const w = edgeWeight(q, p);
          if (w > bestW) {
            bestW = w;
            best = n.id;
          }
        }
        topMatch = best;
      }
    }
    return { edgeWeights, topMatch };
  }, [positions, config.edges, config.nodes, draggableId]);

  const toLocal = useCallback((clientX: number, clientY: number) => {
    const svg = svgRef.current;
    if (!svg) return null;
    const ctm = svg.getScreenCTM();
    if (!ctm) return null;
    const pt = new DOMPoint(clientX, clientY).matrixTransform(ctm.inverse());
    return { x: pt.x, y: pt.y };
  }, []);

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (!draggableId) return;
      const local = toLocal(e.clientX, e.clientY);
      if (!local) return;
      e.preventDefault();
      e.stopPropagation();
      draggingRef.current = true;
      (e.target as Element).setPointerCapture?.(e.pointerId);
    },
    [draggableId, toLocal],
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!draggableId || !draggingRef.current) return;
      const local = toLocal(e.clientX, e.clientY);
      if (!local) return;
      e.preventDefault();
      if (!reportedRef.current) {
        reportedRef.current = true;
        onInteract?.();
      }
      const clamped = {
        x: Math.max(4, Math.min(96, local.x)),
        y: Math.max(4, Math.min(96, local.y)),
      };
      setPositions((prev) => ({ ...prev, [draggableId]: clamped }));
    },
    [draggableId, toLocal, onInteract],
  );

  const onPointerUp = useCallback(() => {
    draggingRef.current = false;
  }, []);

  const drawIn = (i: number): React.ComponentProps<typeof motion.path> =>
    reduced
      ? { initial: false, animate: { pathLength: 1, opacity: 1 } }
      : {
          initial: { pathLength: 0, opacity: 0 },
          animate: { pathLength: 1, opacity: 1 },
          transition: {
            delay: 0.3 + i * 0.16,
            duration: duration.base,
            ease: EASE_SOFT,
          },
        };

  if (!active) {
    return (
      <svg viewBox="0 0 100 100" className={className} aria-hidden="true" />
    );
  }

  const sortedEdges = [...config.edges].sort((a, b) => b.weight - a.weight);

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 100 100"
      className={`block h-full w-full touch-none ${className}`}
      aria-label={
        interactive
          ? "Interactive graph: drag the query token to see attention weights change"
          : "Tokens connected by attention weights"
      }
    >
      {sortedEdges.map((edge, i) => {
        const from = positions[edge.source];
        const to = positions[edge.target];
        if (!from || !to) return null;
        const w = edgeWeights.get(`${edge.source}|${edge.target}`) ?? edge.weight;
        if (w < 0.05) return null;
        const mx = (from.x + to.x) / 2;
        const my = (from.y + to.y) / 2;
        const dx = to.x - from.x;
        const dy = to.y - from.y;
        const len = Math.hypot(dx, dy) || 1;
        const nx = -dy / len;
        const ny = dx / len;
        const isTop =
          interactive && topMatch && (edge.source === topMatch || edge.target === topMatch);
        const d = `M ${from.x} ${from.y} Q ${mx + nx * 3} ${my + ny * 3} ${to.x} ${to.y}`;
        return (
          <motion.path
            key={`${edge.source}-${edge.target}-${playKey}`}
            d={d}
            fill="none"
            stroke={isTop ? "rgba(167,139,250,0.95)" : "currentColor"}
            strokeWidth={isTop ? 1.6 : 0.6 + w * 2.6}
            strokeOpacity={isTop ? 0.95 : 0.22 + w * 0.72}
            strokeLinecap="round"
            style={
              isTop
                ? { filter: "drop-shadow(0 0 4px rgba(167,139,250,0.8))" }
                : undefined
            }
            {...drawIn(i)}
          />
        );
      })}

      {config.nodes.map((node, i) => {
        const pos = positions[node.id];
        if (!pos) return null;
        const r = RADIUS[node.kind ?? "token"];
        const isDraggable = node.id === draggableId;
        const isTop = node.id === topMatch && interactive;
        return (
          <motion.g
            key={`${node.id}-${playKey}`}
            initial={
              reduced
                ? { opacity: 1 }
                : { opacity: 0, scale: 0.5, transformOrigin: `${pos.x}px ${pos.y}px` }
            }
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              delay: reduced ? 0 : 0.2 + i * 0.1,
              duration: duration.base,
              ease: EASE_SOFT,
            }}
          >
            {isTop && (
              <motion.circle
                cx={pos.x}
                cy={pos.y}
                r={r + 2.2}
                fill="none"
                stroke="rgba(167,139,250,0.8)"
                strokeWidth={0.5}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, scale: [1, 1.2, 1] }}
                transition={{ duration: 0.9, repeat: Infinity, ease: "easeInOut" }}
              />
            )}
            <circle
              cx={pos.x}
              cy={pos.y}
              r={r}
              fill={FILL[node.kind ?? "token"]}
              stroke={
                isDraggable ? "rgba(167,139,250,0.9)" : STROKE[node.kind ?? "token"]
              }
              strokeWidth={isDraggable ? 0.9 : 0.5}
              style={{
                cursor: isDraggable ? "grab" : undefined,
                filter:
                  isDraggable || isTop
                    ? "drop-shadow(0 0 6px rgba(167,139,250,0.6))"
                    : undefined,
              }}
              onPointerDown={isDraggable ? onPointerDown : undefined}
              onPointerMove={isDraggable ? onPointerMove : undefined}
              onPointerUp={isDraggable ? onPointerUp : undefined}
              onPointerCancel={isDraggable ? onPointerUp : undefined}
            />
            <text
              x={pos.x}
              y={pos.y + r + 3}
              textAnchor="middle"
              fontSize={node.kind === "query" ? 4 : 3.3}
              fontWeight={node.kind === "query" || isTop ? 600 : 400}
              fill={isDraggable || isTop ? "#d8ccff" : "currentColor"}
              opacity={isDraggable || isTop ? 1 : 0.75}
              style={{ fontFamily: "var(--font-geist-sans)" }}
            >
              {node.label}
            </text>
            {isDraggable && (
              <text
                x={pos.x}
                y={pos.y - r - 2.5}
                textAnchor="middle"
                fontSize={2.8}
                fill="rgba(167,139,250,0.9)"
                style={{ fontFamily: "var(--font-geist-mono)" }}
              >
                drag me
              </text>
            )}
          </motion.g>
        );
      })}
    </svg>
  );
}