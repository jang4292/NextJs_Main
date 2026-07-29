"use client";

import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { LearningStage } from "../../../domain/arithmetic.types";
import type { StageProgressRecord } from "../../../domain/learningProgress.types";
import { OPERATOR_LABEL } from "../../../domain/operatorMeta";
import { StageCard } from "./StageCard";

interface StageListProps {
  stages: LearningStage[];
  progress: StageProgressRecord[];
  recommendedStageId?: LearningStage["id"];
  onBack: () => void;
  onStartStage: (stage: LearningStage) => void;
}

export function StageList({
  stages,
  progress,
  recommendedStageId,
  onBack,
  onStartStage,
}: StageListProps) {
  const operation = stages[0]?.operator ?? "addition";

  return (
    <section
      className="mx-auto flex w-full max-w-[720px] flex-col gap-4 px-3 py-5 sm:px-4"
      aria-label={`${OPERATOR_LABEL[operation]} 단계 선택`}
    >
      <header className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-emerald-700">
            {OPERATOR_LABEL[operation]} 단계
          </p>
          <h1 className="mt-1 text-2xl font-bold text-neutral-950">
            풀 단계를 골라요
          </h1>
        </div>
        <Button type="button" variant="outline" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          뒤로
        </Button>
      </header>

      <div className="grid gap-3">
        {stages.map((stage) => (
          <StageCard
            key={stage.id}
            stage={stage}
            progress={progress.find((record) => record.stageId === stage.id)}
            recommended={recommendedStageId === stage.id}
            onStart={onStartStage}
          />
        ))}
      </div>
    </section>
  );
}
