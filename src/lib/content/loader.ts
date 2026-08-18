import { TrackSchema, type Track, type Card } from "./types";
import attentionTrack from "../../../content/tracks/ai-engineering/deep-learning/transformers/attention.json";

const TRACKS: Record<string, Track> = {
  "ai-engineering": attentionTrack as unknown as Track,
};

const parsed = new Map<string, Track>();

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

  assertCardLinks(result.data);
  parsed.set(trackId, result.data);
  return result.data;
}

export function getTrackCards(trackId: string): Card[] {
  return getTrack(trackId).cards;
}

function assertCardLinks(track: Track): void {
  const ids = new Set(track.cards.map((c) => c.id));
  for (const card of track.cards) {
    for (const next of card.next) {
      if (!ids.has(next)) {
        throw new Error(
          `Track "${track.id}": card "${card.id}" references unknown next card "${next}".`,
        );
      }
    }
    for (const prereq of card.prerequisites) {
      if (!track.concepts.some((c) => c.id === prereq)) {
        throw new Error(
          `Track "${track.id}": card "${card.id}" references unknown prerequisite "${prereq}".`,
        );
      }
    }
  }
}
