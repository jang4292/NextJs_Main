import { describe, expect, it } from "vitest";
import { board, fixedRng } from "../../test-utils";
import { spawnRandomTile } from "./spawnTile";

describe("spawnRandomTile", () => {
  it("picks a deterministic empty cell and a '4' below the value threshold", () => {
    const input = board([
      [0, 0],
      [0, 0],
    ]);
    // 4 empty cells in row-major order: (0,0) (0,1) (1,0) (1,1) -> index floor(0.5*4)=2 -> (1,0)
    const result = spawnRandomTile(input, fixedRng([0.5, 0.05]));
    expect(result.spawned).toEqual({ row: 1, col: 0, value: 4 });
    expect(result.board[1][0]).toBe(4);
  });

  it("spawns a '2' at or above the value threshold", () => {
    const input = board([
      [0, 0],
      [0, 0],
    ]);
    const result = spawnRandomTile(input, fixedRng([0, 0.5]));
    expect(result.spawned).toEqual({ row: 0, col: 0, value: 2 });
  });

  it("does not mutate the input board", () => {
    const input = board([
      [0, 0],
      [0, 0],
    ]);
    spawnRandomTile(input, fixedRng([0, 0]));
    expect(input).toEqual([
      [0, 0],
      [0, 0],
    ]);
  });

  it("returns the same board reference and spawned:null when there is no empty cell", () => {
    const input = board([
      [2, 4],
      [8, 16],
    ]);
    const result = spawnRandomTile(input, fixedRng([]));
    expect(result.spawned).toBeNull();
    expect(result.board).toBe(input);
  });
});
