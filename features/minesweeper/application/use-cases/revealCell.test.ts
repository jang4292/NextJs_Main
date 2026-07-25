import { describe, expect, it } from "vitest";
import type { GameState } from "../../domain/entities/GameState";
import { calculateAdjacentMines } from "../../domain/services/calculateAdjacentMines";
import { fixedRng, boardFromLayout } from "../../test-utils";
import { revealCell } from "./revealCell";
import { startNewGame } from "./startNewGame";

describe("revealCell", () => {
  it("never places a mine on the first-clicked cell, even when the RNG is biased toward it", () => {
    const difficulty = { rows: 3, columns: 3, mineCount: 8 };
    const state = startNewGame(difficulty);
    const clicked = { row: 1, column: 1 };

    const next = revealCell(state, clicked, fixedRng(Array(8).fill(0)));

    expect(next.board[1][1].isMine).toBe(false);
    expect(next.board[1][1].isRevealed).toBe(true);
    expect(next.minesPlaced).toBe(true);
  });

  it("transitions from ready to playing on the first reveal", () => {
    const state = startNewGame({ rows: 3, columns: 3, mineCount: 1 });
    const next = revealCell(state, { row: 0, column: 0 }, fixedRng([0]));

    expect(next.status).toBe("playing");
  });

  it("is a no-op on a flagged cell", () => {
    const board = calculateAdjacentMines(boardFromLayout(["..", ".."]));
    board[0][1].isFlagged = true;
    const state: GameState = {
      board,
      status: "playing",
      difficulty: { rows: 2, columns: 2, mineCount: 0 },
      minesPlaced: true,
    };

    const result = revealCell(state, { row: 0, column: 1 });

    expect(result).toBe(state);
  });

  it("is a no-op on an already-revealed cell", () => {
    const board = calculateAdjacentMines(boardFromLayout(["..", ".."]));
    board[0][1].isRevealed = true;
    const state: GameState = {
      board,
      status: "playing",
      difficulty: { rows: 2, columns: 2, mineCount: 0 },
      minesPlaced: true,
    };

    const result = revealCell(state, { row: 0, column: 1 });

    expect(result).toBe(state);
  });

  it("reveals the mine and every other mine, then loses, when a mine is clicked", () => {
    const board = calculateAdjacentMines(boardFromLayout(["*..", "..*"]));
    const state: GameState = {
      board,
      status: "playing",
      difficulty: { rows: 2, columns: 3, mineCount: 2 },
      minesPlaced: true,
    };

    const result = revealCell(state, { row: 0, column: 0 });

    expect(result.status).toBe("lost");
    expect(result.board[0][0].isRevealed).toBe(true);
    expect(result.board[1][2].isRevealed).toBe(true);
  });

  it("wins once every safe cell is revealed", () => {
    const board = calculateAdjacentMines(boardFromLayout(["*."]));
    let state: GameState = {
      board,
      status: "playing",
      difficulty: { rows: 1, columns: 2, mineCount: 1 },
      minesPlaced: true,
    };

    state = revealCell(state, { row: 0, column: 1 });

    expect(state.status).toBe("won");
    expect(state.board[0][1].isRevealed).toBe(true);
  });

  it("does not change state after the game has been lost", () => {
    const board = calculateAdjacentMines(boardFromLayout(["*."]));
    const lostState: GameState = {
      board,
      status: "lost",
      difficulty: { rows: 1, columns: 2, mineCount: 1 },
      minesPlaced: true,
    };

    const result = revealCell(lostState, { row: 0, column: 1 });

    expect(result).toBe(lostState);
  });

  it("does not change state after the game has been won", () => {
    const board = calculateAdjacentMines(boardFromLayout(["*."]));
    board[0][1].isRevealed = true;
    const wonState: GameState = {
      board,
      status: "won",
      difficulty: { rows: 1, columns: 2, mineCount: 1 },
      minesPlaced: true,
    };

    const result = revealCell(wonState, { row: 0, column: 0 });

    expect(result).toBe(wonState);
  });
});
