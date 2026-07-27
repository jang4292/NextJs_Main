import { describe, expect, it } from "vitest";
import { createDeck } from "../entities/Deck";
import { dealInitial } from "./dealInitial";

describe("dealInitial", () => {
  it("deals tableau columns of size 1..7 with only the last card face up", () => {
    const state = dealInitial(createDeck());

    state.tableau.forEach((pile, columnIndex) => {
      expect(pile).toHaveLength(columnIndex + 1);
      pile.forEach((card, cardIndex) => {
        expect(card.faceUp).toBe(cardIndex === pile.length - 1);
      });
    });
  });

  it("puts the remaining 24 cards face down in the stock", () => {
    const state = dealInitial(createDeck());

    expect(state.stock).toHaveLength(52 - (1 + 2 + 3 + 4 + 5 + 6 + 7));
    expect(state.stock.every((card) => card.faceUp === false)).toBe(true);
  });

  it("starts with an empty waste, empty foundations, and playing status", () => {
    const state = dealInitial(createDeck());

    expect(state.waste).toHaveLength(0);
    expect(state.status).toBe("playing");
    expect(
      Object.values(state.foundations).every((pile) => pile.length === 0),
    ).toBe(true);
  });
});
