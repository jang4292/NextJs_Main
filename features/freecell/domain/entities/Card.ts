import type { Suit } from "../value-objects/Suit";
import type { CardColor } from "../value-objects/CardColor";
import { colorOfSuit } from "../value-objects/CardColor";

export interface Card {
  readonly id: string;
  readonly suit: Suit;
  readonly rank: number;
  readonly color: CardColor;
}

export function createCard(suit: Suit, rank: number): Card {
  return { id: `${rank}_${suit}`, suit, rank, color: colorOfSuit(suit) };
}
