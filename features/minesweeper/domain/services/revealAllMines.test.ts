import { describe, expect, it } from "vitest";
import { boardFromLayout } from "../../test-utils";
import { revealAllMines } from "./revealAllMines";

describe("revealAllMines", () => {
  it("reveals every mine cell and leaves safe cells untouched", () => {
    const board = boardFromLayout(["*..", "...", "..*"]);
    const result = revealAllMines(board);

    expect(result[0][0].isRevealed).toBe(true);
    expect(result[2][2].isRevealed).toBe(true);
    expect(result[0][1].isRevealed).toBe(false);
    expect(result[1][1].isRevealed).toBe(false);
  });
});
