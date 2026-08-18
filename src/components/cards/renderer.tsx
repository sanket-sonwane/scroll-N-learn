"use client";

import type { Card } from "@/lib/content/types";
import { HookCard } from "@/components/cards/hook-card";
import { ConceptCard } from "@/components/cards/concept-card";
import { VisualCard } from "@/components/cards/visual-card";
import { ChoiceCard } from "@/components/cards/choice-card";
import { ConceptMapCard } from "@/components/cards/concept-map-card";

type CardRendererProps = {
  card: Card;
  active: boolean;
  onAnswer?: (cardId: string, correct: boolean) => void;
  onReplay?: (cardId: string) => void;
  onInteract?: (cardId: string) => void;
};

export function CardRenderer({
  card,
  active,
  onAnswer,
  onReplay,
  onInteract,
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
    default:
      return null;
  }
}