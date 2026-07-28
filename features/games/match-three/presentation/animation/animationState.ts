import type { Board } from "../../domain/entities/Board";
import type { Position } from "../../domain/entities/Position";
import type { Tile } from "../../domain/entities/Tile";
import type { GeneratedTile } from "../../domain/services/boardCollapser";

export interface TileView {
  tile: Tile;
  position: Position;
}

export interface BoardPoint {
  row: number;
  column: number;
}

export interface GeneratedTileOffset {
  rowOffset: number;
  columnOffset: number;
}

export interface BoardSummary {
  nullCount: number;
  tileIds: string[];
}

export function createTileViews(board: Board): TileView[] {
  const views: TileView[] = [];

  for (let row = 0; row < board.length; row++) {
    for (let column = 0; column < (board[row]?.length ?? 0); column++) {
      const tile = board[row][column];
      if (!tile) continue;
      views.push({ tile, position: { row, column } });
    }
  }

  return views;
}

export function summarizeBoard(board: Board): BoardSummary {
  let nullCount = 0;
  const tileIds: string[] = [];

  for (const row of board) {
    for (const cell of row) {
      if (cell) {
        tileIds.push(cell.id);
      } else {
        nullCount++;
      }
    }
  }

  return { nullCount, tileIds };
}

export function createTilePositionMap(board: Board): Map<string, Position> {
  return new Map(
    createTileViews(board).map(({ tile, position }) => [tile.id, position]),
  );
}

export function collectTileIdsAtPositions(
  board: Board,
  positions: readonly Position[],
): string[] {
  return positions
    .map((position) => board[position.row]?.[position.column]?.id)
    .filter((tileId): tileId is string => Boolean(tileId));
}

export function calculateScorePopPosition(
  positions: readonly Position[],
): BoardPoint {
  if (positions.length === 0) return { row: 0, column: 0 };

  const total = positions.reduce(
    (acc, position) => ({
      row: acc.row + position.row,
      column: acc.column + position.column,
    }),
    { row: 0, column: 0 },
  );

  return {
    row: total.row / positions.length,
    column: total.column / positions.length,
  };
}

export function collectSwapTileIds(
  board: Board,
  first: Position,
  second: Position,
): string[] {
  return collectTileIdsAtPositions(board, [first, second]);
}

export function createGeneratedTileOffsets(
  generatedTiles: readonly GeneratedTile[],
): Record<string, GeneratedTileOffset> {
  return Object.fromEntries(
    generatedTiles.map(({ tile, from, to }) => [
      tile.id,
      {
        rowOffset: from.row - to.row,
        columnOffset: from.column - to.column,
      },
    ]),
  );
}
