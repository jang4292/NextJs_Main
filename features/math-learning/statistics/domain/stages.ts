import type { StatisticsStage } from "./statistics.types";

export const STATISTICS_STAGE: StatisticsStage = {
  id: "statistics-basic",
  title: "자료의 대표값",
  shortTitle: "대표값",
  description:
    "숫자 자료에서 합계, 최댓값, 최솟값, 평균, 중앙값, 최빈값을 찾아요.",
  questionCount: 10,
};

export const STATISTICS_STAGES: StatisticsStage[] = [STATISTICS_STAGE];
