import type { ArithmeticQuestion, Operator } from "./arithmetic.types";

export const OPERATOR_SYMBOL: Record<Operator, string> = {
  addition: "+",
  subtraction: "-",
};

export const OPERATOR_LABEL: Record<Operator, string> = {
  addition: "덧셈",
  subtraction: "뺄셈",
};

export const OPERATOR_VERB: Record<Operator, string> = {
  addition: "더하기",
  subtraction: "빼기",
};

export function formatQuestionExpression(
  question: Pick<
    ArithmeticQuestion,
    "leftOperand" | "rightOperand" | "operator"
  >,
): string {
  return `${question.leftOperand} ${OPERATOR_SYMBOL[question.operator]} ${question.rightOperand}`;
}

export function formatQuestionAriaLabel(
  question: Pick<
    ArithmeticQuestion,
    "leftOperand" | "rightOperand" | "operator"
  >,
): string {
  return `${question.leftOperand} ${OPERATOR_VERB[question.operator]} ${question.rightOperand}`;
}

export function formatAnswerSentence(
  question: Pick<
    ArithmeticQuestion,
    "leftOperand" | "rightOperand" | "operator" | "answer"
  >,
): string {
  return `${formatQuestionExpression(question)} = ${question.answer}`;
}

export function formatTryAgainMessage(
  question: Pick<
    ArithmeticQuestion,
    "leftOperand" | "rightOperand" | "operator"
  >,
): string {
  if (question.operator === "subtraction") {
    return `${question.leftOperand}개에서 ${question.rightOperand}개를 덜어 내 보세요.`;
  }

  return `${question.leftOperand}개와 ${question.rightOperand}개를 합쳐 보세요.`;
}

export function getQuestionPrompt(operator: Operator): string {
  return `다음 ${OPERATOR_LABEL[operator]}을 풀어요`;
}
