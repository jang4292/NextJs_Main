import { describe, expect, it } from "vitest";
import { restartGame } from "./restartGame";
import { startNewGame } from "./startNewGame";
import { SUDOKU_PUZZLES } from "../../domain/data/puzzles";
import type { SudokuGameState } from "../../domain/entities/GameState";

describe("restartGame", () => {
  it("restores the same puzzle to its initial state, discarding user input", () => {
    const puzzle = SUDOKU_PUZZLES[0];
    const started = startNewGame(() => puzzle);
    const played: SudokuGameState = {
      ...started,
      status: "playing",
      errorCount: 3,
      selectedCell: { row: 0, column: 0 },
      board: started.board.map((row, r) =>
        row.map((cell, c) =>
          r === 0 && c === 0 ? { ...cell, value: 9 as const } : cell,
        ),
      ),
    };

    const restarted = restartGame(played);

    expect(restarted.puzzleId).toBe(puzzle.id);
    expect(restarted.status).toBe("ready");
    expect(restarted.errorCount).toBe(0);
    expect(restarted.selectedCell).toBeNull();
    expect(restarted.board[0][0].value).toBe(puzzle.puzzle[0][0]);
  });
});
