import { describe, expect, it } from "vitest";
import { createCard } from "../entities/Card";
import { canPlaceOnFoundation } from "./foundationRules";

describe("canPlaceOnFoundation", () => {
  it("only allows an Ace on an empty foundation", () => {
    const ace = createCard("spades", "A", true);
    const two = createCard("spades", "2", true);

    expect(canPlaceOnFoundation(ace, [])).toBe(true);
    expect(canPlaceOnFoundation(two, [])).toBe(false);
  });

  it("requires the same suit and ascending rank", () => {
    const foundation = [createCard("spades", "A", true), createCard("spades", "2", true)];
    const sameSuitNext = createCard("spades", "3", true);
    const differentSuit = createCard("hearts", "3", true);
    const wrongRank = createCard("spades", "4", true);

    expect(canPlaceOnFoundation(sameSuitNext, foundation)).toBe(true);
    expect(canPlaceOnFoundation(differentSuit, foundation)).toBe(false);
    expect(canPlaceOnFoundation(wrongRank, foundation)).toBe(false);
  });
});
