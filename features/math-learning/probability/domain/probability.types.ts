export type ProbabilityStageId = "probability-basic";

export type ProbabilityQuestionKind =
  | "total-outcomes"
  | "favorable-outcomes";

export type ProbabilityScenarioKind = "coin" | "die" | "color-pick";

export type ProbabilityDifficulty = "easy" | "medium";

export interface ProbabilityStage {
  id: ProbabilityStageId;
  title: string;
  shortTitle: string;
  description: string;
  questionCount: number;
}

export interface ProbabilityQuestion {
  id: string;
  scenarioKind: ProbabilityScenarioKind;
  scenarioTitle: string;
  situation: string;
  questionText: string;
  outcomes: string[];
  targetOutcomeLabels: string[];
  answer: number;
  explanation: string;
  kind: ProbabilityQuestionKind;
  difficulty: ProbabilityDifficulty;
  stageId: ProbabilityStageId;
}
