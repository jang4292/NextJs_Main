import { describe, expect, it } from "vitest";
import { card, buildGameState } from "../../test-utils";
import { recycleWaste } from "./recycleWaste";

describe("recycleWaste", () => {
  it("moves the waste back to the stock, face down, in reversed order", () => {
    const state = buildGameState({
      stock: [],
      waste: [card("spades", "5", true), card("hearts", "9", true)],
    });

    const next = recycleWaste(state);

    expect(next.waste).toHaveLength(0);
    expect(next.stock.map((c) => c.id)).toEqual(["9_hearts", "5_spades"]);
    expect(next.stock.every((c) => c.faceUp === false)).toBe(true);
  });

  it("is a no-op when the stock still has cards", () => {
    const state = buildGameState({
      stock: [card("clubs", "2", false)],
      waste: [card("spades", "5", true)],
    });

    const next = recycleWaste(state);
    expect(next).toBe(state);
  });

  it("is a no-op when the waste is empty", () => {
    const state = buildGameState({ stock: [], waste: [] });
    const next = recycleWaste(state);
    expect(next).toBe(state);
  });
});
