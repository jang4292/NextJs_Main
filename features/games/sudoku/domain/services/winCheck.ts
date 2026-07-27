import type { SudokuBoard } from "../entities/Board";
import type { SudokuCell } from "../entities/SudokuCell";

export function matchesSolution(cell: SudokuCell): boolean {
  return cell.value === cell.solution;
}

/** A board is solved once every cell matches its solution (this also implies no cell is empty, since solutions never contain 0). */
export function isSolved(board: SudokuBoard): boolean {
  return board.every((row) => row.every(matchesSolution));
}
