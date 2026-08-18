const KEY = "scrolllearn:events:v0";
const MAX_EVENTS = 400;

export type LearningEvent =
  | { type: "session_start"; cardId: string | null; ts: number }
  | { type: "session_end"; cardId: string | null; ts: number }
  | { type: "experience_start"; experienceId: string; ts: number }
  | { type: "experience_complete"; experienceId: string; ts: number }
  | { type: "card_view"; cardId: string; index: number; ts: number }
  | { type: "card_enter"; cardId: string; index: number; ts: number }
  | { type: "card_exit"; cardId: string; index: number; ts: number }
  | { type: "card_complete"; cardId: string; index: number; ts: number }
  | { type: "card_skip"; cardId: string; index: number; ts: number }
  | { type: "card_back"; cardId: string; index: number; ts: number }
  | { type: "interaction_start"; cardId: string; ts: number }
  | { type: "interaction_complete"; cardId: string; ts: number }
  | { type: "prediction_answer"; cardId: string; correct: boolean; ts: number }
  | { type: "prediction_correct"; cardId: string; ts: number }
  | { type: "learning_check"; cardId: string; correct: boolean; ts: number }
  | { type: "rank_submit"; cardId: string; correct: boolean; ts: number }
  | { type: "graph_solve"; cardId: string; ts: number }
  | { type: "path_draw"; cardId: string; ts: number }
  | { type: "animation_replay"; cardId: string; ts: number }
  | { type: "simulation_move"; cardId: string; ts: number }
  | { type: "rabbit_hole_exit"; cardId: string; ts: number };

export function track(event: LearningEvent): void {
  if (typeof window === "undefined") return;
  try {
    const raw = window.localStorage.getItem(KEY);
    const events: LearningEvent[] = raw ? JSON.parse(raw) : [];
    events.push(event);
    if (events.length > MAX_EVENTS) events.splice(0, events.length - MAX_EVENTS);
    window.localStorage.setItem(KEY, JSON.stringify(events));
  } catch {
    /* analytics must never break the experience */
  }
}