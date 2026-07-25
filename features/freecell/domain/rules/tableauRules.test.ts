import { describe, expect, it } from "vitest";
import { card } from "../../test-utils";
import { canPlaceOnTableau, isValidSequence } from "./tableauRules";

describe("canPlaceOnTableau", () => {
  it("allows placing a card on an empty column", () => {
    expect(canPlaceOnTableau(card("hearts", 7), null)).toBe(true);
  });

  it("allows a red 7 on a black 8 (alternating color, rank - 1)", () => {
    expect(canPlaceOnTableau(card("hearts", 7), card("spades", 8))).toBe(true);
  });

  it("allows a black jack on a red queen", () => {
    expect(canPlaceOnTableau(card("clubs", 11), card("diamonds", 12))).toBe(true);
  });

  it("rejects same-color placement (black 8 -> black 7)", () => {
    expect(canPlaceOnTableau(card("clubs", 7), card("spades", 8))).toBe(false);
  });

  it("rejects placement when the rank gap is not exactly one", () => {
    expect(canPlaceOnTableau(card("hearts", 6), card("spades", 8))).toBe(false);
  });
});

describe("isValidSequence", () => {
  it("accepts a single card", () => {
    expect(isValidSequence([card("hearts", 5)])).toBe(true);
  });

  it("accepts a descending alternating-color run", () => {
    expect(
      isValidSequence([card("spades", 9), card("hearts", 8), card("clubs", 7), card("diamonds", 6)]),
    ).toBe(true);
  });

  it("rejects a run with two same-color cards in a row", () => {
    expect(isValidSequence([card("spades", 9), card("clubs", 8)])).toBe(false);
  });

  it("rejects a run with a rank gap", () => {
    expect(isValidSequence([card("spades", 9), card("hearts", 7)])).toBe(false);
  });

  it("rejects an empty array", () => {
    expect(isValidSequence([])).toBe(false);
  });
});
