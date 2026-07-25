import type { Card } from "../entities/Card";

export function canPlaceOnFoundation(moving: Card, foundationPile: readonly Card[]): boolean {
  const top = foundationPile[foundationPile.length - 1];
  if (!top) return moving.rank === 1;
  return moving.suit === top.suit && moving.rank === top.rank + 1;
}
