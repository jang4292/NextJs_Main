import { describe, expect, it } from "vitest";
import { areAdjacent, isWithinBoard, movePosition } from "./positionRules";

describe("positionRules", () => {
  it("accepts all four orthogonal adjacent positions", () => {
    const center = { row: 2, column: 2 };

    expect(areAdjacent(center, { row: 1, column: 2 })).toBe(true);
    expect(areAdjacent(center, { row: 3, column: 2 })).toBe(true);
    expect(areAdjacent(center, { row: 2, column: 1 })).toBe(true);
    expect(areAdjacent(center, { row: 2, column: 3 })).toBe(true);
  });

  it("rejects diagonal and distant positions", () => {
    const center = { row: 2, column: 2 };

    expect(areAdjacent(center, { row: 1, column: 1 })).toBe(false);
    expect(areAdjacent(center, { row: 2, column: 4 })).toBe(false);
  });

  it("checks board bounds", () => {
    const size = { rows: 8, columns: 8 };

    expect(isWithinBoard({ row: 0, column: 0 }, size)).toBe(true);
    expect(isWithinBoard({ row: 7, column: 7 }, size)).toBe(true);
    expect(isWithinBoard({ row: -1, column: 0 }, size)).toBe(false);
    expect(isWithinBoard({ row: 8, column: 0 }, size)).toBe(false);
  });

  it("moves a position by direction", () => {
    const position = { row: 3, column: 3 };

    expect(movePosition(position, "UP")).toEqual({ row: 2, column: 3 });
    expect(movePosition(position, "DOWN")).toEqual({ row: 4, column: 3 });
    expect(movePosition(position, "LEFT")).toEqual({ row: 3, column: 2 });
    expect(movePosition(position, "RIGHT")).toEqual({ row: 3, column: 4 });
  });
});
