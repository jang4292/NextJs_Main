import { describe, expect, it } from "vitest";
import { rowsToBoard } from "../../test-utils";
import {
  calculateScorePopPosition,
  createGeneratedTileOffsets,
  collectSwapTileIds,
  collectTileIdsAtPositions,
  createTilePositionMap,
  createTileViews,
  summarizeBoard,
} from "./animationState";

describe("match-three animation helpers", () => {
  it("creates tile views and a tile id position map from a board", () => {
    const board = rowsToBoard(["rs.", ".ea"]);
    const views = createTileViews(board);
    const positions = createTilePositionMap(board);

    expect(views).toHaveLength(4);
    expect(positions.get("r-0")).toEqual({ row: 0, column: 0 });
    expect(positions.get("a-3")).toEqual({ row: 1, column: 2 });
  });

  it("summarizes null cells and visible tile ids for debug logging", () => {
    expect(summarizeBoard(rowsToBoard(["rs.", ".ea"]))).toEqual({
      nullCount: 2,
      tileIds: ["r-0", "s-1", "e-2", "a-3"],
    });
  });

  it("collects tile ids at specific board positions", () => {
    const board = rowsToBoard(["rse", "eta", "aor"]);

    expect(
      collectTileIdsAtPositions(board, [
        { row: 0, column: 1 },
        { row: 1, column: 1 },
      ]),
    ).toEqual(["s-1", "t-4"]);
  });

  it("calculates the score pop position from removed coordinates", () => {
    expect(
      calculateScorePopPosition([
        { row: 1, column: 1 },
        { row: 1, column: 2 },
        { row: 1, column: 3 },
        { row: 2, column: 2 },
      ]),
    ).toEqual({ row: 1.25, column: 2 });
  });

  it("extracts swap animation ids from the original board", () => {
    const board = rowsToBoard(["rse", "eta", "aor"]);

    expect(
      collectSwapTileIds(
        board,
        { row: 0, column: 0 },
        { row: 0, column: 1 },
      ),
    ).toEqual(["r-0", "s-1"]);
  });

  it("creates generated tile offsets from spawn and target positions", () => {
    expect(
      createGeneratedTileOffsets([
        {
          tile: { id: "new-1", type: "ruby" },
          from: { row: -3, column: 2 },
          to: { row: 0, column: 2 },
        },
      ]),
    ).toEqual({
      "new-1": {
        rowOffset: -3,
        columnOffset: 0,
      },
    });
  });
});
