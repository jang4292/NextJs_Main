import type {
  LearningStage,
  MultiplicationStageId,
} from "../arithmetic.types";
import type { OperandPair } from "./additionStages";

export interface MultiplicationStageConfig extends LearningStage {
  id: MultiplicationStageId;
  operator: "multiplication";
  buildCandidates: () => OperandPair[];
}

const QUESTION_COUNT = 10;

export const MULTIPLICATION_STAGES: MultiplicationStageConfig[] = [
  {
    id: "multiplication-equal-groups",
    operator: "multiplication",
    category: "basic",
    order: 1,
    title: "같은 묶음",
    shortTitle: "같은 묶음",
    description: "같은 수가 여러 묶음 있을 때 곱셈으로 나타내요.",
    questionTypes: ["standard"],
    questionCount: QUESTION_COUNT,
    ruleId: "multiplication.equal-groups",
    buildCandidates: createEqualGroupsCandidates,
  },
  {
    id: "multiplication-by-zero",
    operator: "multiplication",
    category: "basic",
    order: 2,
    title: "0 곱하기",
    shortTitle: "0 곱하기",
    description: "0이 들어간 곱셈은 왜 0이 되는지 익혀요.",
    questionTypes: ["standard"],
    questionCount: QUESTION_COUNT,
    prerequisites: ["multiplication-equal-groups"],
    ruleId: "multiplication.by-zero",
    buildCandidates: createByZeroCandidates,
  },
  {
    id: "multiplication-by-one",
    operator: "multiplication",
    category: "basic",
    order: 3,
    title: "1 곱하기",
    shortTitle: "1 곱하기",
    description: "1이 들어간 곱셈은 원래 수와 같다는 것을 익혀요.",
    questionTypes: ["standard"],
    questionCount: QUESTION_COUNT,
    prerequisites: ["multiplication-by-zero"],
    ruleId: "multiplication.by-one",
    buildCandidates: createByOneCandidates,
  },
];

export function getMultiplicationStageById(
  stageId: MultiplicationStageId,
): MultiplicationStageConfig {
  const stage = MULTIPLICATION_STAGES.find(
    (candidate) => candidate.id === stageId,
  );

  if (!stage) {
    throw new Error(`Unknown multiplication stage: ${stageId}`);
  }

  return stage;
}

function createEqualGroupsCandidates(): OperandPair[] {
  return createOperandPairs({
    leftMin: 2,
    leftMax: 4,
    rightMin: 2,
    rightMax: 5,
  });
}

function createByZeroCandidates(): OperandPair[] {
  return uniquePairs([
    ...Array.from({ length: 10 }, (_, rightOperand) => ({
      leftOperand: 0,
      rightOperand,
    })),
    ...Array.from({ length: 10 }, (_, leftOperand) => ({
      leftOperand,
      rightOperand: 0,
    })),
  ]);
}

function createByOneCandidates(): OperandPair[] {
  return uniquePairs([
    ...Array.from({ length: 10 }, (_, rightOperand) => ({
      leftOperand: 1,
      rightOperand,
    })),
    ...Array.from({ length: 10 }, (_, leftOperand) => ({
      leftOperand,
      rightOperand: 1,
    })),
  ]);
}

function createOperandPairs({
  leftMin,
  leftMax,
  rightMin,
  rightMax,
}: {
  leftMin: number;
  leftMax: number;
  rightMin: number;
  rightMax: number;
}): OperandPair[] {
  const pairs: OperandPair[] = [];

  for (let leftOperand = leftMin; leftOperand <= leftMax; leftOperand += 1) {
    for (
      let rightOperand = rightMin;
      rightOperand <= rightMax;
      rightOperand += 1
    ) {
      pairs.push({ leftOperand, rightOperand });
    }
  }

  return pairs;
}

function uniquePairs(pairs: OperandPair[]): OperandPair[] {
  const seen = new Set<string>();

  return pairs.filter((pair) => {
    const key = `${pair.leftOperand}-${pair.rightOperand}`;
    if (seen.has(key)) return false;

    seen.add(key);
    return true;
  });
}
