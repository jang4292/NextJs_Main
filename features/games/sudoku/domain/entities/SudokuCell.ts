import type { FilledSudokuValue, SudokuValue } from "./SudokuValue";

export interface SudokuCell {
  readonly row: number;
  readonly column: number;
  readonly value: SudokuValue;
  readonly solution: FilledSudokuValue;
  readonly isFixed: boolean;
  readonly isError: boolean;
}
