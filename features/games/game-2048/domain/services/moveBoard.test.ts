import { describe, expect, it } from "vitest";
import type { Board } from "../entities/Board";
import { moveBoard } from "./moveBoard";

describe("moveBoard", () => {
  it("applies the left-compaction algorithm to every row for LEFT", () => {
    const board: Board = [
      [2, 0, 2, 4],
      [2, 2, 2, 2],
      [2, 2, 0, 0],
      [4, 4, 8, 8],
    ];
    const result = moveBoard(board, "LEFT");
    expect(result.board).toEqual([
      [4, 4, 0, 0],
      [4, 4, 0, 0],
      [4, 0, 0, 0],
      [8, 16, 0, 0],
    ]);
    expect(result.moved).toBe(true);
    expect(result.scoreGained).toBe(4 + 8 + 4 + 24);
  });

  it("mirrors the same merge logic for RIGHT", () => {
    const board: Board = [
      [4, 4, 8, 8],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    const result = moveBoard(board, "RIGHT");
    expect(result.board[0]).toEqual([0, 0, 8, 16]);
    expect(result.scoreGained).toBe(24);
  });

  it("applies the merge logic column-wise for UP", () => {
    const board: Board = [
      [2, 0, 0, 0],
      [0, 0, 0, 0],
      [2, 0, 0, 0],
      [4, 0, 0, 0],
    ];
    const result = moveBoard(board, "UP");
    expect(result.board).toEqual([
      [4, 0, 0, 0],
      [4, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ]);
  });

  it("applies the merge logic column-wise for DOWN", () => {
    const board: Board = [
      [4, 0, 0, 0],
      [2, 0, 0, 0],
      [0, 0, 0, 0],
      [2, 0, 0, 0],
    ];
    const result = moveBoard(board, "DOWN");
    expect(result.board).toEqual([
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [4, 0, 0, 0],
      [4, 0, 0, 0],
    ]);
  });

  it("returns the exact same board reference when no line changes", () => {
    const board: Board = [
      [2, 4, 8, 16],
      [2, 4, 8, 16],
      [2, 4, 8, 16],
      [2, 4, 8, 16],
    ];
    const result = moveBoard(board, "LEFT");
    expect(result.moved).toBe(false);
    expect(result.board).toBe(board);
    expect(result.scoreGained).toBe(0);
  });
});
