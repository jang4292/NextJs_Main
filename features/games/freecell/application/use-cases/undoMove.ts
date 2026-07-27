import type { GameState } from "../../domain/entities/GameState";

export interface FreecellHistory {
  current: GameState;
  initial: GameState;
  past: GameState[];
}

export function undoMove(history: FreecellHistory): FreecellHistory {
  if (history.past.length === 0) return history;

  const previous = history.past[history.past.length - 1];
  return { ...history, current: previous, past: history.past.slice(0, -1) };
}
