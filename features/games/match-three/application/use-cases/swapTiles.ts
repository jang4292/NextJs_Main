import type { MatchThreeConfig } from "../../config/gameConfig";
import { DEFAULT_MATCH_THREE_CONFIG } from "../../config/gameConfig";
import {
  getBoardSize,
  getCell,
  removeBoardPositions,
  swapBoardCells,
  type Board,
} from "../../domain/entities/Board";
import type { GameSession } from "../../domain/entities/GameSession";
import type { MatchGroup } from "../../domain/entities/MatchGroup";
import type { Position } from "../../domain/entities/Position";
import type {
  GeneratedTile,
  TileMovement,
} from "../../domain/services/boardCollapser";
import { collapseAndRefillBoard } from "../../domain/services/boardCollapser";
import { generateBoard } from "../../domain/services/boardGenerator";
import { hasAvailableMove } from "../../domain/services/availableMoveDetector";
import {
  collectMatchedPositions,
  findMatches,
} from "../../domain/services/matchDetector";
import type { Rng } from "../../domain/services/random";
import { calculateMatchScore } from "../../domain/services/scoringService";
import {
  createSequentialTileIdGenerator,
  type TileIdGenerator,
} from "../../domain/services/tileFactory";
import {
  areAdjacent,
  isWithinBoard,
} from "../../domain/rules/positionRules";

export type SwapFailureReason =
  | "locked"
  | "out-of-bounds"
  | "not-adjacent"
  | "empty-cell"
  | "no-match";

export interface ResolutionStep {
  cascadeStep: number;
  matches: MatchGroup[];
  removedPositions: Position[];
  scoreGained: number;
  beforeRemovalBoard: Board;
  afterRemovalBoard: Board;
  afterCollapseBoard: Board;
  movements: TileMovement[];
  generated: GeneratedTile[];
}

export type SwapResult =
  | {
      kind: "invalid";
      reason: SwapFailureReason;
      session: GameSession;
      previewBoard: Board | null;
    }
  | {
      kind: "valid";
      session: GameSession;
      swappedBoard: Board;
      steps: ResolutionStep[];
      wasShuffled: boolean;
    };

export function swapTilesInSession(
  session: GameSession,
  first: Position,
  second: Position,
  config: MatchThreeConfig = DEFAULT_MATCH_THREE_CONFIG,
  rng: Rng = Math.random,
  nextId: TileIdGenerator = createSequentialTileIdGenerator(),
): SwapResult {
  if (session.phase !== "idle" && session.phase !== "selecting") {
    return invalid("locked", session, null);
  }

  const size = getBoardSize(session.board);
  if (!isWithinBoard(first, size) || !isWithinBoard(second, size)) {
    return invalid("out-of-bounds", session, null);
  }

  if (!areAdjacent(first, second)) {
    return invalid("not-adjacent", session, null);
  }

  if (!getCell(session.board, first) || !getCell(session.board, second)) {
    return invalid("empty-cell", session, null);
  }

  const swappedBoard = swapBoardCells(session.board, first, second);
  if (findMatches(swappedBoard).length === 0) {
    return invalid("no-match", session, swappedBoard);
  }

  const afterSwap: GameSession = {
    ...session,
    board: swappedBoard,
    movesRemaining: Math.max(0, session.movesRemaining - 1),
    phase: "checking",
  };
  const resolved = resolveBoard(afterSwap, config, rng, nextId);

  return {
    kind: "valid",
    session: resolved.session,
    swappedBoard,
    steps: resolved.steps,
    wasShuffled: resolved.wasShuffled,
  };
}

function invalid(
  reason: SwapFailureReason,
  session: GameSession,
  previewBoard: Board | null,
): SwapResult {
  return { kind: "invalid", reason, session, previewBoard };
}

function resolveBoard(
  session: GameSession,
  config: MatchThreeConfig,
  rng: Rng,
  nextId: TileIdGenerator,
): {
  session: GameSession;
  steps: ResolutionStep[];
  wasShuffled: boolean;
} {
  let current = session;
  let matches = findMatches(current.board);
  const steps: ResolutionStep[] = [];
  let wasShuffled = false;

  for (
    let cascadeStep = 1;
    matches.length > 0 && cascadeStep <= config.maxCascadeSteps;
    cascadeStep++
  ) {
    const removedPositions = collectMatchedPositions(matches);
    const scoreGained = calculateMatchScore(
      removedPositions.length,
      cascadeStep,
      config,
    );
    const afterRemovalBoard = removeBoardPositions(
      current.board,
      removedPositions,
    );
    const collapse = collapseAndRefillBoard(
      afterRemovalBoard,
      config,
      rng,
      nextId,
    );

    steps.push({
      cascadeStep,
      matches,
      removedPositions,
      scoreGained,
      beforeRemovalBoard: current.board,
      afterRemovalBoard,
      afterCollapseBoard: collapse.board,
      movements: collapse.movements,
      generated: collapse.generated,
    });

    current = {
      ...current,
      board: collapse.board,
      score: current.score + scoreGained,
      phase: "cascading",
    };
    matches = findMatches(current.board);
  }

  if (matches.length > 0) {
    current = {
      ...current,
      board: generateBoard(config, rng, nextId),
      phase: "shuffling",
    };
    wasShuffled = true;
  }

  const finalPhase = getFinalPhase(current, config);
  if (finalPhase === "idle" && !hasAvailableMove(current.board)) {
    current = {
      ...current,
      board: generateBoard(config, rng, nextId),
      phase: "shuffling",
    };
    wasShuffled = true;
  }

  return {
    session: {
      ...current,
      phase: getFinalPhase(current, config),
    },
    steps,
    wasShuffled,
  };
}

function getFinalPhase(
  session: GameSession,
  config: MatchThreeConfig,
): GameSession["phase"] {
  if (session.score >= config.targetScore) return "completed";
  if (session.movesRemaining <= 0) return "failed";
  return "idle";
}
