import type { Difficulty } from "./arithmetic.types";

export function classifyAdditionDifficulty(
  leftOperand: number,
  rightOperand: number,
): Difficulty {
  const answer = leftOperand + rightOperand;

  if (answer > 10) {
    return "hard";
  }

  if (
    leftOperand <= 2 ||
    rightOperand <= 2 ||
    leftOperand === rightOperand ||
    answer <= 5
  ) {
    return "easy";
  }

  return "medium";
}

