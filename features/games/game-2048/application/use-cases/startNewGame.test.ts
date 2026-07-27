import { describe, expect, it } from "vitest";
import { fixedRng } from "../../test-utils";
import { startNewGame } from "./startNewGame";

describe("startNewGame", () => {
  it("starts with exactly two nonzero tiles, zero score, and playing status", () => {
    const state = startNewGame(fixedRng([0, 0.5, 0.99, 0.5]));
    const nonZeroCount = state.board
      .flat()
      .filter((value) => value !== 0).length;

    expect(nonZeroCount).toBe(2);
    expect(state.score).toBe(0);
    expect(state.status).toBe("playing");
    expect(state.hasWon).toBe(false);
  });

  it("is deterministic for a given rng sequence", () => {
    const rngSequence = [0, 0.5, 0.99, 0.05];
    const stateA = startNewGame(fixedRng(rngSequence));
    const stateB = startNewGame(fixedRng(rngSequence));
    expect(stateA.board).toEqual(stateB.board);
  });
});
