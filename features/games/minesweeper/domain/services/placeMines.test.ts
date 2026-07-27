import { describe, expect, it } from "vitest";
import { createEmptyBoard } from "../entities/Board";
import { positionKey } from "../entities/Position";
import { fixedRng } from "../../test-utils";
import { placeMines } from "./placeMines";
import { countMines } from "../rules/boardQueries";

describe("placeMines", () => {
  it("places exactly mineCount mines", () => {
    const board = createEmptyBoard(9, 9);
    const result = placeMines(
      board,
      10,
      [{ row: 4, column: 4 }],
      fixedRng(Array(10).fill(0)),
    );

    expect(countMines(result)).toBe(10);
  });

  it("never places two mines on the same cell", () => {
    const board = createEmptyBoard(9, 9);
    const result = placeMines(
      board,
      10,
      [{ row: 0, column: 0 }],
      fixedRng(Array(10).fill(0)),
    );

    const minedKeys = new Set<string>();
    for (const row of result) {
      for (const cell of row) {
        if (cell.isMine) minedKeys.add(positionKey(cell));
      }
    }

    expect(minedKeys.size).toBe(10);
  });

  it("never places a mine on an excluded (safe) position", () => {
    const board = createEmptyBoard(3, 3);
    const safePosition = { row: 1, column: 1 };
    // Bias the RNG toward index 0 every draw, which would repeatedly try to
    // land on the first candidate - proving the safe cell is filtered out of
    // the candidate pool entirely rather than just skipped opportunistically.
    const result = placeMines(
      board,
      8,
      [safePosition],
      fixedRng(Array(8).fill(0)),
    );

    expect(result[safePosition.row][safePosition.column].isMine).toBe(false);
    expect(countMines(result)).toBe(8);
  });

  it("places mines deterministically at the positions selected by an injected RNG", () => {
    const board = createEmptyBoard(3, 3);
    const result = placeMines(
      board,
      3,
      [{ row: 1, column: 1 }],
      fixedRng([0, 0, 0]),
    );

    expect(result[0][0].isMine).toBe(true);
    expect(result[0][1].isMine).toBe(true);
    expect(result[0][2].isMine).toBe(true);
    expect(countMines(result)).toBe(3);
  });

  it("does not mutate the input board", () => {
    const board = createEmptyBoard(3, 3);
    placeMines(board, 3, [{ row: 1, column: 1 }], fixedRng([0, 0, 0]));

    expect(countMines(board)).toBe(0);
  });
});
