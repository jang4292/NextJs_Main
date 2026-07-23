import { describe, expect, it } from "vitest";
import { createCard } from "../entities/Card";
import { canPlaceOnTableau } from "./tableauRules";

describe("canPlaceOnTableau", () => {
  it("allows placing a card one rank lower with an opposite color on a non-empty pile", () => {
    const blackEight = createCard("spades", "8", true);
    const redSeven = createCard("hearts", "7", true);

    expect(canPlaceOnTableau(redSeven, blackEight)).toBe(true);
  });

  it("rejects same-color stacking", () => {
    const blackEight = createCard("spades", "8", true);
    const blackSeven = createCard("clubs", "7", true);

    expect(canPlaceOnTableau(blackSeven, blackEight)).toBe(false);
  });

  it("rejects non-descending rank", () => {
    const blackEight = createCard("spades", "8", true);
    const redNine = createCard("hearts", "9", true);

    expect(canPlaceOnTableau(redNine, blackEight)).toBe(false);
  });

  it("only allows a King on an empty pile", () => {
    const king = createCard("spades", "K", true);
    const queen = createCard("hearts", "Q", true);

    expect(canPlaceOnTableau(king, null)).toBe(true);
    expect(canPlaceOnTableau(queen, null)).toBe(false);
  });
});
