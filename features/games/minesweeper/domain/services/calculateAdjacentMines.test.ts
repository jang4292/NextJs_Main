import { describe, expect, it } from "vitest";
import { boardFromLayout } from "../../test-utils";
import { calculateAdjacentMines } from "./calculateAdjacentMines";

describe("calculateAdjacentMines", () => {
  it("computes adjacent-mine counts for every non-mine cell, including corners and edges", () => {
    const board = boardFromLayout(["*..", "...", "..*"]);
    const result = calculateAdjacentMines(board);

    expect(result[0][1].adjacentMines).toBe(1);
    expect(result[0][2].adjacentMines).toBe(0);
    expect(result[1][0].adjacentMines).toBe(1);
    expect(result[1][1].adjacentMines).toBe(2);
    expect(result[1][2].adjacentMines).toBe(1);
    expect(result[2][0].adjacentMines).toBe(0);
    expect(result[2][1].adjacentMines).toBe(1);
  });

  it("leaves mine cells' adjacentMines untouched at 0", () => {
    const board = boardFromLayout(["*..", "...", "..*"]);
    const result = calculateAdjacentMines(board);

    expect(result[0][0].adjacentMines).toBe(0);
    expect(result[2][2].adjacentMines).toBe(0);
  });
});
