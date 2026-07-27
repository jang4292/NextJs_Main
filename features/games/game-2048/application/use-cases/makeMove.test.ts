import { describe, expect, it } from "vitest";
import type { GameState } from "../../domain/entities/GameState";
import { board, fixedRng } from "../../test-utils";
import { makeMove } from "./makeMove";

function playingState(
  rows: number[][],
  overrides: Partial<GameState> = {},
): GameState {
  return {
    board: board(rows),
    score: 0,
    status: "playing",
    hasWon: false,
    ...overrides,
  };
}

describe("makeMove", () => {
  it("moves, merges, scores, and spawns a new tile in one call", () => {
    const state = playingState([
      [2, 2, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ]);

    // 15 empty cells after the merge; index 0 in row-major order is (0,1).
    const result = makeMove(state, "LEFT", fixedRng([0, 0.05]));

    expect(result.moved).toBe(true);
    expect(result.state.score).toBe(4);
    expect(result.spawned).toEqual({ row: 0, col: 1, value: 4 });
    expect(result.state.board[0]).toEqual([4, 4, 0, 0]);
    expect(result.state.status).toBe("playing");
  });

  it("returns the same state reference and does not spawn on a no-op move", () => {
    const state = playingState([
      [2, 4, 8, 16],
      [2, 4, 8, 16],
      [2, 4, 8, 16],
      [2, 4, 8, 16],
    ]);

    const result = makeMove(state, "LEFT", fixedRng([]));

    expect(result.moved).toBe(false);
    expect(result.spawned).toBeNull();
    expect(result.state).toBe(state);
  });

  it("sets hasWon once a tile reaches 2048 and keeps status playing", () => {
    const state = playingState([
      [1024, 1024, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ]);

    const result = makeMove(state, "LEFT", fixedRng([0, 0.5]));

    expect(result.state.hasWon).toBe(true);
    expect(result.state.status).toBe("playing");
    expect(result.state.board[0][0]).toBe(2048);
  });

  it("sets status to game-over once the resulting board has no more moves", () => {
    const state = playingState([
      [0, 2, 4, 8],
      [4, 2, 4, 2],
      [2, 4, 2, 4],
      [4, 2, 4, 2],
    ]);

    // Only one empty cell after the move, so any rng in [0,1) picks it.
    const result = makeMove(state, "LEFT", fixedRng([0, 0.05]));

    expect(result.state.board).toEqual([
      [2, 4, 8, 4],
      [4, 2, 4, 2],
      [2, 4, 2, 4],
      [4, 2, 4, 2],
    ]);
    expect(result.state.status).toBe("game-over");
  });

  it("is a no-op once the game is already over", () => {
    const state = playingState(
      [
        [2, 4, 2, 4],
        [4, 2, 4, 2],
        [2, 4, 2, 4],
        [4, 2, 4, 2],
      ],
      { status: "game-over" },
    );

    const result = makeMove(state, "LEFT", fixedRng([]));

    expect(result.moved).toBe(false);
    expect(result.state).toBe(state);
  });

  it("accumulates score across sequential moves", () => {
    const state = playingState([
      [2, 2, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ]);

    const first = makeMove(state, "LEFT", fixedRng([0, 0.05])); // spawns a 4 at (0,1) -> row0 [4,4,0,0]
    expect(first.state.score).toBe(4);

    const second = makeMove(first.state, "LEFT", fixedRng([0, 0.9])); // merges [4,4,0,0] -> [8,0,0,0]
    expect(second.state.score).toBe(4 + 8);
  });
});
