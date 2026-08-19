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
  if (operator === "multiplication") {
    return (
      <MultiplicationVisualizer
        groupCount={leftOperand}
        itemsPerGroup={rightOperand}
      />
    );
  }

  if (operator === "division") {
    return (
      <DivisionVisualizer totalCount={leftOperand} groupCount={rightOperand} />
    );
  }

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

function DivisionVisualizer({
  totalCount,
  groupCount,
}: {
  totalCount: number;
  groupCount: number;
}) {
  const itemsPerGroup = totalCount / groupCount;

  return (
    <div
      className={styles.divisionQuantity}
      aria-label={`${totalCount}개를 ${groupCount}개의 묶음으로 똑같이 나누는 모습`}
    >
      {Array.from({ length: groupCount }, (_, groupIndex) => (
        <span key={groupIndex} className={styles.divisionGroup}>
          <DotGroup count={itemsPerGroup} tone="division" />
        </span>
      ))}
    </div>
  );
}

function MultiplicationVisualizer({
  groupCount,
  itemsPerGroup,
}: {
  groupCount: number;
  itemsPerGroup: number;
}) {
  return (
    <div
      className={styles.multiplicationQuantity}
      aria-label={`${groupCount}묶음에 ${itemsPerGroup}개씩 곱하는 모습`}
    >
      {groupCount === 0 ? (
        <span className={styles.emptyGroup}>0묶음</span>
      ) : (
        Array.from({ length: groupCount }, (_, groupIndex) => (
          <span key={groupIndex} className={styles.multiplicationGroup}>
            {itemsPerGroup === 0 ? (
              <span className={styles.emptyGroup}>0개</span>
            ) : (
              <DotGroup count={itemsPerGroup} tone="multiplication" />
            )}
          </span>
        ))
      )}
    </div>
  );
}

function DotGroup({
  count,
  tone,
}: {
  count: number;
  tone: "left" | "right" | "removed" | "multiplication" | "division";
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
                : tone === "multiplication"
                  ? styles.dotMultiplication
                  : tone === "division"
                    ? styles.dotDivision
                    : styles.dotRemoved
          }
          aria-hidden="true"
        />
      ))}
    </span>
  );
}
