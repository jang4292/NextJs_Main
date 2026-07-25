import type { Card } from "../entities/Card";

export function canPlaceOnTableau(moving: Card, targetTop: Card | null): boolean {
  if (!targetTop) return true;
  return moving.color !== targetTop.color && moving.rank === targetTop.rank - 1;
}

export function isValidSequence(cards: readonly Card[]): boolean {
  if (cards.length === 0) return false;
  for (let i = 1; i < cards.length; i++) {
    const previous = cards[i - 1];
    const current = cards[i];
    if (previous.color === current.color) return false;
    if (previous.rank !== current.rank + 1) return false;
  }
  return true;
}
