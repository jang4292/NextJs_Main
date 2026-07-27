"use client";

import { useState } from "react";
import { Board2048View } from "./Board2048View";
import { GameOverBanner } from "./GameOverBanner";
import { ScoreBar } from "./ScoreBar";
import { WinToast } from "./WinToast";
import { useGame2048 } from "./hooks/useGame2048";
import { useKeyboardInput } from "./interaction/useKeyboardInput";
import { useSwipeInput } from "./interaction/useSwipeInput";

export function Game2048() {
  const {
    tiles,
    score,
    bestScore,
    status,
    hasWon,
    move,
    restart,
    clearTileFlags,
  } = useGame2048();
  const [winToastDismissed, setWinToastDismissed] = useState(false);

  const swipeHandlers = useSwipeInput(move);
  useKeyboardInput(move);

  function handleRestart() {
    restart();
    setWinToastDismissed(false);
  }

  const showWinToast = hasWon && !winToastDismissed;

  return (
    <div className="mx-auto flex w-full flex-col items-center px-4 py-6">
      <h1 className="mb-4 text-3xl font-bold">2048</h1>

      <div className="w-[min(92vw,480px)]">
        <ScoreBar
          score={score}
          bestScore={bestScore}
          onRestart={handleRestart}
        />

        <div className="relative">
          {showWinToast && (
            <WinToast onDismiss={() => setWinToastDismissed(true)} />
          )}
          <Board2048View
            tiles={tiles}
            onTileAnimationEnd={clearTileFlags}
            swipeHandlers={swipeHandlers}
          />
          {status === "game-over" && (
            <GameOverBanner onRestart={handleRestart} />
          )}
        </div>

        <p className="mt-4 text-center text-sm text-neutral-500">
          보드를 스와이프하거나 드래그해서 타일을 움직이세요. (방향키도 사용
          가능)
        </p>
      </div>
    </div>
  );
}
