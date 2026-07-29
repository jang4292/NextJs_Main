import type {
  ArithmeticQuestion,
  Difficulty,
} from "../../domain/arithmetic.types";
import type { SubtractionStageConfig } from "../../domain/stages/subtractionStages";
import { shuffle, type Rng } from "./shuffle";

export function generateSubtractionQuestions(
  stage: SubtractionStageConfig,
  rng: Rng = Math.random,
): ArithmeticQuestion[] {
  return shuffle(stage.buildCandidates(), rng)
    .slice(0, stage.questionCount)
    .map(({ leftOperand, rightOperand }) => ({
      id: `${stage.id}-${leftOperand}-${rightOperand}`,
      leftOperand,
      rightOperand,
      operator: "subtraction",
      answer: leftOperand - rightOperand,
      difficulty: classifySubtractionDifficulty(leftOperand, rightOperand),
      stageId: stage.id,
    }));
}

function classifySubtractionDifficulty(
  leftOperand: number,
  rightOperand: number,
): Difficulty {
  if (leftOperand <= 5 || leftOperand === rightOperand) {
    return "easy";
  }

  if (leftOperand <= 10 && rightOperand <= 5) {
    return "medium";
  }

  return "hard";
}
