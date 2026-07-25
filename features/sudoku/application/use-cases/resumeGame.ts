import type { SudokuGameState } from "../../domain/entities/GameState";

export function resumeGame(state: SudokuGameState): SudokuGameState {
  if (state.status !== "paused") return state;
  return { ...state, status: "playing" };
}
