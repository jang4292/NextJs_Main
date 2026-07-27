import { createBoardFromPuzzle } from "./domain/services/createBoard";
import type { SudokuBoard } from "./domain/entities/Board";
import type { SudokuPuzzle } from "./domain/entities/SudokuPuzzle";
import type {
  FilledSudokuValue,
  SudokuValue,
} from "./domain/entities/SudokuValue";

/** A fully solved, valid 9x9 grid used as the base for building test fixtures. */
export const VALID_SOLUTION: readonly (readonly FilledSudokuValue[])[] = [
  [5, 3, 4, 6, 7, 8, 9, 1, 2],
  [6, 7, 2, 1, 9, 5, 3, 4, 8],
  [1, 9, 8, 3, 4, 2, 5, 6, 7],
  [8, 5, 9, 7, 6, 1, 4, 2, 3],
  [4, 2, 6, 8, 5, 3, 7, 9, 1],
  [7, 1, 3, 9, 2, 4, 8, 5, 6],
  [9, 6, 1, 5, 3, 7, 2, 8, 4],
  [2, 8, 7, 4, 1, 9, 6, 3, 5],
  [3, 4, 5, 2, 8, 6, 1, 7, 9],
];

export function buildPuzzle(
  overrides: Partial<SudokuPuzzle> = {},
): SudokuPuzzle {
  const puzzle: readonly (readonly SudokuValue[])[] = VALID_SOLUTION.map(
    (row, rowIndex) =>
      row.map((value, columnIndex) =>
        rowIndex === 0 && columnIndex === 0 ? 0 : value,
      ),
  );

  return {
    id: "test-puzzle",
    difficulty: "easy",
    puzzle,
    solution: VALID_SOLUTION,
    ...overrides,
  };
}

export function buildBoard(overrides: Partial<SudokuPuzzle> = {}): SudokuBoard {
  return createBoardFromPuzzle(buildPuzzle(overrides));
}
