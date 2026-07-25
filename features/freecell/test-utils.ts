import { createCard, type Card } from "./domain/entities/Card";
import { createEmptyFoundations, type GameState } from "./domain/entities/GameState";
import type { Suit } from "./domain/value-objects/Suit";

export function card(suit: Suit, rank: number): Card {
  return createCard(suit, rank);
}

export function buildGameState(overrides: Partial<GameState> = {}): GameState {
  return {
    tableau: [[], [], [], [], [], [], [], []],
    freeCells: [null, null, null, null],
    foundations: createEmptyFoundations(),
    moveCount: 0,
    elapsedSeconds: 0,
    status: "playing",
    ...overrides,
  };
}
