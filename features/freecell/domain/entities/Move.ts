import type { GameState } from "./GameState";
import type { Suit } from "../value-objects/Suit";

export type CardLocation =
  | { type: "tableau"; columnIndex: number; cardIndex: number }
  | { type: "freeCell"; slotIndex: number }
  | { type: "foundation"; suit: Suit };

export interface MoveCommand {
  source: CardLocation;
  destination: CardLocation;
  cardIds: string[];
}

export type MoveFailureReason =
  | "INVALID_SEQUENCE"
  | "INVALID_DESTINATION"
  | "FREECELL_OCCUPIED"
  | "FOUNDATION_ORDER_MISMATCH"
  | "MOVE_CAPACITY_EXCEEDED";

export type MoveResult =
  | { success: true; nextState: GameState }
  | { success: false; reason: MoveFailureReason };

export function isSameLocation(a: CardLocation, b: CardLocation): boolean {
  if (a.type !== b.type) return false;
  if (a.type === "tableau" && b.type === "tableau") {
    return a.columnIndex === b.columnIndex && a.cardIndex === b.cardIndex;
  }
  if (a.type === "freeCell" && b.type === "freeCell") return a.slotIndex === b.slotIndex;
  if (a.type === "foundation" && b.type === "foundation") return a.suit === b.suit;
  return false;
}
