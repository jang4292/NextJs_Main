import { describe, expect, it } from "vitest";
import { fixedRng } from "../../test-utils";
import { restartGame } from "./restartGame";
import { revealCell } from "./revealCell";
import { startNewGame } from "./startNewGame";

describe("restartGame", () => {
  it("returns to the initial ready state, discarding all progress", () => {
    const difficulty = { rows: 3, columns: 3, mineCount: 2 };
    const played = revealCell(
      startNewGame(difficulty),
      { row: 1, column: 1 },
      fixedRng([0, 0]),
    );

    const restarted = restartGame(played);

    expect(restarted.status).toBe("ready");
    expect(restarted.minesPlaced).toBe(false);
    expect(restarted.difficulty).toBe(difficulty);
    restarted.board.forEach((row) =>
      row.forEach((cell) => {
        expect(cell.isRevealed).toBe(false);
        expect(cell.isFlagged).toBe(false);
        expect(cell.isMine).toBe(false);
      }),
    );
  });
});
