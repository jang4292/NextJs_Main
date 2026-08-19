import type {
  ArithmeticQuestion,
  Difficulty,
} from "../../domain/arithmetic.types";
import type { MultiplicationStageConfig } from "../../domain/stages/multiplicationStages";
import { shuffle, type Rng } from "./shuffle";

export function generateMultiplicationQuestions(
  stage: MultiplicationStageConfig,
  rng: Rng = Math.random,
): ArithmeticQuestion[] {
  return shuffle(stage.buildCandidates(), rng)
    .slice(0, stage.questionCount)
    .map(({ leftOperand, rightOperand }) => ({
      id: `${stage.id}-${leftOperand}-${rightOperand}`,
      leftOperand,
      rightOperand,
      operator: "multiplication",
      answer: leftOperand * rightOperand,
      difficulty: classifyMultiplicationDifficulty(leftOperand, rightOperand),
      stageId: stage.id,
    }));
}

function classifyMultiplicationDifficulty(
  leftOperand: number,
  rightOperand: number,
): Difficulty {
  if (leftOperand <= 1 || rightOperand <= 1) {
    return "easy";
  }

  if (leftOperand * rightOperand <= 10) {
    return "easy";
  }

  return "medium";
}
