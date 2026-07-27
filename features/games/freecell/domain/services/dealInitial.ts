import type { Card } from "../entities/Card";
import {
  createEmptyFoundations,
  TABLEAU_COLUMN_COUNT,
  FREE_CELL_COUNT,
  type GameState,
} from "../entities/GameState";

const COLUMN_SIZES = [7, 7, 7, 7, 6, 6, 6, 6];

export function dealInitial(shuffledDeck: readonly Card[]): GameState {
  const deck = [...shuffledDeck];
  const tableau: Card[][] = [];

  for (let column = 0; column < TABLEAU_COLUMN_COUNT; column++) {
    const pile: Card[] = [];
    for (let row = 0; row < COLUMN_SIZES[column]; row++) {
      const dealt = deck.shift();
      if (!dealt) throw new Error("Not enough cards to deal initial tableau");
      pile.push(dealt);
    }
    tableau.push(pile);
  }

  return {
    tableau,
    freeCells: Array.from({ length: FREE_CELL_COUNT }, () => null),
    foundations: createEmptyFoundations(),
    moveCount: 0,
    elapsedSeconds: 0,
    status: "playing",
  };
}
