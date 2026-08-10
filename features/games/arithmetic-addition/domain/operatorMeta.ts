import type { ArithmeticQuestion, Operator } from "./arithmetic.types";

export const OPERATOR_SYMBOL: Record<Operator, string> = {
  addition: "+",
  subtraction: "-",
  multiplication: "×",
  division: "÷",
};

export const OPERATOR_LABEL: Record<Operator, string> = {
  addition: "덧셈",
  subtraction: "뺄셈",
  multiplication: "곱셈",
  division: "나눗셈",
};

export const OPERATOR_VERB: Record<Operator, string> = {
  addition: "더하기",
  subtraction: "빼기",
  multiplication: "곱하기",
  division: "나누기",
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
  if (question.operator === "division") {
    return `${question.leftOperand}개를 ${question.rightOperand}개의 묶음으로 나누기`;
  }

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

  if (question.operator === "multiplication") {
    return `${question.leftOperand}묶음에 ${question.rightOperand}개씩 있다고 생각해 보세요.`;
  }

  if (question.operator === "division") {
    return `${question.leftOperand}개를 ${question.rightOperand}개의 묶음으로 똑같이 나누어 보세요.`;
  }

  return `${question.leftOperand}개와 ${question.rightOperand}개를 합쳐 보세요.`;
}

export function getQuestionPrompt(operator: Operator): string {
  return `다음 ${OPERATOR_LABEL[operator]}을 풀어요`;
}
