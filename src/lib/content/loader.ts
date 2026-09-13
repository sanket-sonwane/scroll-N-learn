import {
  TrackSchema,
  type Track,
  type Experience,
  type Card,
} from "./types";
import attentionTrack from "../../../content/tracks/ai-engineering/deep-learning/transformers/attention.json";
import algorithmsIndex from "../../../content/tracks/algorithms/index.json";
import complexityRace from "../../../content/tracks/algorithms/complexity-race.json";
import algorithmExecution from "../../../content/tracks/algorithms/algorithm-execution.json";
import breakTheAlgorithm from "../../../content/tracks/algorithms/break-the-algorithm.json";
import graphPuzzle from "../../../content/tracks/algorithms/graph-puzzle.json";
import mlIndex from "../../../content/tracks/ml-zero-to-hero/index.json";
import mlRulesBreak from "../../../content/tracks/ml-zero-to-hero/e01-rules-break.json";
import mlLearningData from "../../../content/tracks/ml-zero-to-hero/e02-learning-from-data.json";

const algorithmsTrack = {
  ...(algorithmsIndex as object),
  experiences: [
    complexityRace,
    algorithmExecution,
    breakTheAlgorithm,
    graphPuzzle,
  ],
} as unknown as Track;

const mlTrack = {
  ...(mlIndex as object),
  experiences: [mlRulesBreak, mlLearningData],
} as unknown as Track;

const TRACKS: Record<string, Track> = {
  "ai-engineering": attentionTrack as unknown as Track,
  algorithms: algorithmsTrack,
  "ml-zero-to-hero": mlTrack,
};

const parsed = new Map<string, Track>();
const experienceCache = new Map<string, Experience>();

export function getTrack(trackId: string): Track {
  const cached = parsed.get(trackId);
  if (cached) return cached;

  const raw = TRACKS[trackId];
  if (!raw) throw new Error(`Unknown track: ${trackId}`);

  const result = TrackSchema.safeParse(raw);
  if (!result.success) {
    throw new Error(
      `Invalid content for track "${trackId}": ${result.error.message}`,
    );
  }

  for (const exp of result.data.experiences ?? []) {
    assertCardLinks(
      exp.cards,
      `track "${trackId}" / experience "${exp.id}"`,
      new Set(result.data.concepts.map((c) => c.id)),
    );
  }
  if (result.data.cards?.length) {
    assertCardLinks(
      result.data.cards,
      `track "${trackId}"`,
      new Set(result.data.concepts.map((c) => c.id)),
    );
  }

  parsed.set(trackId, result.data);
  return result.data;
}
function implicitExperience(track: Track): Experience {
  return {
    id: track.id,
    trackId: track.id,
    name: track.title,
    subtitle: track.subtitle,
    icon: "∞",
    accent: "ai",
    connect: track.cards.map((c) => c.concept),
    cards: track.cards,
  };
}

export function getExperiences(trackId: string): Experience[] {
  const track = getTrack(trackId);
  return track.experiences?.length ? track.experiences : [implicitExperience(track)];
}

export function getExperience(trackId: string, experienceId: string): Experience {
  const exp = getExperiences(trackId).find((e) => e.id === experienceId);
  if (!exp) {
    throw new Error(
      `Track "${trackId}" has no experience "${experienceId}".`,
    );
  }
  return exp;
}

export function resolveExperience(experienceId: string): Experience {
  const cached = experienceCache.get(experienceId);
  if (cached) return cached;
  for (const trackId of Object.keys(TRACKS)) {
    try {
      const exp = getExperiences(trackId).find((e) => e.id === experienceId);
      if (exp) {
        experienceCache.set(experienceId, exp);
        return exp;
      }
    } catch {
      /* skip malformed track */
    }
  }
  throw new Error(`Unknown experience: ${experienceId}`);
}

export function getTrackCards(trackId: string): Card[] {
  return getTrack(trackId).cards;
}

function assertCardLinks(
  cards: Card[],
  scope: string,
  conceptIds?: Set<string>,
): void {
  const ids = new Set(cards.map((c) => c.id));
  for (const card of cards) {
    for (const next of card.next) {
      if (!ids.has(next)) {
        throw new Error(
          `${scope}: card "${card.id}" references unknown next card "${next}".`,
        );
      }
    }
    for (const prereq of card.prerequisites) {
      if (!ids.has(prereq) && !(conceptIds?.has(prereq) ?? false)) {
        throw new Error(
          `${scope}: card "${card.id}" references unknown prerequisite "${prereq}".`,
        );
      }
    }
  }
}