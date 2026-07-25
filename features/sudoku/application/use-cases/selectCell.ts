import type { CellPosition } from "../../domain/entities/CellPosition";
import type { SudokuGameState } from "../../domain/entities/GameState";
import { isInputLocked } from "../../domain/rules/cellGuards";

export function selectCell(
  state: SudokuGameState,
  position: CellPosition,
): SudokuGameState {
  if (isInputLocked(state.status)) return state;

  return {
    ...state,
    selectedCell: position,
    status: state.status === "ready" ? "playing" : state.status,
  };
}
