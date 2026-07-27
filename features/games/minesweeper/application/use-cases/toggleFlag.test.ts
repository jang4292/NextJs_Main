import { describe, expect, it } from "vitest";
import type { GameState } from "../../domain/entities/GameState";
import { startNewGame } from "./startNewGame";
import { toggleFlag } from "./toggleFlag";

function playingState(): GameState {
  return {
    ...startNewGame({ rows: 2, columns: 2, mineCount: 1 }),
    status: "playing",
    minesPlaced: true,
  };
}

describe("toggleFlag", () => {
  it("flags a closed cell", () => {
    const state = playingState();
    const result = toggleFlag(state, { row: 0, column: 0 });

    expect(result.board[0][0].isFlagged).toBe(true);
  });

  it("cannot flag an already-revealed cell", () => {
    const state = playingState();
    state.board[0][0].isRevealed = true;

    const result = toggleFlag(state, { row: 0, column: 0 });

    expect(result).toBe(state);
  });

  it("is a no-op once the game is won or lost", () => {
    const lostState: GameState = { ...playingState(), status: "lost" };
    const result = toggleFlag(lostState, { row: 0, column: 0 });

    expect(result).toBe(lostState);
  });
});
