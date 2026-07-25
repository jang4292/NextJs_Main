import type { SudokuCell } from "../entities/SudokuCell";
import type { SudokuGameStatus } from "../entities/GameStatus";

export function canEditCell(cell: SudokuCell): boolean {
  return !cell.isFixed;
}

export function isInputLocked(status: SudokuGameStatus): boolean {
  return status === "paused" || status === "completed";
}
