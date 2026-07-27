import type { SudokuBoard } from "./Board";
import type { CellPosition } from "./CellPosition";
import type { SudokuGameStatus } from "./GameStatus";

// Elapsed time is intentionally excluded here: it is a presentation-only
// concern owned by useElapsedTimer, not part of the game rules.
export interface SudokuGameState {
  readonly board: SudokuBoard;
  readonly puzzleId: string;
  readonly status: SudokuGameStatus;
  readonly selectedCell: CellPosition | null;
  readonly errorCount: number;
}
