import type {
  AdditionStageId,
  LearningStage,
} from "../arithmetic.types";

export interface OperandPair {
  leftOperand: number;
  rightOperand: number;
}

export interface AdditionStageConfig extends LearningStage {
  id: AdditionStageId;
  operator: "addition";
  buildCandidates?: () => OperandPair[];
  useMixedGenerator?: boolean;
}

const QUESTION_COUNT = 10;

export const ADDITION_STAGES: AdditionStageConfig[] = [
  {
    id: "addition-within-5",
    operator: "addition",
    order: 1,
    title: "5 이하 덧셈",
    shortTitle: "5 이하",
    description: "0부터 5까지의 수를 더해 5 안에서 답을 찾아요.",
    questionCount: QUESTION_COUNT,
    buildCandidates: createWithinFiveCandidates,
  },
  {
    id: "addition-within-10",
    operator: "addition",
    order: 2,
    title: "10 이하 덧셈",
    shortTitle: "10 이하",
    description: "합이 10을 넘지 않는 덧셈을 차근차근 연습해요.",
    questionCount: QUESTION_COUNT,
    buildCandidates: createWithinTenCandidates,
  },
  {
    id: "addition-doubles",
    operator: "addition",
    order: 3,
    title: "같은 수 더하기",
    shortTitle: "같은 수",
    description: "같은 수를 두 번 더하며 짝수 감각을 익혀요.",
    questionCount: QUESTION_COUNT,
    buildCandidates: createDoublesCandidates,
  },
  {
    id: "addition-make-10",
    operator: "addition",
    order: 4,
    title: "10 만들기",
    shortTitle: "10 만들기",
    description: "두 수를 모아 10이 되는 조합을 익혀요.",
    questionCount: QUESTION_COUNT,
    buildCandidates: createMakeTenCandidates,
  },
  {
    id: "addition-over-10",
    operator: "addition",
    order: 5,
    title: "10을 넘는 덧셈",
    shortTitle: "10 넘기",
    description: "한 자리 수끼리 더해 10을 넘는 답을 찾아요.",
    questionCount: QUESTION_COUNT,
    buildCandidates: createOverTenCandidates,
  },
  {
    id: "addition-mixed",
    operator: "addition",
    order: 6,
    title: "한 자리 수 종합",
    shortTitle: "종합",
    description: "1부터 9까지의 한 자리 덧셈을 섞어서 풀어요.",
    questionCount: QUESTION_COUNT,
    useMixedGenerator: true,
  },
];

export function getAdditionStageById(
  stageId: AdditionStageId,
): AdditionStageConfig {
  const stage = ADDITION_STAGES.find((candidate) => candidate.id === stageId);

  if (!stage) {
    throw new Error(`Unknown addition stage: ${stageId}`);
  }

  return stage;
}

function createWithinFiveCandidates(): OperandPair[] {
  return createOperandPairs({
    leftMin: 0,
    leftMax: 5,
    rightMin: 0,
    rightMax: 5,
    predicate: (leftOperand, rightOperand) => leftOperand + rightOperand <= 5,
  });
}

function createWithinTenCandidates(): OperandPair[] {
  return createOperandPairs({
    leftMin: 0,
    leftMax: 9,
    rightMin: 0,
    rightMax: 9,
    predicate: (leftOperand, rightOperand) => leftOperand + rightOperand <= 10,
  });
}

function createDoublesCandidates(): OperandPair[] {
  return Array.from({ length: 10 }, (_, number) => ({
    leftOperand: number,
    rightOperand: number,
  }));
}

function createMakeTenCandidates(): OperandPair[] {
  return Array.from({ length: 11 }, (_, leftOperand) => ({
    leftOperand,
    rightOperand: 10 - leftOperand,
  }));
}

function createOverTenCandidates(): OperandPair[] {
  return createOperandPairs({
    leftMin: 1,
    leftMax: 9,
    rightMin: 1,
    rightMax: 9,
    predicate: (leftOperand, rightOperand) => {
      const answer = leftOperand + rightOperand;
      return answer >= 11 && answer <= 18;
    },
  });
}

function createOperandPairs({
  leftMin,
  leftMax,
  rightMin,
  rightMax,
  predicate,
}: {
  leftMin: number;
  leftMax: number;
  rightMin: number;
  rightMax: number;
  predicate: (leftOperand: number, rightOperand: number) => boolean;
}): OperandPair[] {
  const pairs: OperandPair[] = [];

  for (let leftOperand = leftMin; leftOperand <= leftMax; leftOperand += 1) {
    for (
      let rightOperand = rightMin;
      rightOperand <= rightMax;
      rightOperand += 1
    ) {
      if (predicate(leftOperand, rightOperand)) {
        pairs.push({ leftOperand, rightOperand });
      }
    }
  }

  return pairs;
}
