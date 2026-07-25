import { findPuzzleById } from "../../domain/data/puzzles";
import type { SudokuGameState } from "../../domain/entities/GameState";
import { createBoardFromPuzzle } from "../../domain/services/createBoard";

export function restartGame(state: SudokuGameState): SudokuGameState {
  const puzzle = findPuzzleById(state.puzzleId);
  return {
    board: createBoardFromPuzzle(puzzle),
    puzzleId: puzzle.id,
    status: "ready",
    selectedCell: null,
    errorCount: 0,
  };
}
