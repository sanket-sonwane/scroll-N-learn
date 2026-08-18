const KEY = "scrolllearn:progress:v0";

export type ProgressState = {
  trackId: string;
  index: number;
  completed: string[];
  startedAt: number;
  updatedAt: number;
};

const DEFAULTS: Omit<ProgressState, "trackId"> = {
  index: 0,
  completed: [],
  startedAt: 0,
  updatedAt: 0,
};

function safeRead(): ProgressState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return null;
    return JSON.parse(raw) as ProgressState;
  } catch {
    return null;
  }
}

export function readProgress(trackId: string): ProgressState {
  const stored = safeRead();
  if (stored && stored.trackId === trackId) return stored;
  return { trackId, ...DEFAULTS };
}

export function writeProgress(state: ProgressState): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* storage unavailable — fail silently */
  }
}

export function recordCardSeen(
  trackId: string,
  index: number,
  cardId: string,
): void {
  const state = readProgress(trackId);
  const completed = state.completed.includes(cardId)
    ? state.completed
    : [...state.completed, cardId];
  writeProgress({
    ...state,
    index,
    completed,
    startedAt: state.startedAt || Date.now(),
    updatedAt: Date.now(),
  });
}

export function clearProgress(trackId: string): void {
  writeProgress({ trackId, ...DEFAULTS });
}
