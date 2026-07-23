import { describe, expect, it } from "vitest";
import { createDeck } from "./Deck";

describe("createDeck", () => {
  it("creates 52 unique cards", () => {
    const deck = createDeck();
    expect(deck).toHaveLength(52);
    expect(new Set(deck.map((card) => card.id)).size).toBe(52);
  });

  it("creates all cards face down", () => {
    const deck = createDeck();
    expect(deck.every((card) => card.faceUp === false)).toBe(true);
  });

  it("assigns red color to hearts and diamonds, black to spades and clubs", () => {
    const deck = createDeck();
    for (const card of deck) {
      const expectedColor = card.suit === "hearts" || card.suit === "diamonds" ? "red" : "black";
      expect(card.color).toBe(expectedColor);
    }
  });
});
