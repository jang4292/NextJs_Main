export type SequenceStageId = "sequence-next-number";

export type SequenceDirection = "increase" | "decrease";

export type SequenceDifficulty = "easy" | "medium";

export interface SequenceStage {
  id: SequenceStageId;
  title: string;
  shortTitle: string;
  description: string;
  questionCount: number;
}

export interface SequenceQuestion {
  id: string;
  values: number[];
  answer: number;
  step: number;
  direction: SequenceDirection;
  difficulty: SequenceDifficulty;
  stageId: SequenceStageId;
}
