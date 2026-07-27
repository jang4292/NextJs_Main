import type { Card } from "./Card";
import type { Suit } from "../value-objects/Suit";

export type Foundations = Record<Suit, Card[]>;

export type GameStatus = "ready" | "playing" | "won";

export const FREE_CELL_COUNT = 4;
export const TABLEAU_COLUMN_COUNT = 8;

export interface GameState {
  readonly tableau: readonly Card[][];
  readonly freeCells: ReadonlyArray<Card | null>;
  readonly foundations: Foundations;
  readonly moveCount: number;
  readonly elapsedSeconds: number;
  readonly status: GameStatus;
}

export function createEmptyFoundations(): Foundations {
  return { spades: [], hearts: [], diamonds: [], clubs: [] };
}
