import type { FilledSudokuValue, SudokuValue } from "./SudokuValue";

export type SudokuDifficulty = "easy" | "medium" | "hard";

export interface SudokuPuzzle {
  readonly id: string;
  readonly difficulty: SudokuDifficulty;
  /** 9x9, 0 marks an empty cell the player must fill in. */
  readonly puzzle: readonly (readonly SudokuValue[])[];
  /** 9x9, fully solved board - no zeros. */
  readonly solution: readonly (readonly FilledSudokuValue[])[];
}
