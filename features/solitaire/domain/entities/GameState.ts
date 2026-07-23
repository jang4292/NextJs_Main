import type { Card } from "./Card";
import type { Suit } from "../value-objects/Suit";

export type Foundations = Record<Suit, Card[]>;

export interface GameState {
  readonly tableau: readonly Card[][];
  readonly foundations: Foundations;
  readonly stock: readonly Card[];
  readonly waste: readonly Card[];
  readonly status: "playing" | "won";
}

export function createEmptyFoundations(): Foundations {
  return { spades: [], hearts: [], diamonds: [], clubs: [] };
}
