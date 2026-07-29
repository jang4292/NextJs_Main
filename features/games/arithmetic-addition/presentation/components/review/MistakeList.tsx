"use client";

import type { MistakeRecord } from "../../../domain/learningProgress.types";
import { formatAnswerSentence } from "../../../domain/operatorMeta";

interface MistakeListProps {
  mistakes: MistakeRecord[];
  emptyLabel: string;
}

export function MistakeList({ mistakes, emptyLabel }: MistakeListProps) {
  if (mistakes.length === 0) {
    return (
      <p className="rounded-lg bg-neutral-50 px-3 py-2 text-sm text-neutral-600">
        {emptyLabel}
      </p>
    );
  }

  return (
    <ul className="grid gap-2">
      {mistakes.map((mistake) => (
        <li
          key={mistake.questionKey}
          className="flex items-center justify-between gap-3 rounded-lg bg-white px-3 py-2 text-sm text-neutral-700"
        >
          <span className="font-semibold text-neutral-950">
            {formatAnswerSentence({
              leftOperand: mistake.leftOperand,
              rightOperand: mistake.rightOperand,
              operator: mistake.operation,
              answer: mistake.answer,
            })}
          </span>
          <span className="shrink-0 rounded-lg bg-rose-50 px-2 py-1 text-xs font-bold text-rose-900">
            {mistake.mistakeCount}회
          </span>
        </li>
      ))}
    </ul>
  );
}
