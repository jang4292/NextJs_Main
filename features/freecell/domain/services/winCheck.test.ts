import { describe, expect, it } from "vitest";
import { card, buildGameState } from "../../test-utils";
import { isGameWon } from "./winCheck";

describe("isGameWon", () => {
  it("is false for a fresh game", () => {
    expect(isGameWon(buildGameState())).toBe(false);
  });

  it("is true once all 52 cards are in the foundations", () => {
    const fullPile = Array.from({ length: 13 }, (_, index) => card("spades", index + 1));
    const state = buildGameState({
      foundations: {
        spades: fullPile,
        hearts: fullPile,
        diamonds: fullPile,
        clubs: fullPile,
      },
    });
    expect(isGameWon(state)).toBe(true);
  });
});
