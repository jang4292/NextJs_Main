import type { Card } from "../../domain/entities/Card";

export function getCardBackImagePath(): string {
  return "/images/cards/back.svg";
}

export function getCardImagePath(card: Card): string {
  return card.faceUp
    ? `/images/cards/${card.rank}_${card.suit}.svg`
    : getCardBackImagePath();
}
