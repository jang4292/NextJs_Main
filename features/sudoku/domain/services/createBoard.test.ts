import { describe, expect, it } from "vitest";
import { createBoardFromPuzzle } from "./createBoard";
import { buildPuzzle } from "../../test-utils";

describe("createBoardFromPuzzle", () => {
  it("marks given cells as fixed and empty cells as editable", () => {
    const board = createBoardFromPuzzle(buildPuzzle());

    expect(board[0][0].isFixed).toBe(false);
    expect(board[0][0].value).toBe(0);
    expect(board[0][1].isFixed).toBe(true);
    expect(board[0][1].value).toBe(3);
  });

  it("carries the solution value through for every cell", () => {
    const puzzle = buildPuzzle();
    const board = createBoardFromPuzzle(puzzle);

    for (let row = 0; row < 9; row++) {
      for (let column = 0; column < 9; column++) {
        expect(board[row][column].solution).toBe(puzzle.solution[row][column]);
      }
    }
  });

  it("initializes every cell with isError false", () => {
    const board = createBoardFromPuzzle(buildPuzzle());
    expect(
      board.every((row) => row.every((cell) => cell.isError === false)),
    ).toBe(true);
  });
});
