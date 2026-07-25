import { describe, expect, it } from "vitest";
import { startNewGame } from "./startNewGame";
import { SUDOKU_PUZZLES } from "../../domain/data/puzzles";

describe("startNewGame", () => {
  it("builds a ready-state game from the puzzle returned by pickPuzzle", () => {
    const puzzle = SUDOKU_PUZZLES[1];
    const state = startNewGame(() => puzzle);

    expect(state.puzzleId).toBe(puzzle.id);
    expect(state.status).toBe("ready");
    expect(state.selectedCell).toBeNull();
    expect(state.errorCount).toBe(0);
    expect(state.board[0][0].solution).toBe(puzzle.solution[0][0]);
  });

  it("defaults to selecting a puzzle from SUDOKU_PUZZLES", () => {
    const state = startNewGame();
    expect(SUDOKU_PUZZLES.some((puzzle) => puzzle.id === state.puzzleId)).toBe(
      true,
    );
  });
});
