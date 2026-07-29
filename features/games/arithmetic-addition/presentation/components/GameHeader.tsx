"use client";

import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { LearningStage, Operator } from "../../domain/arithmetic.types";
import {
  OPERATOR_LABEL,
  OPERATOR_SYMBOL,
} from "../../domain/operatorMeta";
import { ProgressBar } from "./ProgressBar";

interface GameHeaderProps {
  currentIndex: number;
  totalQuestions: number;
  reviewMode: boolean;
  stage?: LearningStage;
  operator?: Operator;
  onBack?: () => void;
}

export function GameHeader({
  currentIndex,
  totalQuestions,
  reviewMode,
  stage,
  operator = stage?.operator ?? "addition",
  onBack,
}: GameHeaderProps) {
  const currentQuestionNumber = currentIndex + 1;

  return (
    <header className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex min-w-0 items-start gap-2">
          {onBack && (
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={onBack}
              aria-label="단계 선택으로 돌아가기"
              className="mt-1 h-9 w-9 shrink-0"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            </Button>
          )}
          <div className="min-w-0">
            <p className="text-sm font-medium text-emerald-700">
              {reviewMode
                ? "틀린 문제 복습"
                : stage
                  ? `${OPERATOR_LABEL[stage.operator]} · ${stage.title}`
                  : `${OPERATOR_LABEL[operator]} 연습`}
            </p>
            <h2 className="text-2xl font-bold text-neutral-950">
              문제 {currentQuestionNumber} / {totalQuestions}
            </h2>
          </div>
        </div>
        <span className="rounded-lg bg-amber-100 px-3 py-2 text-sm font-semibold text-amber-900">
          {OPERATOR_SYMBOL[operator]} {OPERATOR_LABEL[operator]}
        </span>
      </div>

      <ProgressBar value={currentQuestionNumber} max={totalQuestions} />
    </header>
  );
}
