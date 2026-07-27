import { describe, expect, it } from "vitest";
import { startNewGame } from "./startNewGame";
import { toSnapshot } from "./toSnapshot";

describe("toSnapshot", () => {
  it("computes remainingMines as mineCount minus flagged cells", () => {
    const state = startNewGame({ rows: 2, columns: 2, mineCount: 3 });
    state.board[0][0].isFlagged = true;

    const snapshot = toSnapshot(state);

    expect(snapshot.remainingMines).toBe(2);
    expect(snapshot.status).toBe("ready");
  });

  it("returns a board that is a separate copy from the source state", () => {
    const state = startNewGame({ rows: 2, columns: 2, mineCount: 1 });
    const snapshot = toSnapshot(state);

    expect(snapshot.board).not.toBe(state.board);
    expect(snapshot.board).toEqual(state.board);
  });
});
