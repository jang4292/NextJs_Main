import { describe, expect, it } from "vitest";
import { calculateMoveCapacity } from "./moveCapacity";

describe("calculateMoveCapacity", () => {
  it("allows only 1 card with no empty free cells or tableau columns", () => {
    expect(calculateMoveCapacity(0, 0, false)).toBe(1);
  });

  it("scales linearly with empty free cells", () => {
    expect(calculateMoveCapacity(1, 0, false)).toBe(2);
    expect(calculateMoveCapacity(4, 0, false)).toBe(5);
  });

  it("scales geometrically with empty tableau columns", () => {
    expect(calculateMoveCapacity(0, 1, false)).toBe(2);
    expect(calculateMoveCapacity(0, 2, false)).toBe(4);
    expect(calculateMoveCapacity(0, 3, false)).toBe(8);
  });

  it("combines free cells and tableau columns", () => {
    expect(calculateMoveCapacity(2, 2, false)).toBe(12); // (2+1) * 2^2
  });

  it("excludes the destination column from the empty-tableau count when it is itself empty", () => {
    // 1 empty free cell, 1 empty tableau column which IS the destination -> 0 usable empty columns
    expect(calculateMoveCapacity(1, 1, true)).toBe(2); // (1+1) * 2^0
    // 1 empty free cell, 2 empty tableau columns, one of which is the destination -> 1 usable
    expect(calculateMoveCapacity(1, 2, true)).toBe(4); // (1+1) * 2^1
  });

  it("never goes negative when the destination is the only empty column", () => {
    expect(calculateMoveCapacity(0, 0, true)).toBe(1); // Math.max(-1, 0) => 0
  });
});
