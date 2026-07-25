import { describe, expect, it } from "vitest";
import { applyErrorFlags, computeErrorPositions } from "./duplicateRules";
import { buildBoard } from "../../test-utils";

describe("computeErrorPositions", () => {
  it("flags a duplicate value entered in the same row", () => {
    const board = buildBoard();
    // row 0 already has a 3 at column 1 (solution row) - enter it again at (0,0).
    board[0][0] = { ...board[0][0], value: 3 };

    const errors = computeErrorPositions(board);
    expect(errors).toContainEqual({ row: 0, column: 0 });
  });

  it("flags a duplicate value entered in the same column", () => {
    const board = buildBoard();
    // column 0 already has a 4 at row 4 (outside box (0,0), so this is a
    // column-only duplicate, not a box duplicate).
    board[0][0] = { ...board[0][0], value: 4 };
    const errors = computeErrorPositions(board);
    expect(errors).toContainEqual({ row: 0, column: 0 });
  });

  it("flags a duplicate value entered in the same box", () => {
    const board = buildBoard();
    // box (0,0) already contains 7 at (1,0). Enter 7 at (0,0).
    board[0][0] = { ...board[0][0], value: 7 };
    const errors = computeErrorPositions(board);
    expect(errors).toContainEqual({ row: 0, column: 0 });
  });

  it("never flags a fixed cell even when it is part of a duplicate", () => {
    const board = buildBoard();
    // (0,1) is fixed with value 3. Enter a duplicate 3 elsewhere in the box.
    board[1][1] = { ...board[1][1], value: 3 };
    const errors = computeErrorPositions(board);
    expect(errors).not.toContainEqual({ row: 0, column: 1 });
  });

  it("ignores empty cells", () => {
    const board = buildBoard();
    const errors = computeErrorPositions(board);
    expect(errors).toHaveLength(0);
  });
});

describe("applyErrorFlags", () => {
  it("returns a new board with isError set on duplicated non-fixed cells", () => {
    const board = buildBoard();
    board[0][0] = { ...board[0][0], value: 7 };

    const flagged = applyErrorFlags(board);
    expect(flagged[0][0].isError).toBe(true);
    expect(flagged).not.toBe(board);
    expect(board[0][0].isError).toBe(false);
  });
});
