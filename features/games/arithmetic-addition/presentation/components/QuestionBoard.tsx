"use client";

import type { ArithmeticQuestion } from "../../domain/arithmetic.types";
import {
  formatQuestionAriaLabel,
  formatQuestionExpression,
  getQuestionPrompt,
} from "../../domain/operatorMeta";
import { QuantityVisualizer } from "./QuantityVisualizer";

interface QuestionBoardProps {
  question: ArithmeticQuestion;
}

export function QuestionBoard({ question }: QuestionBoardProps) {
  return (
    <div className="rounded-lg border border-neutral-200 bg-white p-4 text-center shadow-sm">
      <p className="text-sm font-medium text-neutral-500">
        {getQuestionPrompt(question.operator)}
      </p>
      <div
        className="mt-2 text-[clamp(2.75rem,17vw,5.5rem)] leading-none font-black text-neutral-950"
        aria-label={formatQuestionAriaLabel(question)}
      >
        {formatQuestionExpression(question)}
      </div>
      <QuantityVisualizer
        leftOperand={question.leftOperand}
        rightOperand={question.rightOperand}
        operator={question.operator}
      />
    </div>
  );
}
