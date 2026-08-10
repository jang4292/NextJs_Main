import type {
  ArithmeticQuestion,
  Difficulty,
} from "../../domain/arithmetic.types";
import type { DivisionStageConfig } from "../../domain/stages/divisionStages";
import { shuffle, type Rng } from "./shuffle";

export function generateDivisionQuestions(
  stage: DivisionStageConfig,
  rng: Rng = Math.random,
): ArithmeticQuestion[] {
  return shuffle(stage.buildCandidates(), rng)
    .slice(0, stage.questionCount)
    .map(({ leftOperand, rightOperand }) => ({
      id: `${stage.id}-${leftOperand}-${rightOperand}`,
      leftOperand,
      rightOperand,
      operator: "division",
      answer: leftOperand / rightOperand,
      difficulty: classifyDivisionDifficulty(leftOperand, rightOperand),
      stageId: stage.id,
    }));
}

function classifyDivisionDifficulty(
  leftOperand: number,
  rightOperand: number,
): Difficulty {
  const quotient = leftOperand / rightOperand;

  if (rightOperand <= 2 || quotient <= 3) {
    return "easy";
  }

  if (leftOperand <= 16) {
    return "medium";
  }

  return "hard";
}
