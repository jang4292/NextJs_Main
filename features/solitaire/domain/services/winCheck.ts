import type { GameState } from "../entities/GameState";

export function isGameWon(state: GameState): boolean {
  return Object.values(state.foundations).reduce((sum, pile) => sum + pile.length, 0) === 52;
}
