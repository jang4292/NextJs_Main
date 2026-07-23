import { describe, expect, it } from "vitest";
import { createCard } from "../entities/Card";
import { createEmptyFoundations, type GameState } from "../entities/GameState";
import { isGameWon } from "./winCheck";

function buildState(foundationSizes: Record<string, number>): GameState {
  const foundations = createEmptyFoundations();
  for (const suit of Object.keys(foundations) as Array<keyof typeof foundations>) {
    const size = foundationSizes[suit] ?? 0;
    foundations[suit] = Array.from({ length: size }, () => createCard(suit, "A", true));
  }

  return {
    tableau: [],
    foundations,
    stock: [],
    waste: [],
    status: "playing",
  };
}

describe("isGameWon", () => {
  it("is false when fewer than 52 cards are in the foundations", () => {
    const state = buildState({ spades: 13, hearts: 13, diamonds: 13, clubs: 12 });
    expect(isGameWon(state)).toBe(false);
  });

  it("is true when all 52 cards are in the foundations", () => {
    const state = buildState({ spades: 13, hearts: 13, diamonds: 13, clubs: 13 });
    expect(isGameWon(state)).toBe(true);
  });
});
