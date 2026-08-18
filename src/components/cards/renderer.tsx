"use client";

import type { Card } from "@/lib/content/types";
import { HookCard } from "@/components/cards/hook-card";
import { ConceptCard } from "@/components/cards/concept-card";
import { VisualCard } from "@/components/cards/visual-card";
import { ChoiceCard } from "@/components/cards/choice-card";
import { ConceptMapCard } from "@/components/cards/concept-map-card";
import { ExecutionCard } from "@/components/cards/execution-card";
import { GraphCard } from "@/components/cards/graph-card";
import { ChallengeCard } from "@/components/cards/challenge-card";
import { ComparisonCard } from "@/components/cards/comparison-card";
import { EquationCard } from "@/components/cards/equation-card";

type CardRendererProps = {
  card: Card;
  active: boolean;
  onAnswer?: (cardId: string, correct: boolean) => void;
  onReplay?: (cardId: string) => void;
  onInteract?: (cardId: string) => void;
  onRank?: (cardId: string, correct: boolean) => void;
};

export function CardRenderer({
  card,
  active,
  onAnswer,
  onReplay,
  onInteract,
  onRank,
}: CardRendererProps) {
  switch (card.type) {
    case "hook":
      return <HookCard card={card} />;
    case "concept":
      return <ConceptCard card={card} active={active} />;
    case "visual":
    case "simulation":
      return (
        <VisualCard
          card={card}
          active={active}
          onReplay={onReplay}
          onInteract={onInteract}
        />
      );
    case "prediction":
    case "quiz":
      return <ChoiceCard card={card} onAnswer={onAnswer} />;
    case "concept_map":
      return <ConceptMapCard card={card} />;
    case "execution":
      return (
        <ExecutionCard
          card={card}
          active={active}
          onReplay={onReplay}
          onInteract={onInteract}
        />
      );
    case "graph":
      return (
        <GraphCard card={card} active={active} onInteract={onInteract} />
      );
    case "challenge":
      return <ChallengeCard card={card} onInteract={onInteract} />;
    case "comparison":
      return <ComparisonCard card={card} onInteract={onInteract} onRank={onRank} />;
    case "equation":
      return <EquationCard card={card} />;
    default:
      return null;
  }
}