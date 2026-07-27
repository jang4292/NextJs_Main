import { describe, expect, it } from "vitest";
import { getLines } from "./lines";

describe("getLines", () => {
  it("orders LEFT lines left-to-right per row", () => {
    expect(getLines("LEFT", 3)).toEqual([
      [
        { row: 0, col: 0 },
        { row: 0, col: 1 },
        { row: 0, col: 2 },
      ],
      [
        { row: 1, col: 0 },
        { row: 1, col: 1 },
        { row: 1, col: 2 },
      ],
      [
        { row: 2, col: 0 },
        { row: 2, col: 1 },
        { row: 2, col: 2 },
      ],
    ]);
  });

  it("orders RIGHT lines right-to-left per row", () => {
    expect(getLines("RIGHT", 3)).toEqual([
      [
        { row: 0, col: 2 },
        { row: 0, col: 1 },
        { row: 0, col: 0 },
      ],
      [
        { row: 1, col: 2 },
        { row: 1, col: 1 },
        { row: 1, col: 0 },
      ],
      [
        { row: 2, col: 2 },
        { row: 2, col: 1 },
        { row: 2, col: 0 },
      ],
    ]);
  });

  it("orders UP lines top-to-bottom per column", () => {
    expect(getLines("UP", 3)).toEqual([
      [
        { row: 0, col: 0 },
        { row: 1, col: 0 },
        { row: 2, col: 0 },
      ],
      [
        { row: 0, col: 1 },
        { row: 1, col: 1 },
        { row: 2, col: 1 },
      ],
      [
        { row: 0, col: 2 },
        { row: 1, col: 2 },
        { row: 2, col: 2 },
      ],
    ]);
  });

  it("orders DOWN lines bottom-to-top per column", () => {
    expect(getLines("DOWN", 3)).toEqual([
      [
        { row: 2, col: 0 },
        { row: 1, col: 0 },
        { row: 0, col: 0 },
      ],
      [
        { row: 2, col: 1 },
        { row: 1, col: 1 },
        { row: 0, col: 1 },
      ],
      [
        { row: 2, col: 2 },
        { row: 1, col: 2 },
        { row: 0, col: 2 },
      ],
    ]);
  });
});
