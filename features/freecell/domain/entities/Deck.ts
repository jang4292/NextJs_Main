import { SUITS } from "../value-objects/Suit";
import { RANKS } from "../value-objects/Rank";
import { createCard, type Card } from "./Card";

export function createDeck(): Card[] {
  const deck: Card[] = [];
  for (const suit of SUITS) {
    for (const rank of RANKS) {
      deck.push(createCard(suit, rank));
    }
  }
  return deck;
}
