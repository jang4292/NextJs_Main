import { createDeck } from "../../domain/entities/Deck";
import { shuffleDeck } from "../../domain/services/shuffle";
import { dealInitial } from "../../domain/services/dealInitial";
import type { GameState } from "../../domain/entities/GameState";

export function startNewGame(randomFn: () => number = Math.random): GameState {
  return dealInitial(shuffleDeck(createDeck(), randomFn));
}
