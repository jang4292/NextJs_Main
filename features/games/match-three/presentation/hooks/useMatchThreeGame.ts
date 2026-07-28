"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { DEFAULT_MATCH_THREE_CONFIG } from "../../config/gameConfig";
import { startNewMatchThreeGame } from "../../application/use-cases/startNewGame";
import {
  swapTilesInSession,
  type SwapResult,
} from "../../application/use-cases/swapTiles";
import { getCell } from "../../domain/entities/Board";
import type { GameSession } from "../../domain/entities/GameSession";
import type {
  Direction,
  Position,
} from "../../domain/entities/Position";
import {
  areAdjacent,
  arePositionsEqual,
  isWithinBoard,
  movePosition,
  positionKey,
} from "../../domain/rules/positionRules";
import { createSequentialTileIdGenerator } from "../../domain/services/tileFactory";
import {
  type BoardPoint,
  type GeneratedTileOffset,
  summarizeBoard,
} from "../animation/animationState";
import {
  buildInvalidSwapPlaybackFrames,
  buildValidSwapPlaybackFrames,
  type InvalidPlaybackFrame,
  type PlaybackFrame,
} from "../animation/playbackSequence";

const TIMING = {
  swap: 170,
  invalid: 150,
  remove: 300,
  empty: 420,
  fall: 330,
  shuffle: 180,
} as const;

export interface DragPreview {
  tileId: string;
  dx: number;
  dy: number;
}

export interface ScorePop {
  id: string;
  value: number;
  position: BoardPoint;
}

export function useMatchThreeGame() {
  const [nextId] = useState(() => createSequentialTileIdGenerator());
  const [session, setSession] = useState<GameSession>(() =>
    startNewMatchThreeGame(DEFAULT_MATCH_THREE_CONFIG, Math.random, nextId),
  );
  const [selected, setSelected] = useState<Position | null>(null);
  const [swappingTileIds, setSwappingTileIds] = useState<string[]>([]);
  const [removingTileIds, setRemovingTileIds] = useState<string[]>([]);
  const [clearedPositions, setClearedPositions] = useState<Position[]>([]);
  const [fallingTileIds, setFallingTileIds] = useState<string[]>([]);
  const [generatedTileIds, setGeneratedTileIds] = useState<string[]>([]);
  const [generatedTileOffsets, setGeneratedTileOffsets] = useState<
    Record<string, GeneratedTileOffset>
  >({});
  const [invalidTileIds, setInvalidTileIds] = useState<string[]>([]);
  const [scorePops, setScorePops] = useState<ScorePop[]>([]);
  const [dragPreview, setDragPreview] = useState<DragPreview | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const sessionRef = useRef(session);
  const isRunningRef = useRef(false);
  const timeoutIdsRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const isMountedRef = useRef(true);
  const scorePopIdRef = useRef(0);

  useEffect(() => {
    sessionRef.current = session;
  }, [session]);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      for (const timeoutId of timeoutIdsRef.current) clearTimeout(timeoutId);
      timeoutIdsRef.current = [];
    };
  }, []);

  const wait = useCallback((duration: number) => {
    return new Promise<void>((resolve) => {
      const timeoutId = setTimeout(() => {
        timeoutIdsRef.current = timeoutIdsRef.current.filter(
          (id) => id !== timeoutId,
        );
        resolve();
      }, duration);
      timeoutIdsRef.current.push(timeoutId);
    });
  }, []);

  const commitSession = useCallback((nextSession: GameSession) => {
    sessionRef.current = nextSession;
    if (isMountedRef.current) setSession(nextSession);
  }, []);

  const setRunning = useCallback((isRunning: boolean) => {
    isRunningRef.current = isRunning;
    if (isMountedRef.current) setIsAnimating(isRunning);
  }, []);

  const clearTransientEffects = useCallback(() => {
    setSwappingTileIds([]);
    setRemovingTileIds([]);
    setClearedPositions([]);
    setFallingTileIds([]);
    setGeneratedTileIds([]);
    setGeneratedTileOffsets({});
    setInvalidTileIds([]);
    setDragPreview(null);
  }, []);

  const restart = useCallback(() => {
    if (isRunningRef.current) return;

    clearTransientEffects();
    setScorePops([]);
    setSelected(null);
    commitSession(
      startNewMatchThreeGame(DEFAULT_MATCH_THREE_CONFIG, Math.random, nextId),
    );
  }, [clearTransientEffects, commitSession, nextId]);

  const applyInvalidFrame = useCallback((frame: InvalidPlaybackFrame) => {
    setSwappingTileIds(frame.swappingTileIds);
    setRemovingTileIds([]);
    setClearedPositions([]);
    setFallingTileIds([]);
    setGeneratedTileIds([]);
    setGeneratedTileOffsets({});
    setInvalidTileIds(frame.invalidTileIds);
    setScorePops([]);
  }, []);

  const applyValidFrame = useCallback((frame: PlaybackFrame) => {
    setSwappingTileIds(frame.swappingTileIds);
    setRemovingTileIds(frame.removingTileIds);
    setClearedPositions(frame.clearedPositions);
    setFallingTileIds(frame.fallingTileIds);
    setGeneratedTileIds(frame.generatedTileIds);
    setGeneratedTileOffsets(frame.generatedTileOffsets);
    setInvalidTileIds([]);

    if (frame.scorePop) {
      setScorePops([
        {
          id: `score-pop-${scorePopIdRef.current++}`,
          value: frame.scorePop.value,
          position: frame.scorePop.position,
        },
      ]);
    } else if (frame.kind === "collapsed" || frame.kind === "final") {
      setScorePops([]);
    }
  }, []);

  const playInvalidSwap = useCallback(
    async (
      result: Extract<SwapResult, { kind: "invalid" }>,
      current: GameSession,
      first: Position,
      second: Position,
    ) => {
      const frames = buildInvalidSwapPlaybackFrames(
        current,
        result,
        first,
        second,
      );

      debugInvalidSwap(result, first, second);
      setRunning(true);
      setSelected(null);
      setDragPreview(null);

      for (const frame of frames) {
        debugInvalidFrame(frame);
        applyInvalidFrame(frame);
        commitSession(frame.session);
        await wait(TIMING.invalid);
      }

      clearTransientEffects();
      setRunning(false);
    },
    [applyInvalidFrame, clearTransientEffects, commitSession, setRunning, wait],
  );

  const playValidSwap = useCallback(
    async (
      result: Extract<SwapResult, { kind: "valid" }>,
      current: GameSession,
      first: Position,
      second: Position,
    ) => {
      const frames = buildValidSwapPlaybackFrames(
        current,
        result,
        first,
        second,
      );

      debugValidSwap(current, result, first, second);
      setRunning(true);
      setSelected(null);
      setDragPreview(null);
      setScorePops([]);

      let lastRemovedTileIds: string[] = [];
      for (const frame of frames) {
        if (frame.kind === "removing") {
          lastRemovedTileIds = frame.removingTileIds;
        }
        debugValidFrame(frame, lastRemovedTileIds);
        applyValidFrame(frame);
        commitSession(frame.session);
        await wait(getFrameDuration(frame));
      }

      clearTransientEffects();

      if (result.wasShuffled && result.session.phase === "idle") {
        commitSession({ ...result.session, phase: "shuffling" });
        await wait(TIMING.shuffle);
      }

      commitSession(result.session);
      setRunning(false);
    },
    [applyValidFrame, clearTransientEffects, commitSession, setRunning, wait],
  );

  const trySwap = useCallback(
    async (first: Position, second: Position) => {
      if (isRunningRef.current) return;

      const current = sessionRef.current;
      const result = swapTilesInSession(
        current,
        first,
        second,
        DEFAULT_MATCH_THREE_CONFIG,
        Math.random,
        nextId,
      );

      if (result.kind === "invalid") {
        await playInvalidSwap(result, current, first, second);
        return;
      }

      await playValidSwap(result, current, first, second);
    },
    [nextId, playInvalidSwap, playValidSwap],
  );

  const selectTile = useCallback(
    (position: Position) => {
      const current = sessionRef.current;
      if (isRunningRef.current || !isInputAllowed(current)) return;
      if (!getCell(current.board, position)) return;

      setSelected(position);
      commitSession({ ...current, phase: "selecting" });
    },
    [commitSession],
  );

  const clearSelection = useCallback(() => {
    const current = sessionRef.current;
    setSelected(null);
    if (current.phase === "selecting") {
      commitSession({ ...current, phase: "idle" });
    }
  }, [commitSession]);

  const tapTile = useCallback(
    (position: Position) => {
      const current = sessionRef.current;
      if (isRunningRef.current || !isInputAllowed(current)) return;
      if (!getCell(current.board, position)) return;

      if (!selected) {
        selectTile(position);
        return;
      }

      if (arePositionsEqual(selected, position)) {
        clearSelection();
        return;
      }

      if (areAdjacent(selected, position)) {
        void trySwap(selected, position);
        return;
      }

      selectTile(position);
    },
    [clearSelection, selected, selectTile, trySwap],
  );

  const swipeTile = useCallback(
    (position: Position, direction: Direction) => {
      const current = sessionRef.current;
      if (isRunningRef.current || !isInputAllowed(current)) return;

      const target = movePosition(position, direction);
      const size = {
        rows: DEFAULT_MATCH_THREE_CONFIG.rows,
        columns: DEFAULT_MATCH_THREE_CONFIG.columns,
      };
      if (!isWithinBoard(target, size)) {
        clearSelection();
        return;
      }

      void trySwap(position, target);
    },
    [clearSelection, trySwap],
  );

  const startDrag = useCallback((position: Position) => {
    const current = sessionRef.current;
    if (isRunningRef.current || !isInputAllowed(current)) return;

    const tile = getCell(current.board, position);
    if (!tile) return;

    setDragPreview({ tileId: tile.id, dx: 0, dy: 0 });
  }, []);

  const moveDrag = useCallback(
    (position: Position, delta: { dx: number; dy: number }) => {
      const current = sessionRef.current;
      if (isRunningRef.current || !isInputAllowed(current)) return;

      const tile = getCell(current.board, position);
      if (!tile) return;

      setDragPreview((preview) => {
        if (!preview || preview.tileId !== tile.id) return preview;
        return { ...preview, ...delta };
      });
    },
    [],
  );

  const endDrag = useCallback(() => {
    setDragPreview(null);
  }, []);

  const selectedKey = selected ? positionKey(selected) : null;
  const swappingTileIdSet = useMemo(
    () => new Set(swappingTileIds),
    [swappingTileIds],
  );
  const removingTileIdSet = useMemo(
    () => new Set(removingTileIds),
    [removingTileIds],
  );
  const fallingTileIdSet = useMemo(
    () => new Set(fallingTileIds),
    [fallingTileIds],
  );
  const generatedTileIdSet = useMemo(
    () => new Set(generatedTileIds),
    [generatedTileIds],
  );
  const invalidTileIdSet = useMemo(
    () => new Set(invalidTileIds),
    [invalidTileIds],
  );

  return {
    board: session.board,
    score: session.score,
    movesRemaining: session.movesRemaining,
    phase: session.phase,
    targetScore: DEFAULT_MATCH_THREE_CONFIG.targetScore,
    rows: DEFAULT_MATCH_THREE_CONFIG.rows,
    columns: DEFAULT_MATCH_THREE_CONFIG.columns,
    selectedKey,
    swappingTileIdSet,
    removingTileIdSet,
    clearedPositions,
    fallingTileIdSet,
    generatedTileIdSet,
    generatedTileOffsets,
    invalidTileIdSet,
    scorePops,
    dragPreview,
    isInputLocked: !isInputAllowed(session) || isAnimating,
    tapTile,
    swipeTile,
    startDrag,
    moveDrag,
    endDrag,
    restart,
  };
}

function isInputAllowed(session: GameSession): boolean {
  return session.phase === "idle" || session.phase === "selecting";
}

function getFrameDuration(frame: PlaybackFrame): number {
  switch (frame.kind) {
    case "swapped":
      return TIMING.swap;
    case "removing":
      return TIMING.remove;
    case "empty":
      return TIMING.empty;
    case "collapsed":
      return TIMING.fall;
    case "final":
      return 0;
  }
}

function debugValidSwap(
  current: GameSession,
  result: Extract<SwapResult, { kind: "valid" }>,
  first: Position,
  second: Position,
) {
  if (!isDebugEnabled()) return;

  console.debug("[match-three] valid swap", {
    first,
    second,
    swapTileIds: [
      current.board[first.row]?.[first.column]?.id,
      current.board[second.row]?.[second.column]?.id,
    ].filter(Boolean),
    stepCount: result.steps.length,
  });
}

function debugInvalidSwap(
  result: Extract<SwapResult, { kind: "invalid" }>,
  first: Position,
  second: Position,
) {
  if (!isDebugEnabled()) return;

  console.debug("[match-three] invalid swap", {
    first,
    second,
    reason: result.reason,
    hasPreviewBoard: result.previewBoard !== null,
  });
}

function debugValidFrame(
  frame: PlaybackFrame,
  lastRemovedTileIds: readonly string[],
) {
  if (!isDebugEnabled()) return;

  const summary = summarizeBoard(frame.session.board);
  const payload = {
    kind: frame.kind,
    phase: frame.session.phase,
    score: frame.session.score,
    movesRemaining: frame.session.movesRemaining,
    removingTileIds: frame.removingTileIds,
    clearedPositions: frame.clearedPositions,
    clearedPositionKeys: frame.clearedPositions.map(positionKey),
    lastRemovedTileIds,
    generatedTileIds: frame.generatedTileIds,
    nullCount: summary.nullCount,
    boardTileIds: summary.tileIds,
  };

  console.debug(`[match-three] frame ${frame.kind}`, payload);

  if (frame.kind === "empty") {
    const remainingRemovedIds = lastRemovedTileIds.filter((tileId) =>
      summary.tileIds.includes(tileId),
    );
    if (remainingRemovedIds.length > 0) {
      console.warn("[match-three] removed ids still present in empty frame", {
        remainingRemovedIds,
        boardTileIds: summary.tileIds,
      });
    }
  }
}

function debugInvalidFrame(frame: InvalidPlaybackFrame) {
  if (!isDebugEnabled()) return;

  const summary = summarizeBoard(frame.session.board);
  console.debug(`[match-three] frame ${frame.kind}`, {
    kind: frame.kind,
    phase: frame.session.phase,
    score: frame.session.score,
    movesRemaining: frame.session.movesRemaining,
    invalidTileIds: frame.invalidTileIds,
    nullCount: summary.nullCount,
    boardTileIds: summary.tileIds,
  });
}

function isDebugEnabled(): boolean {
  return process.env.NODE_ENV !== "production";
}
