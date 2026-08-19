import type { LearningStage, SubtractionStageId } from "../arithmetic.types";
import type { OperandPair } from "./additionStages";

export interface SubtractionStageConfig extends LearningStage {
  id: SubtractionStageId;
  operator: "subtraction";
  buildCandidates: () => OperandPair[];
}

const QUESTION_COUNT = 10;

export const SUBTRACTION_STAGES: SubtractionStageConfig[] = [
  {
    id: "subtraction-within-5",
    operator: "subtraction",
    category: "basic",
    order: 1,
    title: "5 이하 뺄셈",
    shortTitle: "5 이하",
    description: "0부터 5까지의 수에서 빼며 답을 찾아요.",
    questionTypes: ["standard"],
    questionCount: QUESTION_COUNT,
    ruleId: "subtraction.within-5",
    buildCandidates: () => createSubtractionPairs(0, 5),
  },
  {
    id: "subtraction-within-10",
    operator: "subtraction",
    category: "basic",
    order: 2,
    title: "10 이하 뺄셈",
    shortTitle: "10 이하",
    description: "10 이하의 수에서 빼는 연습을 해요.",
    questionTypes: ["standard"],
    questionCount: QUESTION_COUNT,
    prerequisites: ["subtraction-within-5"],
    ruleId: "subtraction.within-10",
    buildCandidates: () => createSubtractionPairs(0, 10),
  },
  {
    id: "subtraction-to-zero",
    operator: "subtraction",
    category: "basic",
    order: 3,
    title: "0 만들기",
    shortTitle: "0 만들기",
    description: "같은 수를 빼서 0이 되는 관계를 익혀요.",
    questionTypes: ["standard"],
    questionCount: QUESTION_COUNT,
    prerequisites: ["subtraction-within-10"],
    ruleId: "subtraction.to-zero",
    buildCandidates: createToZeroCandidates,
  },
  {
    id: "subtraction-from-10",
    operator: "subtraction",
    category: "basic",
    order: 4,
    title: "10에서 빼기",
    shortTitle: "10에서 빼기",
    description: "10에서 여러 수를 빼며 보수 감각을 익혀요.",
    questionTypes: ["standard"],
    questionCount: QUESTION_COUNT,
    prerequisites: ["subtraction-within-10"],
    ruleId: "subtraction.from-10",
    buildCandidates: createFromTenCandidates,
  },
  {
    id: "subtraction-mixed",
    operator: "subtraction",
    category: "basic",
    order: 5,
    title: "뺄셈 종합",
    shortTitle: "종합",
    description: "10 이하 뺄셈을 섞어서 풀어요.",
    questionTypes: ["standard"],
    questionCount: QUESTION_COUNT,
    prerequisites: ["subtraction-from-10"],
    ruleId: "subtraction.mixed-basic",
    buildCandidates: createMixedCandidates,
  },
];

export function getSubtractionStageById(
  stageId: SubtractionStageId,
): SubtractionStageConfig {
  const stage = SUBTRACTION_STAGES.find(
    (candidate) => candidate.id === stageId,
  );

  if (!stage) {
    throw new Error(`Unknown subtraction stage: ${stageId}`);
  }

  return stage;
}

function createSubtractionPairs(min: number, max: number): OperandPair[] {
  const pairs: OperandPair[] = [];

  for (let leftOperand = min; leftOperand <= max; leftOperand += 1) {
    for (
      let rightOperand = min;
      rightOperand <= leftOperand;
      rightOperand += 1
    ) {
      pairs.push({ leftOperand, rightOperand });
    }
  }

  return pairs;
}

function createToZeroCandidates(): OperandPair[] {
  return Array.from({ length: 10 }, (_, number) => ({
    leftOperand: number,
    rightOperand: number,
  }));
}

function createFromTenCandidates(): OperandPair[] {
  return Array.from({ length: 11 }, (_, rightOperand) => ({
    leftOperand: 10,
    rightOperand,
  }));
}

function createMixedCandidates(): OperandPair[] {
  return uniquePairs([
    ...createSubtractionPairs(0, 5),
    ...createFromTenCandidates(),
    ...createToZeroCandidates(),
    ...createSubtractionPairs(6, 10),
  ]);
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
