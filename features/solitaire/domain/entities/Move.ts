import type { Suit } from "../value-objects/Suit";

export type MoveSource =
  | { zone: "tableau"; column: number; cardIndex: number }
  | { zone: "waste" };

export type MoveTarget =
  | { zone: "tableau"; column: number }
  | { zone: "foundation"; suit: Suit };
