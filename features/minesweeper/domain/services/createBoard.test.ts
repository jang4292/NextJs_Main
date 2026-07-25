import { describe, expect, it } from "vitest";
import { BEGINNER } from "../entities/Difficulty";
import { createBoard } from "./createBoard";

describe("createBoard", () => {
  it("creates a 9x9 board for the Beginner difficulty", () => {
    const board = createBoard(BEGINNER);

    expect(board).toHaveLength(9);
    board.forEach((row) => expect(row).toHaveLength(9));
  });

  it("initializes every cell as safe, unrevealed, unflagged, with no adjacent mines", () => {
    const board = createBoard(BEGINNER);

    board.forEach((row, rowIndex) =>
      row.forEach((cell, columnIndex) => {
        expect(cell).toEqual({
          row: rowIndex,
          column: columnIndex,
          isMine: false,
          isRevealed: false,
          isFlagged: false,
          adjacentMines: 0,
        });
      }),
    );
  });
});
