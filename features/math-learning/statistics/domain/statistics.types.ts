export type StatisticsStageId = "statistics-basic";

export type StatisticsQuestionKind =
  "sum" | "maximum" | "minimum" | "mean" | "median" | "mode";

export type StatisticsDifficulty = "easy" | "medium";

export interface StatisticsStage {
  id: StatisticsStageId;
  title: string;
  shortTitle: string;
  description: string;
  questionCount: number;
}

export interface StatisticsQuestion {
  id: string;
  values: number[];
  answer: number;
  kind: StatisticsQuestionKind;
  difficulty: StatisticsDifficulty;
  stageId: StatisticsStageId;
}
