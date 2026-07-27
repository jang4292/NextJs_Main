import { describe, expect, it } from "vitest";
import { createDeck } from "../entities/Deck";
import { dealInitial } from "./dealInitial";

describe("dealInitial", () => {
  it("deals all 52 cards into 8 tableau columns", () => {
    const state = dealInitial(createDeck());
    expect(state.tableau).toHaveLength(8);

    const totalDealt = state.tableau.reduce(
      (sum, pile) => sum + pile.length,
      0,
    );
    expect(totalDealt).toBe(52);
  });

  it("deals 7 cards to the first four columns and 6 to the rest", () => {
    const state = dealInitial(createDeck());
    expect(state.tableau.slice(0, 4).map((pile) => pile.length)).toEqual([
      7, 7, 7, 7,
    ]);
    expect(state.tableau.slice(4).map((pile) => pile.length)).toEqual([
      6, 6, 6, 6,
    ]);
  });

  it("does not deal duplicate cards", () => {
    const state = dealInitial(createDeck());
    const ids = state.tableau.flat().map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("starts with empty free cells and foundations", () => {
    const state = dealInitial(createDeck());
    expect(state.freeCells).toEqual([null, null, null, null]);
    expect(
      Object.values(state.foundations).every((pile) => pile.length === 0),
    ).toBe(true);
  });

  it("starts in the playing status with zero move count and elapsed time", () => {
    const state = dealInitial(createDeck());
    expect(state.status).toBe("playing");
    expect(state.moveCount).toBe(0);
    expect(state.elapsedSeconds).toBe(0);
  });
});
