import { describe, expect, it } from "vitest";
import type { GameSession } from "../../domain/entities/GameSession";
import type { Board } from "../../domain/entities/Board";
import { fixedRng, rowsToBoard, testIdGenerator } from "../../test-utils";
import { swapTilesInSession } from "../../application/use-cases/swapTiles";
import {
  buildInvalidSwapPlaybackFrames,
  buildValidSwapPlaybackFrames,
} from "./playbackSequence";

const TEST_CONFIG = {
  rows: 3,
  columns: 3,
  tileTypes: ["ruby", "sapphire", "emerald", "topaz", "amethyst", "orange"],
  initialMoves: 3,
  targetScore: 300,
  baseScore: 10,
  maxBoardGenerationAttempts: 5,
  maxCascadeSteps: 5,
} as const;

function session(rows: string[]): GameSession {
  return {
    board: rowsToBoard(rows),
    score: 0,
    movesRemaining: 3,
    phase: "idle",
  };
}

describe("playback sequence", () => {
  it("builds a valid swap sequence from swap to final board", () => {
    const current = session(["rsr", "ere", "tat"]);
    const result = swapTilesInSession(
      current,
      { row: 0, column: 1 },
      { row: 1, column: 1 },
      TEST_CONFIG,
      fixedRng([0, 0.2, 0.4]),
      testIdGenerator(),
    );

    expect(result.kind).toBe("valid");
    if (result.kind !== "valid") return;

    const frames = buildValidSwapPlaybackFrames(
      current,
      result,
      { row: 0, column: 1 },
      { row: 1, column: 1 },
    );

    expect(frames.map((frame) => frame.kind)).toEqual([
      "swapped",
      "removing",
      "empty",
      "collapsed",
      "final",
    ]);
    expect(frames[0]?.session.board).toBe(result.swappedBoard);
    expect(frames[1]?.removingTileIds).toEqual(["r-0", "r-4", "r-2"]);
    expect(frames[1]?.clearedPositions).toEqual(
      result.steps[0]?.removedPositions,
    );
    expect(frames[2]?.session.board).toBe(result.steps[0]?.afterRemovalBoard);
    expect(frames[2]?.clearedPositions).toEqual(
      result.steps[0]?.removedPositions,
    );
    expect(frames[2]?.scorePop).toMatchObject({ value: 30 });
    expect(frames[2]?.swappingTileIds).toEqual([]);
    expect(frames[2]?.removingTileIds).toEqual([]);
    expect(frames[2]?.fallingTileIds).toEqual([]);
    expect(frames[2]?.generatedTileIds).toEqual([]);
    expect(frames[2]?.generatedTileOffsets).toEqual({});
    expect(frames[3]?.clearedPositions).toEqual([]);
    expect(frames.at(-1)?.session.board).toBe(result.session.board);
  });

  it("removes matched tile ids from the empty frame before refill", () => {
    const current = session(["rsr", "ere", "tat"]);
    const result = swapTilesInSession(
      current,
      { row: 0, column: 1 },
      { row: 1, column: 1 },
      TEST_CONFIG,
      fixedRng([0, 0.2, 0.4]),
      testIdGenerator(),
    );

    expect(result.kind).toBe("valid");
    if (result.kind !== "valid") return;

    const frames = buildValidSwapPlaybackFrames(
      current,
      result,
      { row: 0, column: 1 },
      { row: 1, column: 1 },
    );
    const removingFrame = frames.find((frame) => frame.kind === "removing");
    const emptyFrame = frames.find((frame) => frame.kind === "empty");

    expect(removingFrame).toBeDefined();
    expect(emptyFrame).toBeDefined();

    const emptyFrameTileIds = collectBoardTileIds(emptyFrame?.session.board);
    for (const tileId of removingFrame?.removingTileIds ?? []) {
      expect(emptyFrameTileIds).not.toContain(tileId);
    }
    expect(emptyFrame?.clearedPositions).toEqual(
      result.steps[0]?.removedPositions,
    );
    expect(emptyFrame?.swappingTileIds).toEqual([]);
    expect(emptyFrame?.removingTileIds).toEqual([]);
    expect(emptyFrame?.fallingTileIds).toEqual([]);
    expect(emptyFrame?.generatedTileIds).toEqual([]);
    expect(emptyFrame?.generatedTileOffsets).toEqual({});
  });

  it("does not reuse removed tile ids for generated refill tiles", () => {
    const current = session(["rsr", "ere", "tat"]);
    const result = swapTilesInSession(
      current,
      { row: 0, column: 1 },
      { row: 1, column: 1 },
      TEST_CONFIG,
      fixedRng([0, 0.2, 0.4]),
      testIdGenerator(),
    );

    expect(result.kind).toBe("valid");
    if (result.kind !== "valid") return;

    const frames = buildValidSwapPlaybackFrames(
      current,
      result,
      { row: 0, column: 1 },
      { row: 1, column: 1 },
    );
    const removingFrame = frames.find((frame) => frame.kind === "removing");
    const collapsedFrame = frames.find((frame) => frame.kind === "collapsed");
    const removedIds = new Set(removingFrame?.removingTileIds ?? []);

    for (const generatedId of collapsedFrame?.generatedTileIds ?? []) {
      expect(removedIds.has(generatedId)).toBe(false);
    }
  });

  it("keeps invalid swap frames free of score and removal effects", () => {
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

    const frames = buildInvalidSwapPlaybackFrames(
      current,
      result,
      { row: 0, column: 0 },
      { row: 0, column: 1 },
    );

    expect(frames.map((frame) => frame.kind)).toEqual([
      "invalid-preview",
      "invalid-restore",
    ]);
    expect(frames.every((frame) => frame.removingTileIds.length === 0)).toBe(
      true,
    );
    expect(frames.every((frame) => frame.clearedPositions.length === 0)).toBe(
      true,
    );
    expect(frames.every((frame) => frame.scorePop === null)).toBe(true);
    expect(frames.at(-1)?.session.board).toBe(current.board);
    expect(frames.at(-1)?.session.score).toBe(0);
    expect(frames.at(-1)?.session.movesRemaining).toBe(3);
  });
});

function collectBoardTileIds(board: Board | undefined): string[] {
  return (board ?? [])
    .flat()
    .map((tile) => tile?.id)
    .filter((tileId): tileId is string => Boolean(tileId));
}
