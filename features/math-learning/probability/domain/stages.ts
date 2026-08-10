import type { ProbabilityStage } from "./probability.types";

export const PROBABILITY_STAGE: ProbabilityStage = {
  id: "probability-basic",
  title: "경우의 수 세기",
  shortTitle: "경우 세기",
  description:
    "동전, 주사위, 색 공 상황에서 전체 경우와 유리한 경우를 세어 봐요.",
  questionCount: 10,
};

export const PROBABILITY_STAGES: ProbabilityStage[] = [PROBABILITY_STAGE];
