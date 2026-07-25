import { describe, expect, it } from "vitest";
import { selectCell } from "./selectCell";
import { startNewGame } from "./startNewGame";
import { SUDOKU_PUZZLES } from "../../domain/data/puzzles";

function readyState() {
  return startNewGame(() => SUDOKU_PUZZLES[0]);
}

describe("selectCell", () => {
  it("sets the selected cell and promotes ready to playing", () => {
    const state = selectCell(readyState(), { row: 2, column: 3 });
    expect(state.selectedCell).toEqual({ row: 2, column: 3 });
    expect(state.status).toBe("playing");
  });

  it("keeps status as playing when already playing", () => {
    const playing = { ...readyState(), status: "playing" as const };
    const state = selectCell(playing, { row: 1, column: 1 });
    expect(state.status).toBe("playing");
  });

  it("is ignored while paused", () => {
    const paused = { ...readyState(), status: "paused" as const };
    const state = selectCell(paused, { row: 1, column: 1 });
    expect(state).toBe(paused);
  });

  it("is ignored while completed", () => {
    const completed = { ...readyState(), status: "completed" as const };
    const state = selectCell(completed, { row: 1, column: 1 });
    expect(state).toBe(completed);
  });
});
