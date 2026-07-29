"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { buildHighScoreKey } from "../application/use-cases/storage";
import type { TypingGameResult, TypingGameSettings } from "../domain/typing.types";
import { GameBoard } from "./components/GameBoard";
import { GameHud } from "./components/GameHud";
import { PauseOverlay } from "./components/PauseOverlay";
import { ResultPanel } from "./components/ResultPanel";
import { StartPanel } from "./components/StartPanel";
import { TypingInput } from "./components/TypingInput";
import { useTypingGame, type UseTypingGameOptions } from "./hooks/useTypingGame";
import { useTypingInput } from "./hooks/useTypingInput";
import { useTypingRainStorage } from "./hooks/useTypingRainStorage";
import { useVisualViewport } from "./hooks/useVisualViewport";
import styles from "./styles/typingRain.module.css";

interface FinalResult {
  sessionId: string;
  result: TypingGameResult;
}

export function TypingRainGame(options: UseTypingGameOptions = {}) {
  const viewport = useVisualViewport();
  const typingStorage = useTypingRainStorage();
  const [finalResult, setFinalResult] = useState<FinalResult | null>(null);
  const recordedSessionRef = useRef<string | null>(null);
  const settings = useMemo<TypingGameSettings>(
    () => ({
      language: typingStorage.storage.preferences.language,
      difficulty: typingStorage.storage.preferences.difficulty,
      contentType: typingStorage.storage.preferences.contentType,
    }),
    [
      typingStorage.storage.preferences.contentType,
      typingStorage.storage.preferences.difficulty,
      typingStorage.storage.preferences.language,
    ],
  );
  const game = useTypingGame({
    ...options,
    compact: options.compact ?? viewport.isCompact,
  });
  const typingInput = useTypingInput({
    enabled: game.status === "playing",
    words: game.activeWords,
    nowMs: game.elapsedMs,
    typingRules: typingStorage.storage.preferences.typingRules,
    onMatch: game.matchWord,
    onInputCommit: game.recordInputCommit,
  });
  const { focusInput, resetInput } = typingInput;

  useEffect(() => {
    if (game.status === "playing") {
      focusInput();
    }
  }, [focusInput, game.status]);

  useEffect(() => {
    if (game.status === "playing" || game.status === "paused") return;
    resetInput();
  }, [game.status, resetInput]);

  useEffect(() => {
    if (!game.result || !game.sessionId) return;
    if (recordedSessionRef.current === game.sessionId) return;

    const previousHighScore =
      typingStorage.storage.highScores[
        buildHighScoreKey(
          game.settings.language,
          game.settings.difficulty,
          game.settings.contentType,
        )
      ] ?? 0;
    const result = {
      ...game.result,
      isNewHighScore: game.result.score > previousHighScore,
    };

    recordedSessionRef.current = game.sessionId;
    setFinalResult({
      sessionId: game.sessionId,
      result,
    });
    typingStorage.recordResult(game.settings, result);
  }, [game, typingStorage]);

  function handleSettingsChange(nextSettings: TypingGameSettings) {
    typingStorage.updatePreferences(nextSettings);
  }

  function handleStart() {
    recordedSessionRef.current = null;
    setFinalResult(null);
    game.start(settings);
  }

  function handleRestart() {
    recordedSessionRef.current = null;
    setFinalResult(null);
    game.start(game.settings);
  }

  if (game.status === "idle") {
    return (
      <StartPanel
        settings={settings}
        storage={typingStorage.storage}
        onSettingsChange={handleSettingsChange}
        onPreferencesChange={typingStorage.updatePreferences}
        onStart={handleStart}
      />
    );
  }

  if (game.status === "result" && finalResult) {
    return (
      <ResultPanel
        result={finalResult.result}
        settings={game.settings}
        learningRecords={typingStorage.storage.learningRecords}
        onRestart={handleRestart}
        onChangeSettings={game.resetToIdle}
      />
    );
  }

  return (
    <section
      className={styles.shell}
      style={viewport.cssVariables}
      data-reduce-motion={typingStorage.storage.preferences.reduceMotion}
      aria-label="Typing Rain 게임"
    >
      <GameHud
        status={game.status}
        score={game.score}
        health={game.health}
        combo={game.combo}
        maxCombo={game.maxCombo}
        difficulty={game.settings.difficulty}
        elapsedMs={game.elapsedMs}
        onPause={game.pause}
        onResume={game.resume}
        onQuit={game.quit}
      />
      <div className={styles.playArea}>
        <GameBoard
          words={game.activeWords}
          inputValue={typingInput.value}
          highlightedWordIds={typingInput.prefixMatchedWordIds}
          lockedWordId={typingInput.lockedTargetId}
          paused={game.status !== "playing"}
          onFocusInput={typingInput.focusInput}
        />
        {game.status === "countdown" && (
          <div className={styles.countdown} role="status">
            준비
          </div>
        )}
        {game.status === "game-over" && (
          <div className={styles.countdown} role="status">
            종료
          </div>
        )}
        <PauseOverlay visible={game.status === "paused"} onResume={game.resume} />
      </div>
      <TypingInput
        value={typingInput.value}
        feedback={typingInput.feedback}
        isComposing={typingInput.isComposing}
        inputProps={typingInput.inputProps}
      />
    </section>
  );
}
