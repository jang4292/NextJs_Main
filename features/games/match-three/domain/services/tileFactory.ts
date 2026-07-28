import type { Tile, TileType } from "../entities/Tile";

export type TileIdGenerator = () => string;

export function createSequentialTileIdGenerator(
  prefix = "match-three-tile",
): TileIdGenerator {
  let nextId = 0;
  return () => `${prefix}-${nextId++}`;
}

export function createTile(type: TileType, nextId: TileIdGenerator): Tile {
  return {
    id: nextId(),
    type,
  };
}
