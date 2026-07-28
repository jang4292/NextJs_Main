"use client";

import { ProgressBar } from "./ProgressBar";

interface GameHeaderProps {
  currentIndex: number;
  totalQuestions: number;
  reviewMode: boolean;
}

export function GameHeader({
  currentIndex,
  totalQuestions,
  reviewMode,
}: GameHeaderProps) {
  const currentQuestionNumber = currentIndex + 1;

  return (
    <header className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-sm font-medium text-emerald-700">
            {reviewMode ? "틀린 문제 복습" : "덧셈 연습"}
          </p>
          <h2 className="text-2xl font-bold text-neutral-950">
            문제 {currentQuestionNumber} / {totalQuestions}
          </h2>
        </div>
        <span className="rounded-lg bg-amber-100 px-3 py-2 text-sm font-semibold text-amber-900">
          + 덧셈
        </span>
      </div>

      <ProgressBar value={currentQuestionNumber} max={totalQuestions} />
    </header>
  );
}

