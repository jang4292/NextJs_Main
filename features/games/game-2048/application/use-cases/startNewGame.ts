import { createEmptyBoard, type Board } from "../../domain/entities/Board";
import type { GameState } from "../../domain/entities/GameState";
import { spawnRandomTile } from "../../domain/services/spawnTile";

export function startNewGame(rng: () => number = Math.random): GameState {
  let board: Board = createEmptyBoard();
  board = spawnRandomTile(board, rng).board;
  board = spawnRandomTile(board, rng).board;

  return { board, score: 0, status: "playing", hasWon: false };
}
