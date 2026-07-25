"use client";

import type { GameStatus } from "../domain/entities/GameStatus";

interface MinesweeperHeaderProps {
  remainingMines: number;
  elapsedSeconds: number;
  status: GameStatus;
  onRestart: () => void;
}

const STATUS_LABEL: Record<GameStatus, string> = {
  ready: "대기",
  playing: "진행 중",
  won: "승리",
  lost: "패배",
};

export function MinesweeperHeader({ remainingMines, elapsedSeconds, status, onRestart }: MinesweeperHeaderProps) {
  return (
    <div className="mb-4 flex w-full flex-wrap items-center justify-between gap-3">
      <div className="flex flex-wrap gap-2">
        <div className="min-w-16 rounded-md bg-neutral-800 px-3 py-2 text-center text-neutral-50">
          <div className="text-xs font-semibold uppercase tracking-wide text-neutral-300">남은 지뢰</div>
          <div className="text-lg font-bold">{remainingMines}</div>
        </div>
        <div className="min-w-16 rounded-md bg-neutral-800 px-3 py-2 text-center text-neutral-50">
          <div className="text-xs font-semibold uppercase tracking-wide text-neutral-300">시간</div>
          <div className="text-lg font-bold">{elapsedSeconds}초</div>
        </div>
        <div className="min-w-16 rounded-md bg-neutral-800 px-3 py-2 text-center text-neutral-50">
          <div className="text-xs font-semibold uppercase tracking-wide text-neutral-300">상태</div>
          <div className="text-lg font-bold">{STATUS_LABEL[status]}</div>
        </div>
      </div>
      <button
        type="button"
        onClick={onRestart}
        className="rounded-md bg-neutral-700 px-4 py-2 text-sm font-semibold text-neutral-50 transition-colors hover:bg-neutral-600 active:scale-95"
        aria-label="Start a new game"
      >
        새 게임
      </button>
    </div>
  );
}
