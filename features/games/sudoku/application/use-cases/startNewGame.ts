import { pickRandomPuzzle } from "../../domain/data/puzzles";
import type { SudokuGameState } from "../../domain/entities/GameState";
import type { SudokuPuzzle } from "../../domain/entities/SudokuPuzzle";
import { createBoardFromPuzzle } from "../../domain/services/createBoard";

export function startNewGame(
  pickPuzzle: () => SudokuPuzzle = pickRandomPuzzle,
): SudokuGameState {
  const puzzle = pickPuzzle();
  return {
    board: createBoardFromPuzzle(puzzle),
    puzzleId: puzzle.id,
    status: "ready",
    selectedCell: null,
    errorCount: 0,
  };
}
