import type { Board } from "./domain/entities/Board";
import type { Tile, TileType } from "./domain/entities/Tile";
import type { Rng } from "./domain/services/random";
import type { TileIdGenerator } from "./domain/services/tileFactory";

const TILE_BY_CHAR: Record<string, TileType> = {
  r: "ruby",
  s: "sapphire",
  e: "emerald",
  t: "topaz",
  a: "amethyst",
  o: "orange",
};

export function tile(type: TileType, id: string = type): Tile {
  return { id, type };
}

export function rowsToBoard(rows: string[]): Board {
  let nextId = 0;
  return rows.map((row) =>
    [...row].map((char) => {
      if (char === ".") return null;
      const type = TILE_BY_CHAR[char];
      if (!type) throw new Error(`Unknown test tile shorthand: ${char}`);
      return tile(type, `${char}-${nextId++}`);
    }),
  );
}

export function boardTypes(board: Board): string[][] {
  return board.map((row) =>
    row.map((cell) => (cell ? cell.type.slice(0, 1) : ".")),
  );
}

export function fixedRng(values: readonly number[]): Rng {
  let index = 0;
  return () => values[index++] ?? values.at(-1) ?? 0;
}

export function testIdGenerator(prefix = "test-tile"): TileIdGenerator {
  let nextId = 0;
  return () => `${prefix}-${nextId++}`;
}
