import type { Card } from "../entities/Card";

export function canPlaceOnFreeCell(slot: Card | null): boolean {
  return slot === null;
}
