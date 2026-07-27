"use client";

interface GameOverBannerProps {
  onRestart: () => void;
}

export function GameOverBanner({ onRestart }: GameOverBannerProps) {
  return (
    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 rounded-lg bg-black/60 text-neutral-50">
      <p className="text-2xl font-bold">Game Over</p>
      <button
        type="button"
        onClick={onRestart}
        className="rounded-md bg-neutral-100 px-4 py-2 text-sm font-semibold text-neutral-900 transition-colors hover:bg-white"
        aria-label="Start a new game"
      >
        New Game
      </button>
    </div>
  );
}
