import { describe, expect, it } from "vitest";
import { inputValue } from "./inputValue";
import { buildBoard } from "../../test-utils";
import type { SudokuGameState } from "../../domain/entities/GameState";

function makeState(overrides: Partial<SudokuGameState> = {}): SudokuGameState {
  return {
    board: buildBoard(),
    puzzleId: "test-puzzle",
    status: "playing",
    selectedCell: { row: 0, column: 0 },
    errorCount: 0,
    ...overrides,
  };
}

describe("inputValue", () => {
  it("ignores input targeting a fixed cell", () => {
    const state = makeState({ selectedCell: { row: 0, column: 1 } }); // fixed, value 3
    const result = inputValue(state, 9);
    expect(result).toBe(state);
  });

  it("clears the cell when value is 0", () => {
    const withValue = makeState();
    const filled = inputValue(withValue, 5);
    const cleared = inputValue({ ...filled, status: "playing" }, 0);
    expect(cleared.board[0][0].value).toBe(0);
  });

  it("increments errorCount when the entered value does not match the solution", () => {
    const state = makeState(); // solution at (0,0) is 5
    const result = inputValue(state, 9);
    expect(result.errorCount).toBe(1);
    expect(result.board[0][0].isError).toBe(true);
  });

  it("does not increment errorCount for a correct entry", () => {
    const state = makeState();
    const result = inputValue(state, 5);
    expect(result.errorCount).toBe(0);
  });

  it("marks the game completed once every cell matches its solution", () => {
    const state = makeState(); // every other cell is already correctly pre-filled
    const result = inputValue(state, 5);
    expect(result.status).toBe("completed");
  });

  it("promotes ready to playing without completing the puzzle", () => {
    const state = makeState({ status: "ready" });
    const result = inputValue(state, 9); // wrong value, board stays unsolved
    expect(result.status).toBe("playing");
  });

  it("ignores input while paused", () => {
    const state = makeState({ status: "paused" });
    const result = inputValue(state, 5);
    expect(result).toBe(state);
  });

  it("ignores input once completed", () => {
    const state = makeState({ status: "completed" });
    const result = inputValue(state, 5);
    expect(result).toBe(state);
  });

  it("ignores input when no cell is selected", () => {
    const state = makeState({ selectedCell: null });
    const result = inputValue(state, 5);
    expect(result).toBe(state);
  });
});
