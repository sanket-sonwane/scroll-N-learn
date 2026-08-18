import { z } from "zod";

export const CARD_TYPES = [
  "hook",
  "concept",
  "visual",
  "prediction",
  "quiz",
  "simulation",
  "concept_map",
  "execution",
  "graph",
  "challenge",
  "comparison",
  "equation",
] as const;

export const RHYTHMS = ["low", "medium", "high"] as const;

export const GROWTH_FUNCTIONS = [
  "constant",
  "log",
  "linear",
  "nlogn",
  "quadratic",
  "exponential",
  "factorial",
] as const;

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

const GrowthRaceConfig = z.object({
  functions: z.array(z.enum(GROWTH_FUNCTIONS)).min(1),
  display: z.enum(["race", "universe"]).default("race"),
  initialN: z.number().default(10),
  maxN: z.number().default(100),
  interactive: z.boolean().default(false),
  leaveFrame: z.boolean().default(false),
  steps: z.array(z.number()).optional(),
  label: z.string().optional(),
});

const ArrayRunnerConfig = z.object({
  algorithm: z.enum(["findMax", "linearSearch"]),
  mode: z.enum(["run", "best", "worst", "average", "custom"]).default("run"),
  array: z.array(z.number()).min(1),
  target: z.number().optional(),
  flaw: z.enum(["zero-init"]).optional(),
  dominantOp: z.string().optional(),
  controllable: z.boolean().default(false),
});

const GraphNode = z.object({
  id: z.string(),
  label: z.string(),
  x: z.number().min(0).max(100),
  y: z.number().min(0).max(100),
});

const GraphEdge = z.object({
  source: z.string(),
  target: z.string(),
});

const GraphVisualConfig = z.object({
  mode: z.enum(["show", "vertexCover", "hamiltonian"]),
  nodes: z.array(GraphNode).min(1),
  edges: z.array(GraphEdge),
  startNode: z.string().optional(),
  minimalSize: z.number().optional(),
  coverageTarget: z.number().optional(),
});

const SearchSpaceConfig = z.object({
  levels: z.number().default(5),
  branches: z.number().default(2),
  label: z.string().optional(),
});

const CurveToLoopConfig = z.object({
  n: z.number().default(10),
});

export const VisualSpec = z.object({
  kind: z.enum([
    "tokenFlow",
    "connectionGraph",
    "attentionMatrix",
    "growthRace",
    "arrayRunner",
    "graphVisual",
    "searchSpace",
    "curveToLoop",
  ]),
  config: z.union([
    TokenFlowConfig,
    ConnectionGraphConfig,
    AttentionMatrixConfig,
    GrowthRaceConfig,
    ArrayRunnerConfig,
    GraphVisualConfig,
    SearchSpaceConfig,
    CurveToLoopConfig,
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

const RankItem = z.object({
  id: z.string(),
  label: z.string(),
});

const RankInteraction = z.object({
  kind: z.literal("rank"),
  prompt: z.string(),
  items: z.array(RankItem).min(2),
  correctOrder: z.array(z.string()).min(2),
});

const CustomInputInteraction = z.object({
  kind: z.literal("customInput"),
  prompt: z.string(),
  placeholder: z.string().optional(),
});

export const InteractionSpec = z.discriminatedUnion("kind", [
  ChoiceInteraction,
  SimInteraction,
  RankInteraction,
  CustomInputInteraction,
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

const ChallengeInput = z.object({
  id: z.string(),
  label: z.string(),
  array: z.array(z.number()).min(1),
  breaks: z.boolean(),
});

const ChallengeConfig = z.object({
  label: z.string(),
  pseudocode: z.array(z.string()).min(1),
  flaw: z.enum(["zero-init"]),
  inputs: z.array(ChallengeInput).min(2),
  success: z.string().default("You broke it."),
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
  challenge: ChallengeConfig.optional().nullable(),
  notation: z.string().optional(),
  reveal: z.string().optional(),
  difficulty: z.number().min(1).max(3),
  prerequisites: z.array(z.string()),
  next: z.array(z.string()),
  attentionPattern: z.string(),
  rhythm: z.enum(RHYTHMS),
});

export const ExperienceSchema = z.object({
  id: z.string(),
  trackId: z.string(),
  name: z.string(),
  subtitle: z.string(),
  icon: z.string(),
  accent: z.enum(["info", "success", "warning", "ai"]).default("info"),
  connect: z.array(z.string()),
  next: z
    .object({
      id: z.string(),
      name: z.string(),
      tagline: z.string(),
    })
    .optional(),
  cards: z.array(CardSchema),
});

export const TrackSchema = z.object({
  id: z.string(),
  title: z.string(),
  subtitle: z.string(),
  domain: z.string(),
  chapter: z.string(),
  topic: z.string(),
  cards: z.array(CardSchema).optional().default([]),
  experiences: z.array(ExperienceSchema).optional(),
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
export type Experience = z.infer<typeof ExperienceSchema>;
export type Rhythm = (typeof RHYTHMS)[number];
export type GrowthFn = (typeof GROWTH_FUNCTIONS)[number];
export type GrowthRaceConfigType = z.infer<typeof GrowthRaceConfig>;
export type ArrayRunnerConfigType = z.infer<typeof ArrayRunnerConfig>;
export type GraphVisualConfigType = z.infer<typeof GraphVisualConfig>;
export type SearchSpaceConfigType = z.infer<typeof SearchSpaceConfig>;
export type CurveToLoopConfigType = z.infer<typeof CurveToLoopConfig>;
export type ChallengeConfigType = z.infer<typeof ChallengeConfig>;