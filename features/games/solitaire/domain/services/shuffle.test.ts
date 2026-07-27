import { describe, expect, it } from "vitest";
import { createDeck } from "../entities/Deck";
import { shuffleDeck } from "./shuffle";

describe("shuffleDeck", () => {
  it("keeps the same 52 cards after shuffling", () => {
    const deck = createDeck();
    const shuffled = shuffleDeck(deck);

    expect(shuffled).toHaveLength(52);
    expect(new Set(shuffled.map((card) => card.id))).toEqual(
      new Set(deck.map((card) => card.id)),
    );
  });

  it("does not mutate the input array", () => {
    const deck = createDeck();
    const originalOrder = deck.map((card) => card.id);
    shuffleDeck(deck);

    expect(deck.map((card) => card.id)).toEqual(originalOrder);
  });

  it("is deterministic given a fixed random function", () => {
    const deck = createDeck();
    const randomFn = (() => {
      let seed = 0.42;
      return () => {
        seed = (seed * 9301 + 49297) % 233280;
        return seed / 233280;
      };
    })();

    const first = shuffleDeck(deck, randomFn);
    const second = shuffleDeck(
      deck,
      (() => {
        let seed = 0.42;
        return () => {
          seed = (seed * 9301 + 49297) % 233280;
          return seed / 233280;
        };
      })(),
    );

    expect(first.map((card) => card.id)).toEqual(second.map((card) => card.id));
  });
});
