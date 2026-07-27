import type { Card } from "../entities/Card";
import { nextRank } from "../value-objects/Rank";

export function canPlaceOnFoundation(
  moving: Card,
  foundationPile: readonly Card[],
): boolean {
  const top = foundationPile[foundationPile.length - 1];
  if (!top) return moving.rank === "A";
  return moving.suit === top.suit && nextRank(top.rank) === moving.rank;
}
