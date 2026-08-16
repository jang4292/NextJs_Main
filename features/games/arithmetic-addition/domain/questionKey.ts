import type { Operator, StageId } from "./arithmetic.types";

export type ArithmeticQuestionType = "standard";

export function buildQuestionKey(
  operator: Operator,
  stageId: StageId,
  questionType: ArithmeticQuestionType,
  leftOperand: number,
  rightOperand: number,
): string {
  return [operator, stageId, questionType, leftOperand, rightOperand].join(":");
}
