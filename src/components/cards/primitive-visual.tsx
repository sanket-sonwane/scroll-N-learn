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

type PrimitiveVisualProps = {
  visual: VisualSpecType;
  active: boolean;
  playKey: number;
  onInteract?: () => void;
  className?: string;
};

export function PrimitiveVisual({
  visual,
  active,
  playKey,
  onInteract,
  className = "",
}: PrimitiveVisualProps) {
  const { kind, config } = visual;

  if (kind === "tokenFlow") {
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
  }

  if (kind === "connectionGraph") {
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
  }

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
}