import type { Card } from "../entities/Card";
import { rankValue } from "../value-objects/Rank";

export function canPlaceOnTableau(moving: Card, target: Card | null): boolean {
  if (!target) return moving.rank === "K";
  return (
    moving.color !== target.color &&
    rankValue(moving.rank) === rankValue(target.rank) - 1
  );
}
