import { describe, expect, it } from "vitest";
import { pauseGame } from "./pauseGame";
import { resumeGame } from "./resumeGame";
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

describe("pauseGame", () => {
  it("pauses a playing game and clears the selection", () => {
    const result = pauseGame(makeState());
    expect(result.status).toBe("paused");
    expect(result.selectedCell).toBeNull();
  });

  it("does nothing when not playing", () => {
    const ready = makeState({ status: "ready" });
    expect(pauseGame(ready)).toBe(ready);

    const completed = makeState({ status: "completed" });
    expect(pauseGame(completed)).toBe(completed);
  });
});

describe("resumeGame", () => {
  it("resumes a paused game", () => {
    const paused = makeState({ status: "paused" });
    expect(resumeGame(paused).status).toBe("playing");
  });

  it("does nothing when not paused", () => {
    const playing = makeState({ status: "playing" });
    expect(resumeGame(playing)).toBe(playing);
  });
});
