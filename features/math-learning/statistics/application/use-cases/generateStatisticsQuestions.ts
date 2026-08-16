import {
  calculateMaximum,
  calculateMean,
  calculateMedian,
  calculateMinimum,
  calculateMode,
  calculateSum,
  hasUniqueMode,
} from "../../domain/statistics";
import type {
  StatisticsDifficulty,
  StatisticsQuestion,
  StatisticsQuestionKind,
  StatisticsStage,
} from "../../domain/statistics.types";
import { STATISTICS_STAGE } from "../../domain/stages";

type Rng = () => number;

const QUESTION_KINDS: StatisticsQuestionKind[] = [
  "sum",
  "maximum",
  "minimum",
  "mean",
  "median",
  "mode",
];

const DATASETS: number[][] = [
  [3, 5, 5, 7, 10],
  [2, 4, 6, 8, 10],
  [1, 3, 5, 7, 9],
  [6, 6, 6, 8, 10],
  [10, 12, 14, 16, 18],
  [2, 2, 3, 5, 8],
  [7, 9, 9, 11, 14],
  [4, 6, 8, 10, 12],
  [5, 5, 5, 10, 15],
  [1, 2, 2, 4, 6],
  [3, 6, 9, 12, 15],
  [8, 8, 12, 16, 20],
];

export function generateStatisticsQuestions(
  stage: StatisticsStage = STATISTICS_STAGE,
  rng: Rng = Math.random,
): StatisticsQuestion[] {
  const candidates = createCandidates(stage);
  const requiredQuestions = QUESTION_KINDS.map((kind) => {
    const kindCandidates = candidates.filter(
      (question) => question.kind === kind,
    );
    return shuffle(kindCandidates, rng)[0];
  });
  const requiredIds = new Set(requiredQuestions.map((question) => question.id));
  const fillerQuestions = shuffle(
    candidates.filter((question) => !requiredIds.has(question.id)),
    rng,
  );

  return shuffle(
    [...requiredQuestions, ...fillerQuestions].slice(0, stage.questionCount),
    rng,
  );
}

function createCandidates(stage: StatisticsStage): StatisticsQuestion[] {
  return DATASETS.flatMap((values) =>
    QUESTION_KINDS.flatMap((kind) => {
      const answer = calculateAnswer(kind, values);

      if (!Number.isInteger(answer)) return [];
      if (kind === "mode" && !hasUniqueMode(values)) return [];

      return [
        {
          id: `${stage.id}-${kind}-${values.join("-")}`,
          values,
          answer,
          kind,
          difficulty: classifyDifficulty(values),
          stageId: stage.id,
        },
      ];
    }),
  );
}

function calculateAnswer(
  kind: StatisticsQuestionKind,
  values: readonly number[],
): number {
  if (kind === "sum") return calculateSum(values);
  if (kind === "maximum") return calculateMaximum(values);
  if (kind === "minimum") return calculateMinimum(values);
  if (kind === "mean") return calculateMean(values);
  if (kind === "median") return calculateMedian(values);
  return calculateMode(values);
}

function classifyDifficulty(values: readonly number[]): StatisticsDifficulty {
  return Math.max(...values) <= 10 && values.length <= 5 ? "easy" : "medium";
}

function shuffle<T>(items: readonly T[], rng: Rng): T[] {
  const shuffled = [...items];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(rng() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [
      shuffled[swapIndex],
      shuffled[index],
    ];
  }

  return shuffled;
}
