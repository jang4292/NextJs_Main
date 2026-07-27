import { describe, expect, it } from "vitest";
import { moveRowLeft } from "./moveRowLeft";

describe("moveRowLeft", () => {
  it("slides and merges a gap-separated pair", () => {
    const result = moveRowLeft([2, 0, 2, 4]);
    expect(result.row).toEqual([4, 4, 0, 0]);
    expect(result.moved).toBe(true);
  });

  it("merges each tile at most once, never double-merging four equal tiles", () => {
    const result = moveRowLeft([2, 2, 2, 2]);
    expect(result.row).toEqual([4, 4, 0, 0]);
  });

  it("merges a simple adjacent pair", () => {
    const result = moveRowLeft([2, 2, 0, 0]);
    expect(result.row).toEqual([4, 0, 0, 0]);
  });

  it("merges the first pair and slides the leftover tile", () => {
    const result = moveRowLeft([2, 2, 2, 0]);
    expect(result.row).toEqual([4, 2, 0, 0]);
  });

  it("merges two separate pairs and accumulates score", () => {
    const result = moveRowLeft([4, 4, 8, 8]);
    expect(result.row).toEqual([8, 16, 0, 0]);
    expect(result.scoreGained).toBe(24);
  });

  it("reports moved:false when the row is already fully packed with no merges", () => {
    const result = moveRowLeft([2, 4, 8, 16]);
    expect(result.row).toEqual([2, 4, 8, 16]);
    expect(result.moved).toBe(false);
    expect(result.scoreGained).toBe(0);
  });

  it("reports moved:false for an all-empty row", () => {
    const result = moveRowLeft([0, 0, 0, 0]);
    expect(result.moved).toBe(false);
  });

  it("produces a merge trace with ascending fromIndices and the correct toIndex", () => {
    const result = moveRowLeft([2, 0, 2, 4]);
    expect(result.trace).toEqual([
      { type: "merge", fromIndices: [0, 2], toIndex: 0, value: 4 },
      { type: "move", fromIndices: [3], toIndex: 1, value: 4 },
    ]);
  });
});
