import type {
  LearningStage,
  SessionAnalysis,
} from "../../domain/arithmetic.types";
import type {
  LearningRecommendation,
  StageProgressRecord,
} from "../../domain/learningProgress.types";

export interface RecommendationContext {
  stages: readonly LearningStage[];
  progress?: StageProgressRecord;
}

export function buildRecommendation(
  analysis: SessionAnalysis,
  stage: LearningStage,
  context: RecommendationContext,
): LearningRecommendation {
  const previousStage = getNeighborStage(context.stages, stage, -1);
  const nextStage = getNeighborStage(context.stages, stage, 1);

  if (analysis.wrongResults.length >= 3) {
    return {
      kind: "review-mistakes",
      title: "오답을 먼저 다져요",
      message: "헷갈렸던 문제만 짧게 다시 풀면 다음 학습이 더 편해져요.",
      actionLabel: "오답 복습",
    };
  }

  if (analysis.firstTryAccuracy >= 0.8 && nextStage) {
    return {
      kind: "next-stage",
      title: "다음 단계로 가도 좋아요",
      message: `${stage.shortTitle} 흐름이 안정적이에요. ${nextStage.shortTitle} 단계로 이어가요.`,
      actionLabel: "다음 단계",
      targetStageId: nextStage.id,
    };
  }

  if (analysis.firstTryAccuracy >= 0.8) {
    return {
      kind: "complete",
      title: "이 연산을 잘 마쳤어요",
      message:
        "마지막 단계까지 안정적으로 풀었어요. 다른 연산도 둘러볼 수 있어요.",
      actionLabel: "처음으로",
    };
  }

  if (analysis.firstTryAccuracy >= 0.6) {
    return {
      kind: "repeat-stage",
      title: "같은 단계를 한 번 더",
      message: "이미 좋은 흐름이에요. 같은 범위를 한 번 더 풀며 속도를 붙여요.",
      actionLabel: "다시 풀기",
      targetStageId: stage.id,
    };
  }

  if (previousStage) {
    return {
      kind: "previous-stage",
      title: "이전 단계로 가볍게 다져요",
      message: `${previousStage.shortTitle} 단계에서 수 감각을 다시 잡고 오면 좋아요.`,
      actionLabel: "기초 단계",
      targetStageId: previousStage.id,
    };
  }

  return {
    kind: "repeat-stage",
    title: "작은 수부터 차근차근",
    message: "끝까지 해낸 것이 중요해요. 같은 단계를 천천히 다시 풀어요.",
    actionLabel: "다시 풀기",
    targetStageId: stage.id,
  };
}

function getNeighborStage(
  stages: readonly LearningStage[],
  stage: LearningStage,
  direction: -1 | 1,
): LearningStage | undefined {
  const sortedStages = [...stages]
    .filter((candidate) => candidate.operator === stage.operator)
    .sort((left, right) => left.order - right.order);
  const currentIndex = sortedStages.findIndex(
    (candidate) => candidate.id === stage.id,
  );

  if (currentIndex < 0) return undefined;

  return sortedStages[currentIndex + direction];
}
