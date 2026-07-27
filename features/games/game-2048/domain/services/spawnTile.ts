import { cloneBoard, getEmptyCells, type Board } from "../entities/Board";

export interface SpawnedTile {
  row: number;
  col: number;
  value: 2 | 4;
}

export interface SpawnResult {
  board: Board;
  spawned: SpawnedTile | null;
}

const SPAWN_VALUE_4_PROBABILITY = 0.1;

/**
 * Places a random tile (90% "2", 10% "4") on a random empty cell. `rng` is
 * injectable so callers can test deterministically instead of depending on
 * Math.random.
 */
export function spawnRandomTile(
  board: Board,
  rng: () => number = Math.random,
): SpawnResult {
  const emptyCells = getEmptyCells(board);
  if (emptyCells.length === 0) {
    return { board, spawned: null };
  }

  const { row, col } = emptyCells[Math.floor(rng() * emptyCells.length)];
  const value: 2 | 4 = rng() < SPAWN_VALUE_4_PROBABILITY ? 4 : 2;

  const nextBoard = cloneBoard(board);
  nextBoard[row][col] = value;

  return { board: nextBoard, spawned: { row, col, value } };
}
