"use client";

import { ArrowRight } from "lucide-react";
import type { LearningStage } from "../../../domain/arithmetic.types";
import type { StageProgressRecord } from "../../../domain/learningProgress.types";
import { StageProgressBadge } from "./StageProgressBadge";

interface StageCardProps {
  stage: LearningStage;
  progress?: StageProgressRecord;
  recommended: boolean;
  onStart: (stage: LearningStage) => void;
}

export function StageCard({
  stage,
  progress,
  recommended,
  onStart,
}: StageCardProps) {
  return (
    <button
      type="button"
      onClick={() => onStart(stage)}
      className="rounded-lg border border-neutral-200 bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-md focus:ring-2 focus:ring-emerald-600 focus:ring-offset-2 focus:outline-none"
    >
      <span className="flex items-start justify-between gap-3">
        <span>
          <span className="text-xs font-bold text-neutral-500">
            단계 {stage.order}
          </span>
          <span className="mt-1 block text-lg font-bold text-neutral-950">
            {stage.title}
          </span>
        </span>
        <StageProgressBadge
          status={progress?.status}
          recommended={recommended}
        />
      </span>
      <span className="mt-2 block text-sm leading-6 text-neutral-600">
        {stage.description}
      </span>
      <span className="mt-3 flex items-center gap-1 text-sm font-semibold text-emerald-700">
        시작
        <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </span>
    </button>
  );
}
