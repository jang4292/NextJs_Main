"use client";

import type { ArithmeticQuestion } from "../../domain/arithmetic.types";
import { QuantityVisualizer } from "./QuantityVisualizer";

interface QuestionBoardProps {
  question: ArithmeticQuestion;
}

export function QuestionBoard({ question }: QuestionBoardProps) {
  return (
    <div className="rounded-lg border border-neutral-200 bg-white p-4 text-center shadow-sm">
      <p className="text-sm font-medium text-neutral-500">다음 덧셈을 풀어요</p>
      <div
        className="mt-2 text-[clamp(2.75rem,17vw,5.5rem)] font-black leading-none text-neutral-950"
        aria-label={`${question.leftOperand} 더하기 ${question.rightOperand}`}
      >
        {question.leftOperand} + {question.rightOperand}
      </div>
      <QuantityVisualizer
        leftOperand={question.leftOperand}
        rightOperand={question.rightOperand}
      />
    </div>
  );
}

