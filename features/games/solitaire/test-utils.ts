import { createCard, type Card } from "./domain/entities/Card";
import {
  createEmptyFoundations,
  type GameState,
} from "./domain/entities/GameState";
import type { Rank } from "./domain/value-objects/Rank";
import type { Suit } from "./domain/value-objects/Suit";

export function card(suit: Suit, rank: Rank, faceUp = true): Card {
  return createCard(suit, rank, faceUp);
}

export function buildGameState(overrides: Partial<GameState> = {}): GameState {
  return {
    tableau: [[], [], [], [], [], [], []],
    foundations: createEmptyFoundations(),
    stock: [],
    waste: [],
    status: "playing",
    ...overrides,
  };
}
