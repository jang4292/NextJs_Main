import { describe, expect, it } from "vitest";
import {
  getBoxIndex,
  getBoxPositions,
  getColumnPositions,
  getRowPositions,
  isPeer,
  isSameBox,
  isSameColumn,
  isSameRow,
} from "./unitRules";

describe("getBoxIndex", () => {
  it("maps corners to their box index", () => {
    expect(getBoxIndex({ row: 0, column: 0 })).toBe(0);
    expect(getBoxIndex({ row: 0, column: 8 })).toBe(2);
    expect(getBoxIndex({ row: 8, column: 0 })).toBe(6);
    expect(getBoxIndex({ row: 8, column: 8 })).toBe(8);
    expect(getBoxIndex({ row: 4, column: 4 })).toBe(4);
  });
});

describe("isSameRow / isSameColumn / isSameBox", () => {
  it("detects same row", () => {
    expect(isSameRow({ row: 2, column: 0 }, { row: 2, column: 8 })).toBe(true);
    expect(isSameRow({ row: 2, column: 0 }, { row: 3, column: 0 })).toBe(false);
  });

  it("detects same column", () => {
    expect(isSameColumn({ row: 0, column: 5 }, { row: 8, column: 5 })).toBe(
      true,
    );
    expect(isSameColumn({ row: 0, column: 5 }, { row: 0, column: 6 })).toBe(
      false,
    );
  });

  it("detects same box", () => {
    expect(isSameBox({ row: 0, column: 0 }, { row: 2, column: 2 })).toBe(true);
    expect(isSameBox({ row: 0, column: 0 }, { row: 3, column: 3 })).toBe(false);
  });
});

describe("isPeer", () => {
  it("is true for same row, column, or box", () => {
    expect(isPeer({ row: 1, column: 1 }, { row: 1, column: 7 })).toBe(true);
    expect(isPeer({ row: 1, column: 1 }, { row: 7, column: 1 })).toBe(true);
    expect(isPeer({ row: 1, column: 1 }, { row: 2, column: 2 })).toBe(true);
  });

  it("is false for unrelated positions", () => {
    expect(isPeer({ row: 1, column: 1 }, { row: 4, column: 5 })).toBe(false);
  });
});

describe("position collectors", () => {
  it("getRowPositions returns 9 positions in the row", () => {
    const positions = getRowPositions(3);
    expect(positions).toHaveLength(9);
    expect(positions.every((p) => p.row === 3)).toBe(true);
  });

  it("getColumnPositions returns 9 positions in the column", () => {
    const positions = getColumnPositions(4);
    expect(positions).toHaveLength(9);
    expect(positions.every((p) => p.column === 4)).toBe(true);
  });

  it("getBoxPositions returns the 9 positions of the containing box", () => {
    const positions = getBoxPositions({ row: 4, column: 4 });
    expect(positions).toHaveLength(9);
    expect(positions.every((p) => isSameBox(p, { row: 4, column: 4 }))).toBe(
      true,
    );
  });
});
