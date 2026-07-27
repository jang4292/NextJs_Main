import type { Direction } from "../../domain/entities/Direction";
import type { GameState } from "../../domain/entities/GameState";
import { hasReachedTarget, isGameOver } from "../../domain/rules/boardStatus";
import { moveBoard, type CellTrace } from "../../domain/services/moveBoard";
import {
  spawnRandomTile,
  type SpawnedTile,
} from "../../domain/services/spawnTile";

export interface MakeMoveResult {
  state: GameState;
  moved: boolean;
  spawned: SpawnedTile | null;
  traces: CellTrace[];
}

/**
 * The single entrypoint every input path (swipe, drag, keyboard) calls.
 * A move that doesn't change the board never spawns a tile, and returns the
 * exact same GameState reference so callers can detect a no-op by identity.
 */
export function makeMove(
  state: GameState,
  direction: Direction,
  rng: () => number = Math.random,
): MakeMoveResult {
  if (state.status === "game-over") {
    return { state, moved: false, spawned: null, traces: [] };
  }

  const moveResult = moveBoard(state.board, direction);
  if (!moveResult.moved) {
    return { state, moved: false, spawned: null, traces: [] };
  }

  const spawnResult = spawnRandomTile(moveResult.board, rng);
  const board = spawnResult.board;
  const score = state.score + moveResult.scoreGained;
  const hasWon = state.hasWon || hasReachedTarget(board);
  const status = isGameOver(board) ? "game-over" : "playing";

  return {
    state: { board, score, status, hasWon },
    moved: true,
    spawned: spawnResult.spawned,
    traces: moveResult.traces,
  };
}
