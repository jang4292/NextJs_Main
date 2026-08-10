"use client";

import {
  Divide,
  Minus,
  Plus,
  Shuffle,
  X,
} from "lucide-react";
import {
  ARITHMETIC_OPERATOR_CONFIGS,
  ARITHMETIC_OPERATORS,
} from "../../../application/arithmeticOperatorRegistry";
import type { Operator } from "../../../domain/arithmetic.types";
import {
  OperationCard,
  type OperationCardItem,
} from "./OperationCard";

interface OperationGridProps {
  onSelectOperation: (operator: Operator) => void;
}

const OPERATION_PRESENTATION: Record<
  Operator,
  Pick<OperationCardItem, "description" | "icon" | "tone">
> = {
  addition: {
    description: "작은 수부터 한 자리 수 종합까지 단계별로 풀어요.",
    icon: Plus,
    tone: "emerald",
  },
  subtraction: {
    description: "0 만들기와 10에서 빼기를 차근차근 연습해요.",
    icon: Minus,
    tone: "sky",
  },
  multiplication: {
    description: "같은 묶음, 0 곱하기, 1 곱하기부터 시작해요.",
    icon: X,
    tone: "amber",
  },
  division: {
    description: "나머지 없이 몇 묶음으로 나누는지 살펴보며 풀어요.",
    icon: Divide,
    tone: "rose",
  },
};

const OPERATIONS: OperationCardItem[] = [
  ...ARITHMETIC_OPERATORS.map((operator) => {
    const config = ARITHMETIC_OPERATOR_CONFIGS[operator];
    const presentation = OPERATION_PRESENTATION[operator];

    return {
      id: operator,
      title: config.label,
      description: presentation.description,
      badge: `${config.stages.length}단계`,
      enabled: true,
      icon: presentation.icon,
      tone: presentation.tone,
    };
  }),
  {
    id: "mixed",
    title: "혼합",
    description: "연산을 섞어 푸는 흐름은 나중에 만나요.",
    badge: "예정",
    enabled: false,
    icon: Shuffle,
    tone: "violet",
  },
];

export function OperationGrid({ onSelectOperation }: OperationGridProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2" aria-label="연산 선택">
      {OPERATIONS.map((operation) => (
        <OperationCard
          key={operation.id}
          item={operation}
          onSelect={onSelectOperation}
        />
      ))}
    </div>
  );
}
