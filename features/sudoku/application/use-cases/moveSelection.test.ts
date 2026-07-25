import { describe, expect, it } from "vitest";
import { moveSelection } from "./moveSelection";
import { buildBoard } from "../../test-utils";
import type { SudokuGameState } from "../../domain/entities/GameState";

function makeState(overrides: Partial<SudokuGameState> = {}): SudokuGameState {
  return {
    board: buildBoard(),
    puzzleId: "test-puzzle",
    status: "playing",
    selectedCell: { row: 4, column: 4 },
    errorCount: 0,
    ...overrides,
  };
}

describe("moveSelection", () => {
  it("moves in each direction", () => {
    expect(moveSelection(makeState(), "up").selectedCell).toEqual({
      row: 3,
      column: 4,
    });
    expect(moveSelection(makeState(), "down").selectedCell).toEqual({
      row: 5,
      column: 4,
    });
    expect(moveSelection(makeState(), "left").selectedCell).toEqual({
      row: 4,
      column: 3,
    });
    expect(moveSelection(makeState(), "right").selectedCell).toEqual({
      row: 4,
      column: 5,
    });
  });

  it("clamps at the board edges", () => {
    const topLeft = makeState({ selectedCell: { row: 0, column: 0 } });
    expect(moveSelection(topLeft, "up").selectedCell).toEqual({
      row: 0,
      column: 0,
    });
    expect(moveSelection(topLeft, "left").selectedCell).toEqual({
      row: 0,
      column: 0,
    });

    const bottomRight = makeState({ selectedCell: { row: 8, column: 8 } });
    expect(moveSelection(bottomRight, "down").selectedCell).toEqual({
      row: 8,
      column: 8,
    });
    expect(moveSelection(bottomRight, "right").selectedCell).toEqual({
      row: 8,
      column: 8,
    });
  });

  it("defaults to the top-left cell when nothing is selected", () => {
    const state = makeState({ selectedCell: null });
    expect(moveSelection(state, "right").selectedCell).toEqual({
      row: 0,
      column: 1,
    });
  });

  it("is ignored while paused or completed", () => {
    const paused = makeState({ status: "paused" });
    expect(moveSelection(paused, "up")).toBe(paused);

    const completed = makeState({ status: "completed" });
    expect(moveSelection(completed, "up")).toBe(completed);
  });
});
