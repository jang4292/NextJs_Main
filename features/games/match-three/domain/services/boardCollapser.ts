import type { MatchThreeConfig } from "../../config/gameConfig";
import { DEFAULT_MATCH_THREE_CONFIG } from "../../config/gameConfig";
import { createEmptyBoard, type Board } from "../entities/Board";
import type { Position } from "../entities/Position";
import type { Tile } from "../entities/Tile";
import { randomIndex, type Rng } from "./random";
import {
  createSequentialTileIdGenerator,
  createTile,
  type TileIdGenerator,
} from "./tileFactory";

export interface TileMovement {
  tileId: string;
  from: Position;
  to: Position;
}

export interface GeneratedTile {
  tile: Tile;
  from: Position;
  to: Position;
}

export interface CollapseResult {
  board: Board;
  movements: TileMovement[];
  generated: GeneratedTile[];
}

export function collapseAndRefillBoard(
  board: Board,
  config: MatchThreeConfig = DEFAULT_MATCH_THREE_CONFIG,
  rng: Rng = Math.random,
  nextId: TileIdGenerator = createSequentialTileIdGenerator(),
): CollapseResult {
  const rows = board.length;
  const columns = board[0]?.length ?? 0;
  const next = createEmptyBoard(rows, columns);
  const movements: TileMovement[] = [];
  const generated: GeneratedTile[] = [];

  for (let column = 0; column < columns; column++) {
    let targetRow = rows - 1;

    for (let row = rows - 1; row >= 0; row--) {
      const tile = board[row][column];
      if (!tile) continue;

      next[targetRow][column] = tile;
      if (targetRow !== row) {
        movements.push({
          tileId: tile.id,
          from: { row, column },
          to: { row: targetRow, column },
        });
      }
      targetRow--;
    }

    const emptyCount = targetRow + 1;
    for (let row = targetRow; row >= 0; row--) {
      const tileType =
        config.tileTypes[randomIndex(config.tileTypes.length, rng)];
      const tile = createTile(tileType, nextId);
      next[row][column] = tile;
      generated.push({
        tile,
        from: { row: row - emptyCount, column },
        to: { row, column },
      });
    }
  }

  return { board: next, movements, generated };
}
