import { describe, expect, it } from "vitest";
import { card, buildGameState } from "../../test-utils";
import { drawFromStock } from "./drawFromStock";

describe("drawFromStock", () => {
  it("moves the top stock card to the waste, face up", () => {
    const state = buildGameState({
      stock: [card("spades", "5", false), card("hearts", "9", false)],
    });

    const next = drawFromStock(state);

    expect(next.stock).toHaveLength(1);
    expect(next.waste).toHaveLength(1);
    expect(next.waste[0].id).toBe("9_hearts");
    expect(next.waste[0].faceUp).toBe(true);
  });

  it("is a no-op when the stock is empty", () => {
    const state = buildGameState({ stock: [] });
    const next = drawFromStock(state);

    expect(next).toBe(state);
  });
});
