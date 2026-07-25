"use client";

import { Button } from "@/components/ui/button";
import type { SudokuGameStatus } from "../domain/entities/GameStatus";

interface GameControlsProps {
  status: SudokuGameStatus;
  onNewGame: () => void;
  onRestart: () => void;
  onPause: () => void;
  onResume: () => void;
}

export function GameControls({
  status,
  onNewGame,
  onRestart,
  onPause,
  onResume,
}: GameControlsProps) {
  const isPaused = status === "paused";
  const pauseResumeDisabled = status === "ready" || status === "completed";

  return (
    <div className="mx-auto flex w-full max-w-[480px] flex-wrap justify-center gap-2">
      <Button
        type="button"
        variant="outline"
        onClick={onRestart}
        aria-label="현재 퍼즐 초기화"
      >
        초기화
      </Button>
      <Button
        type="button"
        variant="outline"
        onClick={isPaused ? onResume : onPause}
        disabled={pauseResumeDisabled}
        aria-label={isPaused ? "게임 재개" : "게임 일시정지"}
      >
        {isPaused ? "재개" : "일시정지"}
      </Button>
      <Button type="button" onClick={onNewGame} aria-label="새 게임 시작">
        새 게임
      </Button>
    </div>
  );
}
