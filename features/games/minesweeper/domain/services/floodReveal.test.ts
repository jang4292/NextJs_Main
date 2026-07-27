import { describe, expect, it } from "vitest";
import { createEmptyBoard } from "../entities/Board";
import { boardFromLayout } from "../../test-utils";
import { calculateAdjacentMines } from "./calculateAdjacentMines";
import { floodReveal } from "./floodReveal";

describe("floodReveal", () => {
  it("reveals only the clicked cell when it has a nonzero adjacent-mine count", () => {
    const board = calculateAdjacentMines(boardFromLayout(["*.", ".."]));
    const result = floodReveal(board, { row: 0, column: 1 });

    expect(result[0][1].isRevealed).toBe(true);
    expect(result[1][0].isRevealed).toBe(false);
    expect(result[1][1].isRevealed).toBe(false);
  });

  it("flood-fills every connected safe cell, revealing numbered boundary cells but never the mine itself", () => {
    const board = calculateAdjacentMines(
      boardFromLayout(["....", "....", "....", "...*"]),
    );
    const result = floodReveal(board, { row: 0, column: 0 });

    for (let row = 0; row < 4; row++) {
      for (let column = 0; column < 4; column++) {
        if (row === 3 && column === 3) {
          expect(result[row][column].isRevealed).toBe(false);
        } else {
          expect(result[row][column].isRevealed).toBe(true);
        }
      }
    }
  });

  it("does not reveal a flagged cell, even when the flood would otherwise reach it", () => {
    const board = calculateAdjacentMines(
      boardFromLayout(["....", "....", "....", "...."]),
    );
    board[1][1].isFlagged = true;

    const result = floodReveal(board, { row: 0, column: 0 });

    expect(result[1][1].isRevealed).toBe(false);
    expect(result[1][1].isFlagged).toBe(true);
  });

  it("terminates and reveals every cell exactly once on a fully-open board, without infinite looping", () => {
    const board = calculateAdjacentMines(createEmptyBoard(9, 9));
    const result = floodReveal(board, { row: 4, column: 4 });

    const revealedCount = result
      .flat()
      .filter((cell) => cell.isRevealed).length;
    expect(revealedCount).toBe(81);
  });
});
