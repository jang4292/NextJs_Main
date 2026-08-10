import type { SequenceStage } from "./sequence.types";

export const SEQUENCE_STAGE: SequenceStage = {
  id: "sequence-next-number",
  title: "다음 수 찾기",
  shortTitle: "다음 수",
  description: "일정하게 커지거나 작아지는 수열에서 다음 수를 찾아요.",
  questionCount: 10,
};

export const SEQUENCE_STAGES: SequenceStage[] = [SEQUENCE_STAGE];
