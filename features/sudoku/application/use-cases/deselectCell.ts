import type { SudokuGameState } from "../../domain/entities/GameState";

export function deselectCell(state: SudokuGameState): SudokuGameState {
  return { ...state, selectedCell: null };
}
