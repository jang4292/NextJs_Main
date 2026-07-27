"use client";

import type { SudokuGameStatus } from "../domain/entities/GameStatus";

interface GameHeaderProps {
  elapsedSeconds: number;
  errorCount: number;
  status: SudokuGameStatus;
}

const STATUS_LABEL: Record<SudokuGameStatus, string> = {
  ready: "대기",
  playing: "진행 중",
  paused: "일시정지",
  completed: "완료",
};

function formatElapsed(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export function GameHeader({
  elapsedSeconds,
  errorCount,
  status,
}: GameHeaderProps) {
  return (
    <div className="mx-auto flex w-full max-w-[480px] items-center justify-between text-sm">
      <span className="bg-secondary text-secondary-foreground rounded-full px-3 py-1 font-medium">
        {STATUS_LABEL[status]}
      </span>
      <span className="font-mono tabular-nums" aria-label="경과 시간">
        {formatElapsed(elapsedSeconds)}
      </span>
      <span role="status" aria-label={`오류 ${errorCount}회`}>
        오류 {errorCount}회
      </span>
    </div>
  );
}
