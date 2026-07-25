import { describe, expect, it } from "vitest";
import { isSolved, matchesSolution } from "./winCheck";
import { buildBoard } from "../../test-utils";

describe("matchesSolution", () => {
  it("is true when the value equals the solution", () => {
    const board = buildBoard();
    expect(matchesSolution(board[0][1])).toBe(true);
  });

  it("is false when the value differs from the solution", () => {
    const board = buildBoard();
    expect(matchesSolution(board[0][0])).toBe(false);
  });
});

describe("isSolved", () => {
  it("is false when a cell is still empty", () => {
    const board = buildBoard();
    expect(isSolved(board)).toBe(false);
  });

  it("is false when a cell holds a wrong value", () => {
    const board = buildBoard();
    board[0][0] = { ...board[0][0], value: 9 }; // solution at (0,0) is 5
    expect(isSolved(board)).toBe(false);
  });

  it("is true once every cell matches its solution", () => {
    const board = buildBoard();
    board[0][0] = { ...board[0][0], value: board[0][0].solution };
    expect(isSolved(board)).toBe(true);
  });
});
