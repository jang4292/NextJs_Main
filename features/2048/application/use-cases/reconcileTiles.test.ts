import { describe, expect, it } from "vitest";
import type { CellTrace } from "../../domain/services/moveBoard";
import { reconcileTiles, tilesFromBoard, type Tile } from "./reconcileTiles";

function idGen(prefix = "id"): () => string {
  let count = 0;
  return () => `${prefix}-${count++}`;
}

describe("reconcileTiles", () => {
  it("preserves the source tile's id and value, moving it to the trace's destination", () => {
    const prevTiles: Tile[] = [{ id: "a", value: 2, row: 0, col: 2, isNew: false, isMerged: false }];
    const traces: CellTrace[] = [{ type: "move", from: [{ row: 0, col: 2 }], to: { row: 0, col: 0 }, value: 2 }];

    const result = reconcileTiles(prevTiles, traces, null, idGen());

    expect(result).toEqual([{ id: "a", value: 2, row: 0, col: 0, isNew: false, isMerged: false }]);
  });

  it("collapses a merge into the first source tile's id, doubles the value, and flags isMerged", () => {
    const prevTiles: Tile[] = [
      { id: "a", value: 2, row: 0, col: 0, isNew: false, isMerged: false },
      { id: "b", value: 2, row: 0, col: 2, isNew: false, isMerged: false },
    ];
    const traces: CellTrace[] = [
      { type: "merge", from: [{ row: 0, col: 0 }, { row: 0, col: 2 }], to: { row: 0, col: 0 }, value: 4 },
    ];

    const result = reconcileTiles(prevTiles, traces, null, idGen());

    expect(result).toEqual([{ id: "a", value: 4, row: 0, col: 0, isNew: false, isMerged: true }]);
  });

  it("appends a spawned tile with a fresh, deterministic id and isNew:true", () => {
    const result = reconcileTiles([], [], { row: 1, col: 1, value: 4 }, idGen("spawn"));

    expect(result).toEqual([{ id: "spawn-0", value: 4, row: 1, col: 1, isNew: true, isMerged: false }]);
  });
});

describe("tilesFromBoard", () => {
  it("builds one tile per nonzero cell in row-major order", () => {
    const tiles = tilesFromBoard(
      [
        [2, 0],
        [0, 4],
      ],
      idGen(),
    );

    expect(tiles).toEqual([
      { id: "id-0", value: 2, row: 0, col: 0, isNew: false, isMerged: false },
      { id: "id-1", value: 4, row: 1, col: 1, isNew: false, isMerged: false },
    ]);
  });
});
