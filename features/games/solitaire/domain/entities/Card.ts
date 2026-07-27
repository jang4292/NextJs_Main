import type { Suit } from "../value-objects/Suit";
import type { Rank } from "../value-objects/Rank";
import type { CardColor } from "../value-objects/CardColor";
import { colorOfSuit } from "../value-objects/CardColor";

export interface Card {
  readonly id: string;
  readonly suit: Suit;
  readonly rank: Rank;
  readonly color: CardColor;
  readonly faceUp: boolean;
}

export function createCard(suit: Suit, rank: Rank, faceUp = false): Card {
  return {
    id: `${rank}_${suit}`,
    suit,
    rank,
    color: colorOfSuit(suit),
    faceUp,
  };
}

export function withFaceUp(card: Card, faceUp: boolean): Card {
  return card.faceUp === faceUp ? card : { ...card, faceUp };
}
