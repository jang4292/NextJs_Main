import type { ArithmeticQuestion } from "../../domain/arithmetic.types";
import { classifyAdditionDifficulty } from "../../domain/difficulty";
import type { AdditionStageConfig } from "../../domain/stages/additionStages";
import { generateQuestions } from "./generateQuestions";
import { shuffle, type Rng } from "./shuffle";

export function generateAdditionStageQuestions(
  stage: AdditionStageConfig,
  rng: Rng = Math.random,
): ArithmeticQuestion[] {
  if (stage.useMixedGenerator) {
    return generateQuestions({
      totalQuestions: stage.questionCount,
      rng,
    });
  }

  const candidates = stage.buildCandidates?.() ?? [];

  return shuffle(candidates, rng)
    .slice(0, stage.questionCount)
    .map(({ leftOperand, rightOperand }) => ({
      id: `${stage.id}-${leftOperand}-${rightOperand}`,
      leftOperand,
      rightOperand,
      operator: "addition",
      answer: leftOperand + rightOperand,
      difficulty: classifyAdditionDifficulty(leftOperand, rightOperand),
      stageId: stage.id,
    }));
}
