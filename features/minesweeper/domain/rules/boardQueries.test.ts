import { describe, expect, it } from "vitest";
import { createEmptyBoard } from "../entities/Board";
import { countFlags, countMines, countRemainingMines, getNeighborPositions, isWon } from "./boardQueries";

describe("countMines", () => {
  it("counts mined cells", () => {
    const board = createEmptyBoard(3, 3);
    board[0][0].isMine = true;
    board[2][2].isMine = true;

    expect(countMines(board)).toBe(2);
  });
});

describe("countFlags / countRemainingMines", () => {
  it("subtracts flagged cells from the mine count", () => {
    const board = createEmptyBoard(3, 3);
    board[0][0].isFlagged = true;

    expect(countFlags(board)).toBe(1);
    expect(countRemainingMines(board, 5)).toBe(4);
  });
});

describe("getNeighborPositions", () => {
  it("returns 8 neighbors for an interior cell", () => {
    const board = createEmptyBoard(3, 3);
    const neighbors = getNeighborPositions(board, { row: 1, column: 1 });

    expect(neighbors).toHaveLength(8);
  });

  it("clips out-of-bounds neighbors for a corner cell", () => {
    const board = createEmptyBoard(3, 3);
    const neighbors = getNeighborPositions(board, { row: 0, column: 0 });

    expect(neighbors).toHaveLength(3);
    expect(neighbors).toEqual(
      expect.arrayContaining([
        { row: 0, column: 1 },
        { row: 1, column: 0 },
        { row: 1, column: 1 },
      ]),
    );
  });

  it("clips out-of-bounds neighbors for an edge cell", () => {
    const board = createEmptyBoard(3, 3);
    const neighbors = getNeighborPositions(board, { row: 0, column: 1 });

    expect(neighbors).toHaveLength(5);
  });
});

describe("isWon", () => {
  it("is false while a safe cell remains unrevealed", () => {
    const board = createEmptyBoard(2, 2);
    board[0][0].isMine = true;
    board[0][1].isRevealed = true;
    board[1][0].isRevealed = true;
    // board[1][1] stays unrevealed

    expect(isWon(board)).toBe(false);
  });

  it("is true once every non-mine cell is revealed, regardless of flags", () => {
    const board = createEmptyBoard(2, 2);
    board[0][0].isMine = true;
    board[0][0].isFlagged = true;
    board[0][1].isRevealed = true;
    board[1][0].isRevealed = true;
    board[1][1].isRevealed = true;

    expect(isWon(board)).toBe(true);
  });
});
