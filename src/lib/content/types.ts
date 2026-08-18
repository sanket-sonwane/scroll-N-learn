import { z } from "zod";

export const CARD_TYPES = [
  "hook",
  "concept",
  "visual",
  "prediction",
  "quiz",
  "simulation",
  "concept_map",
] as const;

export const RHYTHMS = ["low", "medium", "high"] as const;

const TokenFlowConfig = z.object({
  tokens: z.array(z.string()).min(1),
  predicted: z.string().optional(),
  emphasis: z.array(z.number()).optional(),
});

const ConnectionNode = z.object({
  id: z.string(),
  label: z.string(),
  kind: z.enum(["token", "query", "key", "value", "target"]).optional(),
  x: z.number(),
  y: z.number(),
});

const ConnectionEdge = z.object({
  source: z.string(),
  target: z.string(),
  weight: z.number(),
});

const ConnectionGraphConfig = z.object({
  nodes: z.array(ConnectionNode).min(1),
  edges: z.array(ConnectionEdge),
  interactive: z
    .object({
      draggableNode: z.string(),
      title: z.string(),
      hint: z.string(),
    })
    .optional(),
});

const AttentionMatrixHead = z.object({
  label: z.string(),
  highlights: z.array(z.tuple([z.number(), z.number()])),
});

const AttentionMatrixConfig = z.object({
  tokens: z.array(z.string()).min(2),
  highlights: z.array(z.tuple([z.number(), z.number()])).optional(),
  growToken: z.string().optional(),
  heads: z.array(AttentionMatrixHead).optional(),
});

export const VisualSpec = z.object({
  kind: z.enum(["tokenFlow", "connectionGraph", "attentionMatrix"]),
  config: z.union([
    TokenFlowConfig,
    ConnectionGraphConfig,
    AttentionMatrixConfig,
  ]),
});

const ChoiceOption = z.object({
  label: z.string(),
  correct: z.boolean(),
  explanation: z.string().optional(),
});

const ChoiceInteraction = z.object({
  kind: z.enum(["predict", "quiz"]),
  prompt: z.string(),
  options: z.array(ChoiceOption).min(2).max(5),
});

const SimInteraction = z.object({
  kind: z.literal("sim"),
  prompt: z.string(),
});

export const InteractionSpec = z.discriminatedUnion("kind", [
  ChoiceInteraction,
  SimInteraction,
]);

const ConceptNode = z.object({
  id: z.string(),
  label: z.string(),
  kind: z.enum(["concept", "highlight"]).optional(),
});

const ConceptLink = z.object({
  from: z.string(),
  to: z.string(),
  label: z.string().optional(),
});

const ConceptMapConfig = z.object({
  nodes: z.array(ConceptNode).min(1),
  links: z.array(ConceptLink),
});

export const CardSchema = z.object({
  id: z.string(),
  concept: z.string(),
  type: z.enum(CARD_TYPES),
  objective: z.string(),
  hook: z.string().optional(),
  statement: z.string().optional(),
  facts: z.array(z.string()).optional(),
  footnote: z.string().optional(),
  visual: VisualSpec.optional().nullable(),
  interaction: InteractionSpec.optional().nullable(),
  conceptMap: ConceptMapConfig.optional().nullable(),
  reveal: z.string().optional(),
  difficulty: z.number().min(1).max(3),
  prerequisites: z.array(z.string()),
  next: z.array(z.string()),
  attentionPattern: z.string(),
  rhythm: z.enum(RHYTHMS),
});

export const TrackSchema = z.object({
  id: z.string(),
  title: z.string(),
  subtitle: z.string(),
  domain: z.string(),
  chapter: z.string(),
  topic: z.string(),
  cards: z.array(CardSchema),
  concepts: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      description: z.string(),
    }),
  ),
});

export type Card = z.infer<typeof CardSchema>;
export type VisualSpecType = z.infer<typeof VisualSpec>;
export type InteractionSpecType = z.infer<typeof InteractionSpec>;
export type Track = z.infer<typeof TrackSchema>;
export type Rhythm = (typeof RHYTHMS)[number];
