"use client";

import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import type {
  LearningCategory,
  LearningStage,
} from "../../../domain/arithmetic.types";
import type { StageProgressRecord } from "../../../domain/learningProgress.types";
import { OPERATOR_LABEL } from "../../../domain/operatorMeta";
import { StageCard } from "./StageCard";

const CATEGORY_ORDER: LearningCategory[] = [
  "basic",
  "practice",
  "application",
  "advanced",
];

const CATEGORY_LABEL: Record<LearningCategory, string> = {
  basic: "기초",
  practice: "숙련",
  application: "응용",
  advanced: "심화",
};

interface StageListProps {
  stages: readonly LearningStage[];
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
  const stageGroups = CATEGORY_ORDER
    .map((category) => ({
      category,
      stages: stages.filter((stage) => stage.category === category),
    }))
    .filter((group) => group.stages.length > 0);

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

      <div className="grid gap-5">
        {stageGroups.map((group) => (
          <section
            key={group.category}
            className="grid gap-3"
            aria-labelledby={`${operation}-${group.category}-stages`}
          >
            <h2
              id={`${operation}-${group.category}-stages`}
              className="text-base font-bold text-neutral-950"
            >
              {CATEGORY_LABEL[group.category]}
            </h2>
            <div className="grid gap-3">
              {group.stages.map((stage) => (
                <StageCard
                  key={stage.id}
                  stage={stage}
                  progress={progress.find(
                    (record) => record.stageId === stage.id,
                  )}
                  recommended={recommendedStageId === stage.id}
                  onStart={onStartStage}
                />
              ))}
            </div>
          </section>
        ))}
      </div>
    </section>
  );
}
