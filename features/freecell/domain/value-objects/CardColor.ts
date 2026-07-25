import type { Suit } from "./Suit";

export type CardColor = "red" | "black";

export function colorOfSuit(suit: Suit): CardColor {
  return suit === "hearts" || suit === "diamonds" ? "red" : "black";
}
