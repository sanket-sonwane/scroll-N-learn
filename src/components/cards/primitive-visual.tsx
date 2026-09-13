"use client";

import dynamic from "next/dynamic";
import type { VisualSpecType } from "@/lib/content/types";

const TokenFlow = dynamic(() =>
  import("@/components/primitives/token-flow").then((m) => m.TokenFlow),
);
const ConnectionGraph = dynamic(() =>
  import("@/components/primitives/connection-graph").then(
    (m) => m.ConnectionGraph,
  ),
);
const AttentionMatrix = dynamic(() =>
  import("@/components/primitives/attention-matrix").then(
    (m) => m.AttentionMatrix,
  ),
);
const GrowthRace = dynamic(() =>
  import("@/components/primitives/growth-race").then((m) => m.GrowthRace),
);
const ArrayRunner = dynamic(() =>
  import("@/components/primitives/array-runner").then((m) => m.ArrayRunner),
);
const GraphVisualizer = dynamic(() =>
  import("@/components/primitives/graph-visualizer").then(
    (m) => m.GraphVisualizer,
  ),
);
const SearchSpace = dynamic(() =>
  import("@/components/primitives/search-space").then((m) => m.SearchSpace),
);
const CurveToLoop = dynamic(() =>
  import("@/components/primitives/curve-to-loop").then((m) => m.CurveToLoop),
);
const RulesBreak = dynamic(() =>
  import("@/components/primitives/rules-break").then((m) => m.RulesBreak),
);
const ExampleStream = dynamic(() =>
  import("@/components/primitives/example-stream").then((m) => m.ExampleStream),
);

type PrimitiveVisualProps = {
  visual: VisualSpecType;
  active: boolean;
  playKey: number;
  onInteract?: () => void;
  className?: string;
  arrayOverride?: number[];
  runKey?: number;
};

export function PrimitiveVisual({
  visual,
  active,
  playKey,
  onInteract,
  className = "",
  arrayOverride,
  runKey,
}: PrimitiveVisualProps) {
  const { kind, config } = visual;

  switch (kind) {
    case "tokenFlow":
      return (
        <div className={`mx-auto w-full max-w-md ${className}`}>
          <TokenFlow
            key={playKey}
            config={config as never}
            active={active}
            playKey={playKey}
            className="h-32 text-foreground sm:h-36"
          />
        </div>
      );
    case "connectionGraph":
      return (
        <div className={`mx-auto w-full max-w-md ${className}`}>
          <ConnectionGraph
            key={playKey}
            config={config as never}
            active={active}
            playKey={playKey}
            onInteract={onInteract}
            className="mx-auto h-64 max-h-[46vh] text-foreground sm:h-72"
          />
        </div>
      );
    case "attentionMatrix":
      return (
        <div className={`mx-auto w-full ${className}`}>
          <AttentionMatrix
            key={playKey}
            config={config as never}
            active={active}
            playKey={playKey}
            className="text-foreground"
          />
        </div>
      );
    case "growthRace":
      return (
        <div className={`mx-auto w-full ${className}`}>
          <GrowthRace
            key={playKey}
            config={config as never}
            active={active}
            playKey={playKey}
            onInteract={onInteract}
            className="text-foreground"
          />
        </div>
      );
    case "arrayRunner":
      return (
        <div className={`mx-auto w-full ${className}`}>
          <ArrayRunner
            key={playKey}
            config={config as never}
            active={active}
            playKey={playKey}
            onInteract={onInteract}
            arrayOverride={arrayOverride}
            runKey={runKey}
            className="text-foreground"
          />
        </div>
      );
    case "graphVisual":
      return (
        <div className={`mx-auto w-full ${className}`}>
          <GraphVisualizer
            key={playKey}
            config={config as never}
            active={active}
            playKey={playKey}
            onInteract={onInteract}
            className="text-foreground"
          />
        </div>
      );
    case "searchSpace":
      return (
        <div className={`mx-auto w-full ${className}`}>
          <SearchSpace
            key={playKey}
            config={config as never}
            active={active}
            playKey={playKey}
            className="text-foreground"
          />
        </div>
      );
    case "curveToLoop":
      return (
        <div className={`mx-auto w-full ${className}`}>
          <CurveToLoop
            key={playKey}
            config={config as never}
            active={active}
            playKey={playKey}
            className="text-foreground"
          />
        </div>
      );
    case "rulesBreak":
      return (
        <div className={`mx-auto w-full ${className}`}>
          <RulesBreak
            key={playKey}
            config={config as never}
            active={active}
            playKey={playKey}
            onInteract={onInteract}
            className="text-foreground"
          />
        </div>
      );
    case "exampleStream":
      return (
        <div className={`mx-auto w-full ${className}`}>
          <ExampleStream
            key={playKey}
            config={config as never}
            active={active}
            playKey={playKey}
            onInteract={onInteract}
            className="text-foreground"
          />
        </div>
      );
    default:
      return null;
  }
}