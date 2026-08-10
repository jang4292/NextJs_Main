import type {
  DivisionStageId,
  LearningStage,
} from "../arithmetic.types";

export interface DivisionPair {
  leftOperand: number;
  rightOperand: number;
}

export interface DivisionStageConfig extends LearningStage {
  id: DivisionStageId;
  operator: "division";
  buildCandidates: () => DivisionPair[];
}

const QUESTION_COUNT = 10;

export const DIVISION_STAGES: DivisionStageConfig[] = [
  {
    id: "division-equal-sharing",
    operator: "division",
    category: "basic",
    order: 1,
    title: "똑같이 나누기",
    shortTitle: "똑같이 나누기",
    description: "전체 개수를 몇 개의 묶음으로 똑같이 나누는지 보고 한 묶음의 수를 찾아요.",
    questionTypes: ["standard"],
    questionCount: QUESTION_COUNT,
    ruleId: "division.equal-sharing",
    buildCandidates: createEqualSharingCandidates,
  },
];

export function getDivisionStageById(
  stageId: DivisionStageId,
): DivisionStageConfig {
  const stage = DIVISION_STAGES.find((candidate) => candidate.id === stageId);

  if (!stage) {
    throw new Error(`Unknown division stage: ${stageId}`);
  }

  return stage;
}

function createEqualSharingCandidates(): DivisionPair[] {
  const pairs: DivisionPair[] = [];

  for (let groupCount = 2; groupCount <= 5; groupCount += 1) {
    for (let itemsPerGroup = 2; itemsPerGroup <= 5; itemsPerGroup += 1) {
      pairs.push({
        leftOperand: groupCount * itemsPerGroup,
        rightOperand: groupCount,
      });
    }
  }

  return pairs;
}
