import type { SwapResult } from "../../application/use-cases/swapTiles";
import type { GameSession } from "../../domain/entities/GameSession";
import type { Position } from "../../domain/entities/Position";
import {
  calculateScorePopPosition,
  collectSwapTileIds,
  collectTileIdsAtPositions,
  createGeneratedTileOffsets,
  type BoardPoint,
  type GeneratedTileOffset,
} from "./animationState";

export interface ScorePopIntent {
  value: number;
  position: BoardPoint;
}

interface BasePlaybackFrame {
  session: GameSession;
  swappingTileIds: string[];
  removingTileIds: string[];
  clearedPositions: Position[];
  fallingTileIds: string[];
  generatedTileIds: string[];
  generatedTileOffsets: Record<string, GeneratedTileOffset>;
  invalidTileIds: string[];
  scorePop: ScorePopIntent | null;
}

export interface PlaybackFrame extends BasePlaybackFrame {
  kind: "swapped" | "removing" | "empty" | "collapsed" | "final";
}

export interface InvalidPlaybackFrame extends BasePlaybackFrame {
  kind: "invalid-preview" | "invalid-restore";
}

export function buildValidSwapPlaybackFrames(
  current: GameSession,
  result: Extract<SwapResult, { kind: "valid" }>,
  first: Position,
  second: Position,
): PlaybackFrame[] {
  const swapIds = collectSwapTileIds(current.board, first, second);
  const movesRemaining = Math.max(0, current.movesRemaining - 1);
  let displayedScore = current.score;
  let workingSession: GameSession = {
    ...current,
    board: result.swappedBoard,
    movesRemaining,
    phase: "swapping",
  };

  const frames: PlaybackFrame[] = [
    createFrame("swapped", workingSession, {
      swappingTileIds: swapIds,
    }),
  ];

  for (const step of result.steps) {
    const removedTileIds = collectTileIdsAtPositions(
      step.beforeRemovalBoard,
      step.removedPositions,
    );

    workingSession = {
      ...workingSession,
      board: step.beforeRemovalBoard,
      score: displayedScore,
      phase: "removing",
    };
    frames.push(
      createFrame("removing", workingSession, {
        removingTileIds: removedTileIds,
        clearedPositions: step.removedPositions,
      }),
    );

    displayedScore += step.scoreGained;
    workingSession = {
      ...workingSession,
      board: step.afterRemovalBoard,
      score: displayedScore,
      phase: "falling",
    };
    frames.push(
      createFrame("empty", workingSession, {
        clearedPositions: step.removedPositions,
        scorePop: {
          value: step.scoreGained,
          position: calculateScorePopPosition(step.removedPositions),
        },
      }),
    );

    const generatedTileOffsets = createGeneratedTileOffsets(step.generated);
    workingSession = {
      ...workingSession,
      board: step.afterCollapseBoard,
      phase: step.generated.length > 0 ? "refilling" : "falling",
    };
    frames.push(
      createFrame("collapsed", workingSession, {
        fallingTileIds: step.movements.map((movement) => movement.tileId),
        generatedTileIds: step.generated.map((generated) => generated.tile.id),
        generatedTileOffsets,
      }),
    );
  }

  frames.push(createFrame("final", result.session));
  return frames;
}

export function buildInvalidSwapPlaybackFrames(
  current: GameSession,
  result: Extract<SwapResult, { kind: "invalid" }>,
  first: Position,
  second: Position,
): InvalidPlaybackFrame[] {
  const invalidTileIds = collectSwapTileIds(current.board, first, second);

  if (!result.previewBoard) {
    return [
      createInvalidFrame("invalid-restore", { ...current, phase: "idle" }, {
        invalidTileIds,
      }),
    ];
  }

  return [
    createInvalidFrame(
      "invalid-preview",
      { ...current, board: result.previewBoard, phase: "swapping" },
      {
        swappingTileIds: invalidTileIds,
        invalidTileIds,
      },
    ),
    createInvalidFrame("invalid-restore", { ...current, phase: "idle" }, {
      invalidTileIds,
    }),
  ];
}

function createFrame(
  kind: PlaybackFrame["kind"],
  session: GameSession,
  overrides: Partial<BasePlaybackFrame> = {},
): PlaybackFrame {
  return {
    kind,
    ...createBaseFrame(session, overrides),
  };
}

function createInvalidFrame(
  kind: InvalidPlaybackFrame["kind"],
  session: GameSession,
  overrides: Partial<BasePlaybackFrame> = {},
): InvalidPlaybackFrame {
  return {
    kind,
    ...createBaseFrame(session, overrides),
  };
}

function createBaseFrame(
  session: GameSession,
  overrides: Partial<BasePlaybackFrame>,
): BasePlaybackFrame {
  return {
    session,
    swappingTileIds: [],
    removingTileIds: [],
    clearedPositions: [],
    fallingTileIds: [],
    generatedTileIds: [],
    generatedTileOffsets: {},
    invalidTileIds: [],
    scorePop: null,
    ...overrides,
  };
}
