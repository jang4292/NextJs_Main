import { describe, expect, it } from "vitest";
import { canEditCell, isInputLocked } from "./cellGuards";
import type { SudokuCell } from "../entities/SudokuCell";

function makeCell(overrides: Partial<SudokuCell> = {}): SudokuCell {
  return {
    row: 0,
    column: 0,
    value: 0,
    solution: 5,
    isFixed: false,
    isError: false,
    ...overrides,
  };
}

describe("canEditCell", () => {
  it("returns false for fixed cells", () => {
    expect(canEditCell(makeCell({ isFixed: true }))).toBe(false);
  });

  it("returns true for non-fixed cells", () => {
    expect(canEditCell(makeCell({ isFixed: false }))).toBe(true);
  });
});

describe("isInputLocked", () => {
  it("locks input when paused", () => {
    expect(isInputLocked("paused")).toBe(true);
  });

  it("locks input when completed", () => {
    expect(isInputLocked("completed")).toBe(true);
  });

  it("does not lock input when ready or playing", () => {
    expect(isInputLocked("ready")).toBe(false);
    expect(isInputLocked("playing")).toBe(false);
  });
});
