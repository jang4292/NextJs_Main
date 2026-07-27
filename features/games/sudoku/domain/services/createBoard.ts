import type { SudokuBoard } from "../entities/Board";
import type { SudokuPuzzle } from "../entities/SudokuPuzzle";

export function createBoardFromPuzzle(puzzle: SudokuPuzzle): SudokuBoard {
  return puzzle.puzzle.map((row, rowIndex) =>
    row.map((value, columnIndex) => ({
      row: rowIndex,
      column: columnIndex,
      value,
      solution: puzzle.solution[rowIndex][columnIndex],
      isFixed: value !== 0,
      isError: false,
    })),
  );
}
