"use client";

import { BookOpenCheck, History, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { LearningStage, Operator } from "../../../domain/arithmetic.types";
import type {
  ArithmeticLearningData,
  StageProgressRecord,
} from "../../../domain/learningProgress.types";
import { ContinueLearningCard } from "./ContinueLearningCard";
import { OperationGrid } from "./OperationGrid";

interface ArithmeticHomeProps {
  learningData: ArithmeticLearningData;
  continueStage?: LearningStage;
  continueProgress?: StageProgressRecord;
  onContinue: () => void;
  onSelectOperation: (operator: Operator) => void;
  onOpenReview: () => void;
  onOpenHistory: () => void;
}

export function ArithmeticHome({
  learningData,
  continueStage,
  continueProgress,
  onContinue,
  onSelectOperation,
  onOpenReview,
  onOpenHistory,
}: ArithmeticHomeProps) {
  const hasMistakes = learningData.mistakes.length > 0;
  const hasHistory = learningData.recentSessions.length > 0;

  return (
    <section
      className="mx-auto flex w-full max-w-[760px] flex-col gap-4 px-3 py-5 sm:px-4"
      aria-label="사칙연산 학습 게임"
    >
      <header>
        <p className="text-sm font-semibold text-emerald-700">사칙연산</p>
        <h1 className="mt-1 text-2xl font-bold text-neutral-950 sm:text-3xl">
          오늘의 연산을 골라요
        </h1>
      </header>

      {continueStage && (
        <ContinueLearningCard
          stage={continueStage}
          progress={continueProgress}
          onContinue={onContinue}
        />
      )}

      <OperationGrid onSelectOperation={onSelectOperation} />

      <div className="grid gap-2 sm:grid-cols-2">
        <Button
          type="button"
          variant="outline"
          disabled={!hasMistakes}
          onClick={onOpenReview}
          className="min-h-11 justify-start"
        >
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
          오답 복습
        </Button>
        <Button
          type="button"
          variant="outline"
          disabled={!hasHistory}
          onClick={onOpenHistory}
          className="min-h-11 justify-start"
        >
          <History className="h-4 w-4" aria-hidden="true" />
          학습 기록
        </Button>
      </div>

      {!hasHistory && (
        <div className="flex items-center gap-2 rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-600">
          <BookOpenCheck className="h-4 w-4 shrink-0" aria-hidden="true" />
          <span>첫 단계를 마치면 기록이 여기에서 이어져요.</span>
        </div>
      )}
    </section>
  );
}
