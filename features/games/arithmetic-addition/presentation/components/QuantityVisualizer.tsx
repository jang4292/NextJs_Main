"use client";

import type { Operator } from "../../domain/arithmetic.types";
import { OPERATOR_SYMBOL } from "../../domain/operatorMeta";
import styles from "../styles/arithmetic.module.css";

interface QuantityVisualizerProps {
  leftOperand: number;
  rightOperand: number;
  operator?: Operator;
}

export function QuantityVisualizer({
  leftOperand,
  rightOperand,
  operator = "addition",
}: QuantityVisualizerProps) {
  return (
    <div
      className={styles.quantity}
      aria-label={
        operator === "subtraction"
          ? `${leftOperand}개에서 ${rightOperand}개를 빼는 모습`
          : `${leftOperand}개와 ${rightOperand}개를 더하는 모습`
      }
    >
      <DotGroup count={leftOperand} tone="left" />
      <span className={styles.quantityOperator} aria-hidden="true">
        {OPERATOR_SYMBOL[operator]}
      </span>
      <DotGroup
        count={rightOperand}
        tone={operator === "subtraction" ? "removed" : "right"}
      />
    </div>
  );
}

function DotGroup({
  count,
  tone,
}: {
  count: number;
  tone: "left" | "right" | "removed";
}) {
  return (
    <span className={styles.dotGroup}>
      {Array.from({ length: count }, (_, index) => (
        <span
          key={index}
          className={
            tone === "left"
              ? styles.dotLeft
              : tone === "right"
                ? styles.dotRight
                : styles.dotRemoved
          }
          aria-hidden="true"
        />
      ))}
    </span>
  );
}
