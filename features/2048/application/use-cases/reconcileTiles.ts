import type { Board } from "../../domain/entities/Board";
import type { CellTrace } from "../../domain/services/moveBoard";
import type { SpawnedTile } from "../../domain/services/spawnTile";

export interface Tile {
  id: string;
  value: number;
  row: number;
  col: number;
  isNew: boolean;
  isMerged: boolean;
}

function cellKey(row: number, col: number): string {
  return `${row}-${col}`;
}

/** Builds a tile list straight from a board, used for the very first render (no prior tiles to reconcile against). */
export function tilesFromBoard(board: Board, nextId: () => string): Tile[] {
  const tiles: Tile[] = [];
  board.forEach((rowValues, row) => {
    rowValues.forEach((value, col) => {
      if (value !== 0) {
        tiles.push({ id: nextId(), value, row, col, isNew: false, isMerged: false });
      }
    });
  });
  return tiles;
}

/**
 * Turns a moveBoard trace (+ any spawned tile) into a new stable-id Tile
 * list, by looking up which previous tile occupied each trace's source
 * cell(s). This is the only place tile identity exists — the domain layer
 * never deals with ids, only plain board values.
 */
export function reconcileTiles(
  prevTiles: readonly Tile[],
  traces: readonly CellTrace[],
  spawned: SpawnedTile | null,
  nextId: () => string,
): Tile[] {
  const prevByCell = new Map(prevTiles.map((tile) => [cellKey(tile.row, tile.col), tile]));
  const nextTiles: Tile[] = [];

  for (const trace of traces) {
    if (trace.type === "move") {
      const [from] = trace.from;
      const source = prevByCell.get(cellKey(from.row, from.col));
      if (!source) continue;
      nextTiles.push({
        id: source.id,
        value: trace.value,
        row: trace.to.row,
        col: trace.to.col,
        isNew: false,
        isMerged: false,
      });
    } else {
      const [survivorCell] = trace.from;
      const survivor = prevByCell.get(cellKey(survivorCell.row, survivorCell.col));
      nextTiles.push({
        id: survivor?.id ?? nextId(),
        value: trace.value,
        row: trace.to.row,
        col: trace.to.col,
        isNew: false,
        isMerged: true,
      });
    }
  }

  if (spawned) {
    nextTiles.push({
      id: nextId(),
      value: spawned.value,
      row: spawned.row,
      col: spawned.col,
      isNew: true,
      isMerged: false,
    });
  }

  return nextTiles;
}
