import { describe, expect, it } from "vitest";
import { fixedRng } from "../test-utils";
import { createMinesweeperGame } from "./MinesweeperGame";

// 2x2 board, 1 mine: clicking a corner never floods the whole board (every
// cell has an adjacent-mine count of at least 1 unless it IS the mine), so
// the game stays "playing" instead of immediately auto-winning - unlike a
// too-small board where the very first reveal would also be the last safe
// cell. With candidates built by excluding the clicked cell in row-major
// order, fixedRng([0]) deterministically places the mine at the first
// remaining candidate.
const DIFFICULTY = { rows: 2, columns: 2, mineCount: 1 };

describe("createMinesweeperGame", () => {
  it("starts ready, then reveal/toggleFlag/restart drive it through the same rules as the use-cases", () => {
    const game = createMinesweeperGame(DIFFICULTY, fixedRng([0]));

    expect(game.getSnapshot().status).toBe("ready");

    const afterReveal = game.reveal({ row: 0, column: 0 });
    expect(afterReveal.status).toBe("playing");
    expect(afterReveal.board[0][0].isRevealed).toBe(true);
    // mine placed at (0,1) given the deterministic rng above
    expect(afterReveal.board[0][1].isMine).toBe(true);

    const afterFlag = game.toggleFlag({ row: 1, column: 1 });
    expect(afterFlag.board[1][1].isFlagged).toBe(true);

    const afterRestart = game.restart();
    expect(afterRestart.status).toBe("ready");
    expect(afterRestart.board[1][1].isFlagged).toBe(false);
  });

  it("ignores further input once the game is lost", () => {
    const game = createMinesweeperGame(DIFFICULTY, fixedRng([0]));

    game.reveal({ row: 0, column: 0 }); // safe reveal, mine lands on (0,1)
    const lost = game.reveal({ row: 0, column: 1 }); // clicks the mine
    expect(lost.status).toBe("lost");

    const afterLostInput = game.toggleFlag({ row: 1, column: 0 });
    expect(afterLostInput.status).toBe("lost");
    expect(afterLostInput.board[1][0].isFlagged).toBe(false);
  });
});
