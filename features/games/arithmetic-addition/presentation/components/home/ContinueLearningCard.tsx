"use client";

import { ArrowRight, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { LearningStage } from "../../../domain/arithmetic.types";
import type { StageProgressRecord } from "../../../domain/learningProgress.types";
import { OPERATOR_LABEL } from "../../../domain/operatorMeta";

interface ContinueLearningCardProps {
  stage: LearningStage;
  progress?: StageProgressRecord;
  onContinue: () => void;
}

export function ContinueLearningCard({
  stage,
  progress,
  onContinue,
}: ContinueLearningCardProps) {
  return (
    <section
      className="rounded-lg border border-emerald-200 bg-white p-4 shadow-sm"
      aria-label="이어서 학습하기"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
            <Play className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <p className="text-sm font-semibold text-emerald-700">
              이어서 학습하기
            </p>
            <h2 className="mt-1 text-xl font-bold text-neutral-950">
              {OPERATOR_LABEL[stage.operator]} · {stage.title}
            </h2>
            {progress && (
              <p className="mt-1 text-sm text-neutral-600">
                최근 정답률 {Math.round(progress.lastFirstTryAccuracy * 100)}%
              </p>
            )}
          </div>
        </div>
        <Button
          type="button"
          onClick={onContinue}
          className="min-h-11 bg-emerald-700 hover:bg-emerald-800"
        >
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
          계속하기
        </Button>
      </div>
    </section>
  );
}
