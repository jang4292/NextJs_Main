import { describe, expect, it } from "vitest";
import { BEGINNER } from "../../domain/entities/Difficulty";
import { startNewGame } from "./startNewGame";

describe("startNewGame", () => {
  it("starts in the ready status with no mines placed yet", () => {
    const state = startNewGame();

    expect(state.status).toBe("ready");
    expect(state.minesPlaced).toBe(false);
    expect(state.difficulty).toBe(BEGINNER);
  });

  it("builds a board matching the given difficulty", () => {
    const difficulty = { rows: 5, columns: 6, mineCount: 3 };
    const state = startNewGame(difficulty);

    expect(state.board).toHaveLength(5);
    state.board.forEach((row) => expect(row).toHaveLength(6));
  });
});
