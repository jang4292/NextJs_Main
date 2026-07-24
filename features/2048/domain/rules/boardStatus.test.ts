import { describe, expect, it } from "vitest";
import { hasAdjacentEqualPair, hasEmptyCell, hasReachedTarget, isGameOver } from "./boardStatus";

describe("hasEmptyCell", () => {
  it("is true when at least one cell is 0", () => {
    expect(hasEmptyCell([[2, 4], [8, 0]])).toBe(true);
  });

  it("is false when every cell is filled", () => {
    expect(hasEmptyCell([[2, 4], [8, 16]])).toBe(false);
  });
});

describe("hasAdjacentEqualPair", () => {
  it("detects a horizontal match", () => {
    expect(hasAdjacentEqualPair([[2, 2, 4, 8], [16, 32, 64, 128], [2, 4, 8, 16], [32, 64, 128, 2]])).toBe(true);
  });

  it("detects a vertical match", () => {
    expect(hasAdjacentEqualPair([[2, 4, 8, 16], [2, 32, 64, 128], [4, 8, 16, 2], [32, 64, 128, 4]])).toBe(true);
  });

  it("is false for a fully packed board with no equal neighbors", () => {
    expect(
      hasAdjacentEqualPair([
        [2, 4, 2, 4],
        [4, 2, 4, 2],
        [2, 4, 2, 4],
        [4, 2, 4, 2],
      ]),
    ).toBe(false);
  });

  it("ignores adjacent empty cells", () => {
    expect(hasAdjacentEqualPair([[0, 0], [0, 0]])).toBe(false);
  });
});

describe("isGameOver", () => {
  it("is false when an empty cell exists", () => {
    expect(isGameOver([[2, 0], [4, 8]])).toBe(false);
  });

  it("is false when the board is full but a merge is possible", () => {
    expect(isGameOver([[2, 2], [4, 8]])).toBe(false);
  });

  it("is true when the board is full and no merge is possible", () => {
    expect(
      isGameOver([
        [2, 4, 2, 4],
        [4, 2, 4, 2],
        [2, 4, 2, 4],
        [4, 2, 4, 2],
      ]),
    ).toBe(true);
  });
});

describe("hasReachedTarget", () => {
  it("is true once a tile meets the target value", () => {
    expect(hasReachedTarget([[2048, 0], [0, 0]])).toBe(true);
  });

  it("is false when no tile meets the target value", () => {
    expect(hasReachedTarget([[1024, 0], [0, 0]])).toBe(false);
  });

  it("respects a custom target", () => {
    expect(hasReachedTarget([[8, 0], [0, 0]], 8)).toBe(true);
  });
});
