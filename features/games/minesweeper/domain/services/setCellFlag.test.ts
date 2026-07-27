import { describe, expect, it } from "vitest";
import { createEmptyBoard } from "../entities/Board";
import { setCellFlag } from "./setCellFlag";

describe("setCellFlag", () => {
  it("sets a flag on a closed cell", () => {
    const board = createEmptyBoard(2, 2);
    const result = setCellFlag(board, { row: 0, column: 0 });

    expect(result[0][0].isFlagged).toBe(true);
  });

  it("clears the flag when toggled again", () => {
    const board = createEmptyBoard(2, 2);
    const flagged = setCellFlag(board, { row: 0, column: 0 });
    const unflagged = setCellFlag(flagged, { row: 0, column: 0 });

    expect(unflagged[0][0].isFlagged).toBe(false);
  });

  it("is a no-op on an already-revealed cell", () => {
    const board = createEmptyBoard(2, 2);
    board[0][0].isRevealed = true;

    const result = setCellFlag(board, { row: 0, column: 0 });

    expect(result).toBe(board);
    expect(result[0][0].isFlagged).toBe(false);
  });
});
