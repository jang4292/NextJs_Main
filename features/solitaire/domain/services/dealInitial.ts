import type { Card } from "../entities/Card";
import { withFaceUp } from "../entities/Card";
import { createEmptyFoundations, type GameState } from "../entities/GameState";

export function dealInitial(shuffledDeck: readonly Card[]): GameState {
  const deck = [...shuffledDeck];
  const tableau: Card[][] = [];

  for (let column = 0; column < 7; column++) {
    const pile: Card[] = [];
    for (let row = 0; row <= column; row++) {
      const card = deck.shift();
      if (!card) throw new Error("Not enough cards to deal initial tableau");
      pile.push(withFaceUp(card, row === column));
    }
    tableau.push(pile);
  }

  return {
    tableau,
    foundations: createEmptyFoundations(),
    stock: deck,
    waste: [],
    status: "playing",
  };
}
