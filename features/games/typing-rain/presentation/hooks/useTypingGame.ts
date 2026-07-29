"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { typingContents } from "../../data/typingContents";
import { DIFFICULTY_CONFIGS } from "../../domain/difficulty.config";
import { calculateScore } from "../../domain/scoring";
import type {
  DifficultyConfig,
  DifficultyLevel,
  FallingWord,
  TypingContent,
  TypingGameResult,
  TypingGameSettings,
  TypingGameStatus,
} from "../../domain/typing.types";
import {
  calculateAccuracy,
  calculateCompletedCharactersPerMinute,
} from "../../application/use-cases/calculateAccuracy";
import { createFallingWord } from "../../application/use-cases/createFallingWord";
import { selectTypingContent } from "../../application/use-cases/selectContent";
import { useGameLoop } from "./useGameLoop";

interface TypingGameState {
  status: TypingGameStatus;
  settings: TypingGameSettings;
  activeWords: FallingWord[];
  score: number;
  health: number;
  combo: number;
  maxCombo: number;
  correctCount: number;
  missedCount: number;
  typedCharacterCount: number;
  correctCharacterCount: number;
  elapsedMs: number;
  sessionId: string;
  previousContentId: string | null;
  result: TypingGameResult | null;
}

export interface UseTypingGameOptions {
  contents?: TypingContent[];
  difficultyConfigs?: Partial<Record<DifficultyLevel, Partial<DifficultyConfig>>>;
  compact?: boolean;
  countdownMs?: number;
  rng?: () => number;
  now?: () => number;
}

const DEFAULT_SETTINGS: TypingGameSettings = {
  language: "ko",
  difficulty: "easy",
};

const MATCH_REMOVE_MS = 180;
const RESULT_DELAY_MS = 280;
const ELAPSED_SYNC_MS = 250;

export function useTypingGame({
  contents = typingContents,
  difficultyConfigs,
  compact = false,
  countdownMs = 900,
  rng = Math.random,
  now = Date.now,
}: UseTypingGameOptions = {}) {
  const [state, setState] = useState<TypingGameState>(() =>
    createInitialState(DEFAULT_SETTINGS, getConfig("easy", compact, difficultyConfigs)),
  );
  const stateRef = useRef(state);
  const sequenceRef = useRef(0);
  const lastSpawnAtRef = useRef(0);
  const elapsedSyncAtRef = useRef(0);
  const elapsedAccumulatorRef = useRef(0);
  const timeoutIdsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  useEffect(() => {
    return () => {
      for (const timeoutId of timeoutIdsRef.current) {
        clearTimeout(timeoutId);
      }
      timeoutIdsRef.current = [];
    };
  }, []);

  const currentConfig = getConfig(
    state.settings.difficulty,
    compact,
    difficultyConfigs,
  );

  const start = useCallback(
    (settings: TypingGameSettings) => {
      clearScheduledTimeouts(timeoutIdsRef.current);
      timeoutIdsRef.current = [];
      sequenceRef.current = 0;
      lastSpawnAtRef.current = 0;
      elapsedSyncAtRef.current = 0;
      elapsedAccumulatorRef.current = 0;

      const config = getConfig(settings.difficulty, compact, difficultyConfigs);
      const startTime = now();

      setState({
        ...createInitialState(settings, config),
        status: countdownMs <= 0 ? "playing" : "countdown",
        sessionId: `typing-rain-${startTime}`,
      });
    },
    [compact, countdownMs, difficultyConfigs, now],
  );

  const pause = useCallback(() => {
    setState((currentState) =>
      currentState.status === "playing"
        ? { ...currentState, status: "paused" }
        : currentState,
    );
  }, []);

  const resume = useCallback(() => {
    setState((currentState) =>
      currentState.status === "paused"
        ? { ...currentState, status: "playing" }
        : currentState,
    );
  }, []);

  const resetToIdle = useCallback(() => {
    const config = getConfig(
      stateRef.current.settings.difficulty,
      compact,
      difficultyConfigs,
    );
    setState(createInitialState(stateRef.current.settings, config));
  }, [compact, difficultyConfigs]);

  const quit = useCallback(() => {
    setState((currentState) => {
      if (
        currentState.status === "idle" ||
        currentState.status === "result" ||
        currentState.status === "game-over"
      ) {
        return currentState;
      }

      return finishGame(currentState);
    });
  }, []);

  const recordTypedCharacters = useCallback((count: number) => {
    if (count <= 0) return;

    setState((currentState) => {
      if (currentState.status !== "playing") return currentState;

      return {
        ...currentState,
        typedCharacterCount: currentState.typedCharacterCount + count,
      };
    });
  }, []);

  const scheduleTimeout = useCallback(
    (callback: () => void, delayMs: number) => {
      const timeoutId = setTimeout(() => {
        timeoutIdsRef.current = timeoutIdsRef.current.filter(
          (candidate) => candidate !== timeoutId,
        );
        callback();
      }, delayMs);
      timeoutIdsRef.current.push(timeoutId);
    },
    [],
  );

  const removeWord = useCallback((wordId: string) => {
    setState((currentState) => ({
      ...currentState,
      activeWords: currentState.activeWords.filter(
        (word) => word.id !== wordId,
      ),
    }));
  }, []);

  const spawnWord = useCallback(
    (
      currentState: TypingGameState,
      config: DifficultyConfig,
      gameElapsedMs: number,
    ) => {
      const selectedContent = selectTypingContent(contents, {
        language: currentState.settings.language,
        difficulty: currentState.settings.difficulty,
        activeTexts: currentState.activeWords.map((word) => word.text),
        previousContentId: currentState.previousContentId,
        rng,
      });

      if (!selectedContent) return;

      const nextWord = createFallingWord({
        content: selectedContent,
        config,
        now: gameElapsedMs,
        sequence: sequenceRef.current++,
        rng,
      });

      setState((latestState) => {
        if (latestState.status !== "playing") return latestState;

        return {
          ...latestState,
          activeWords: [...latestState.activeWords, nextWord],
          previousContentId: selectedContent.id,
        };
      });
    },
    [contents, rng],
  );

  const matchWord = useCallback(
    (word: FallingWord) => {
      setState((currentState) => {
        if (currentState.status !== "playing") return currentState;

        const targetWord = currentState.activeWords.find(
          (candidate) =>
            candidate.id === word.id && candidate.status === "active",
        );
        if (!targetWord) return currentState;

        const nextCombo = currentState.combo + 1;
        const nextActiveWords = currentState.activeWords.map((candidate) =>
          candidate.id === targetWord.id
            ? { ...candidate, status: "matched" as const }
            : candidate,
        );
        scheduleTimeout(() => removeWord(targetWord.id), MATCH_REMOVE_MS);

        return {
          ...currentState,
          activeWords: nextActiveWords,
          score:
            currentState.score +
            calculateScore({
              combo: nextCombo,
              difficulty: currentState.settings.difficulty,
            }),
          combo: nextCombo,
          maxCombo: Math.max(currentState.maxCombo, nextCombo),
          correctCount: currentState.correctCount + 1,
          correctCharacterCount:
            currentState.correctCharacterCount + targetWord.text.length,
        };
      });
    },
    [removeWord, scheduleTimeout],
  );

  const missWord = useCallback((wordId: string) => {
    setState((currentState) => {
      if (currentState.status !== "playing") return currentState;

      const targetWord = currentState.activeWords.find(
        (word) => word.id === wordId && word.status === "active",
      );
      if (!targetWord) return currentState;

      const nextHealth = currentState.health - 1;
      const nextState: TypingGameState = {
        ...currentState,
        activeWords: currentState.activeWords.filter(
          (word) => word.id !== wordId,
        ),
        health: nextHealth,
        combo: 0,
        missedCount: currentState.missedCount + 1,
      };

      return nextHealth <= 0 ? finishGame(nextState) : nextState;
    });
  }, []);

  const onTick = useCallback(
    (timestamp: number, deltaMs: number) => {
      elapsedAccumulatorRef.current += deltaMs;
      const currentState = stateRef.current;
      const projectedElapsedMs =
        currentState.status === "playing"
          ? currentState.elapsedMs + Math.round(elapsedAccumulatorRef.current)
          : currentState.elapsedMs;

      if (timestamp - elapsedSyncAtRef.current >= ELAPSED_SYNC_MS) {
        const elapsedDelta = Math.round(elapsedAccumulatorRef.current);
        elapsedAccumulatorRef.current = 0;
        elapsedSyncAtRef.current = timestamp;
        setState((currentState) =>
          currentState.status === "playing"
            ? {
                ...currentState,
                elapsedMs: currentState.elapsedMs + elapsedDelta,
              }
            : currentState,
        );
      }

      if (currentState.status !== "playing") return;

      const missedWordIds = currentState.activeWords
        .filter(
          (word) =>
            word.status === "active" &&
            projectedElapsedMs - word.spawnedAt >= word.fallDurationMs,
        )
        .map((word) => word.id);

      if (missedWordIds.length > 0) {
        const missedIds = new Set(missedWordIds);

        setState((latestState) => {
          if (latestState.status !== "playing") return latestState;

          const missedActiveWords = latestState.activeWords.filter(
            (word) => word.status === "active" && missedIds.has(word.id),
          );
          if (missedActiveWords.length === 0) return latestState;

          const nextHealth = Math.max(
            0,
            latestState.health - missedActiveWords.length,
          );
          const nextState: TypingGameState = {
            ...latestState,
            activeWords: latestState.activeWords.filter(
              (word) => !missedIds.has(word.id),
            ),
            health: nextHealth,
            combo: 0,
            missedCount: latestState.missedCount + missedActiveWords.length,
            elapsedMs: Math.max(latestState.elapsedMs, projectedElapsedMs),
          };

          return nextHealth <= 0 ? finishGame(nextState) : nextState;
        });
        return;
      }

      const config = getConfig(
        currentState.settings.difficulty,
        compact,
        difficultyConfigs,
      );
      const shouldSpawnImmediately =
        currentState.activeWords.filter((word) => word.status === "active")
          .length === 0;
      const canSpawn =
        currentState.activeWords.filter((word) => word.status === "active")
          .length < config.maxActiveWords;
      const waitedLongEnough =
        timestamp - lastSpawnAtRef.current >= config.spawnIntervalMs;

      if (canSpawn && (shouldSpawnImmediately || waitedLongEnough)) {
        lastSpawnAtRef.current = timestamp;
        spawnWord(currentState, config, projectedElapsedMs);
      }
    },
    [compact, difficultyConfigs, spawnWord],
  );

  useGameLoop({
    enabled: state.status === "playing",
    onTick,
  });

  useEffect(() => {
    if (state.status !== "countdown") return;

    const timeoutId = setTimeout(() => {
      setState((currentState) =>
        currentState.status === "countdown"
          ? { ...currentState, status: "playing" }
          : currentState,
      );
    }, countdownMs);
    timeoutIdsRef.current.push(timeoutId);

    return () => clearTimeout(timeoutId);
  }, [countdownMs, state.status]);

  useEffect(() => {
    if (state.status !== "game-over") return;

    const timeoutId = setTimeout(() => {
      setState((currentState) =>
        currentState.status === "game-over"
          ? { ...currentState, status: "result" }
          : currentState,
      );
    }, RESULT_DELAY_MS);
    timeoutIdsRef.current.push(timeoutId);

    return () => clearTimeout(timeoutId);
  }, [state.status]);

  useEffect(() => {
    function handleVisibilityChange() {
      if (document.visibilityState === "hidden") {
        pause();
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [pause]);

  return {
    ...state,
    currentConfig,
    start,
    pause,
    resume,
    quit,
    resetToIdle,
    matchWord,
    missWord,
    recordTypedCharacters,
  };
}

function createInitialState(
  settings: TypingGameSettings,
  config: DifficultyConfig,
): TypingGameState {
  return {
    status: "idle",
    settings,
    activeWords: [],
    score: 0,
    health: config.initialHealth,
    combo: 0,
    maxCombo: 0,
    correctCount: 0,
    missedCount: 0,
    typedCharacterCount: 0,
    correctCharacterCount: 0,
    elapsedMs: 0,
    sessionId: "",
    previousContentId: null,
    result: null,
  };
}

function getConfig(
  difficulty: DifficultyLevel,
  compact: boolean,
  overrides?: Partial<Record<DifficultyLevel, Partial<DifficultyConfig>>>,
): DifficultyConfig {
  const config = {
    ...DIFFICULTY_CONFIGS[difficulty],
    ...overrides?.[difficulty],
  };

  return {
    ...config,
    maxActiveWords: compact
      ? Math.max(1, config.maxActiveWords - 1)
      : config.maxActiveWords,
  };
}

function finishGame(state: TypingGameState): TypingGameState {
  return {
    ...state,
    status: "game-over",
    activeWords: [],
    combo: 0,
    result: buildResult(state),
  };
}

function buildResult(state: TypingGameState): TypingGameResult {
  const accuracy = calculateAccuracy({
    typedCharacterCount: state.typedCharacterCount,
    correctCharacterCount: state.correctCharacterCount,
  });

  return {
    score: state.score,
    correctCount: state.correctCount,
    missedCount: state.missedCount,
    typedCharacterCount: state.typedCharacterCount,
    correctCharacterCount: state.correctCharacterCount,
    accuracy,
    maxCombo: state.maxCombo,
    elapsedMs: state.elapsedMs,
    completedCharactersPerMinute: calculateCompletedCharactersPerMinute({
      correctCharacterCount: state.correctCharacterCount,
      elapsedMs: state.elapsedMs,
    }),
    isNewHighScore: false,
  };
}

function clearScheduledTimeouts(
  timeoutIds: ReturnType<typeof setTimeout>[],
) {
  for (const timeoutId of timeoutIds) clearTimeout(timeoutId);
}
