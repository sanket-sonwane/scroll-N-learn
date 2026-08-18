const KEY = "scrolllearn:progress:v1";

export type ExpProgress = {
  index: number;
  completed: string[];
  startedAt: number;
  updatedAt: number;
};

type ProgressMap = Record<string, ExpProgress>;

const DEFAULTS: ExpProgress = {
  index: 0,
  completed: [],
  startedAt: 0,
  updatedAt: 0,
};

function safeRead(): ProgressMap | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) return parsed as ProgressMap;
    return null;
  } catch {
    return null;
  }
}

function writeMap(map: ProgressMap): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(map));
  } catch {
    /* storage unavailable — fail silently */
  }
}

export function readProgress(experienceId: string): ExpProgress {
  return safeRead()?.[experienceId] ?? { ...DEFAULTS };
}

export function writeProgress(experienceId: string, state: ExpProgress): void {
  const map = safeRead() ?? {};
  map[experienceId] = state;
  writeMap(map);
}

export function recordCardSeen(
  experienceId: string,
  index: number,
  cardId: string,
): void {
  const state = readProgress(experienceId);
  const completed = state.completed.includes(cardId)
    ? state.completed
    : [...state.completed, cardId];
  writeProgress(experienceId, {
    ...state,
    index,
    completed,
    startedAt: state.startedAt || Date.now(),
    updatedAt: Date.now(),
  });
}

export function clearProgress(experienceId: string): void {
  const map = safeRead() ?? {};
  delete map[experienceId];
  writeMap(map);
}