import { describe, expect, it } from "vitest";
import type { MatchThreeConfig } from "../../config/gameConfig";
import type { GameSession } from "../../domain/entities/GameSession";
import { fixedRng, rowsToBoard, testIdGenerator } from "../../test-utils";
import { swapTilesInSession } from "./swapTiles";

const TEST_CONFIG: MatchThreeConfig = {
  rows: 3,
  columns: 3,
  tileTypes: ["ruby", "sapphire", "emerald", "topaz", "amethyst", "orange"],
  initialMoves: 3,
  targetScore: 300,
  baseScore: 10,
  maxBoardGenerationAttempts: 5,
  maxCascadeSteps: 5,
};

function session(
  rows: string[],
  overrides: Partial<GameSession> = {},
): GameSession {
  return {
    board: rowsToBoard(rows),
    score: 0,
    movesRemaining: 3,
    phase: "idle",
    ...overrides,
  };
}

describe("swapTilesInSession", () => {
  it("accepts a swap that creates a match, resolves it, scores, and consumes one move", () => {
    const result = swapTilesInSession(
      session(["rsr", "ere", "tat"]),
      { row: 0, column: 1 },
      { row: 1, column: 1 },
      TEST_CONFIG,
      fixedRng([0, 0.2, 0.4]),
      testIdGenerator(),
    );

    expect(result.kind).toBe("valid");
    if (result.kind !== "valid") return;
    expect(result.steps).toHaveLength(1);
    expect(result.steps[0]?.removedPositions).toHaveLength(3);
    expect(result.session.score).toBe(30);
    expect(result.session.movesRemaining).toBe(2);
    expect(result.session.phase).toBe("idle");
  });

  it("rejects diagonal swaps before previewing a board", () => {
    const current = session(["rse", "eta", "aor"]);
    const result = swapTilesInSession(
      current,
      { row: 0, column: 0 },
      { row: 1, column: 1 },
      TEST_CONFIG,
      fixedRng([]),
      testIdGenerator(),
    );

    expect(result).toMatchObject({
      kind: "invalid",
      reason: "not-adjacent",
      session: current,
      previewBoard: null,
    });
  });

  it("rejects no-match swaps and keeps the original session unchanged", () => {
    const current = session(["rse", "eta", "aor"]);
    const result = swapTilesInSession(
      current,
      { row: 0, column: 0 },
      { row: 0, column: 1 },
      TEST_CONFIG,
      fixedRng([]),
      testIdGenerator(),
    );

    expect(result.kind).toBe("invalid");
    if (result.kind !== "invalid") return;
    expect(result.reason).toBe("no-match");
    expect(result.session).toBe(current);
    expect(result.previewBoard).not.toBeNull();
    expect(current.movesRemaining).toBe(3);
  });

  it("resolves success after the current cascade is complete", () => {
    const result = swapTilesInSession(
      session(["rsr", "ere", "tat"], {
        movesRemaining: 1,
      }),
      { row: 0, column: 1 },
      { row: 1, column: 1 },
      { ...TEST_CONFIG, targetScore: 30 },
      fixedRng([0, 0.2, 0.4]),
      testIdGenerator(),
    );

    expect(result.kind).toBe("valid");
    if (result.kind !== "valid") return;
    expect(result.session.score).toBe(30);
    expect(result.session.movesRemaining).toBe(0);
    expect(result.session.phase).toBe("completed");
  });

  it("fails when moves are exhausted below target score", () => {
    const result = swapTilesInSession(
      session(["rsr", "ere", "tat"], {
        movesRemaining: 1,
      }),
      { row: 0, column: 1 },
      { row: 1, column: 1 },
      { ...TEST_CONFIG, targetScore: 100 },
      fixedRng([0, 0.2, 0.4]),
      testIdGenerator(),
    );

    expect(result.kind).toBe("valid");
    if (result.kind !== "valid") return;
    expect(result.session.phase).toBe("failed");
  });
});
