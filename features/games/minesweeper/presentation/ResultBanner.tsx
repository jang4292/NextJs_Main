"use client";

import type { GameStatus } from "../domain/entities/GameStatus";

interface ResultBannerProps {
  status: GameStatus;
  onRestart: () => void;
}

export function ResultBanner({ status, onRestart }: ResultBannerProps) {
  if (status !== "won" && status !== "lost") return null;

  const isWon = status === "won";

  return (
    <div
      className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 rounded-lg bg-black/60 text-neutral-50"
      role="status"
      aria-live="polite"
    >
      <p className="text-2xl font-bold">{isWon ? "승리! 🎉" : "패배 💥"}</p>
      <button
        type="button"
        onClick={onRestart}
        className="rounded-md bg-neutral-100 px-4 py-2 text-sm font-semibold text-neutral-900 transition-colors hover:bg-white active:scale-95"
        aria-label="Start a new game"
      >
        다시 시작
      </button>
    </div>
  );
}
