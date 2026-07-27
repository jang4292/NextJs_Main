import { describe, expect, it } from "vitest";
import { createDeck } from "../entities/Deck";
import { shuffleDeck } from "./shuffle";

describe("shuffleDeck", () => {
  it("keeps the same 52 cards, only reordered", () => {
    const deck = createDeck();
    const shuffled = shuffleDeck(deck, () => 0.42);

    expect(shuffled).toHaveLength(52);
    expect(new Set(shuffled.map((c) => c.id))).toEqual(
      new Set(deck.map((c) => c.id)),
    );
  });

  it("does not mutate the input array", () => {
    const deck = createDeck();
    const before = [...deck];
    shuffleDeck(deck, () => 0.1);
    expect(deck).toEqual(before);
  });

  it("is deterministic for a given random function", () => {
    const deckA = shuffleDeck(createDeck(), () => 0.5);
    const deckB = shuffleDeck(createDeck(), () => 0.5);
    expect(deckA.map((c) => c.id)).toEqual(deckB.map((c) => c.id));
  });
});
