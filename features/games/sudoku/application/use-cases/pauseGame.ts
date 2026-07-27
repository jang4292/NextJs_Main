import type { SudokuGameState } from "../../domain/entities/GameState";

export function pauseGame(state: SudokuGameState): SudokuGameState {
  if (state.status !== "playing") return state;
  return { ...state, status: "paused", selectedCell: null };
}
