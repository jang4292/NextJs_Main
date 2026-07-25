import type { CellPosition } from "../../domain/entities/CellPosition";
import type { SudokuGameState } from "../../domain/entities/GameState";
import { isInputLocked } from "../../domain/rules/cellGuards";

export type MoveDirection = "up" | "down" | "left" | "right";

const DELTAS: Record<MoveDirection, { row: number; column: number }> = {
  up: { row: -1, column: 0 },
  down: { row: 1, column: 0 },
  left: { row: 0, column: -1 },
  right: { row: 0, column: 1 },
};

function clamp(value: number): number {
  return Math.min(8, Math.max(0, value));
}

export function moveSelection(
  state: SudokuGameState,
  direction: MoveDirection,
): SudokuGameState {
  if (isInputLocked(state.status)) return state;

  const current: CellPosition = state.selectedCell ?? { row: 0, column: 0 };
  const delta = DELTAS[direction];
  const next: CellPosition = {
    row: clamp(current.row + delta.row),
    column: clamp(current.column + delta.column),
  };

  return { ...state, selectedCell: next };
}
