"use client";

interface ScoreBarProps {
  score: number;
  bestScore: number;
  onRestart: () => void;
}

export function ScoreBar({ score, bestScore, onRestart }: ScoreBarProps) {
  return (
    <div className="mb-4 flex w-full items-center justify-between gap-3">
      <div className="flex gap-2">
        <div className="min-w-16 rounded-md bg-neutral-800 px-3 py-2 text-center text-neutral-50">
          <div className="text-xs font-semibold uppercase tracking-wide text-neutral-300">Score</div>
          <div className="text-lg font-bold">{score}</div>
        </div>
        <div className="min-w-16 rounded-md bg-neutral-800 px-3 py-2 text-center text-neutral-50">
          <div className="text-xs font-semibold uppercase tracking-wide text-neutral-300">Best</div>
          <div className="text-lg font-bold">{bestScore}</div>
        </div>
      </div>
      <button
        type="button"
        onClick={onRestart}
        className="rounded-md bg-neutral-700 px-4 py-2 text-sm font-semibold text-neutral-50 transition-colors hover:bg-neutral-600"
        aria-label="Start a new game"
      >
        New Game
      </button>
    </div>
  );
}
