"use client";

import styles from "../styles/arithmetic.module.css";

interface QuantityVisualizerProps {
  leftOperand: number;
  rightOperand: number;
}

export function QuantityVisualizer({
  leftOperand,
  rightOperand,
}: QuantityVisualizerProps) {
  return (
    <div
      className={styles.quantity}
      aria-label={`${leftOperand}개와 ${rightOperand}개를 더하는 모습`}
    >
      <DotGroup count={leftOperand} tone="left" />
      <span className={styles.quantityOperator} aria-hidden="true">
        +
      </span>
      <DotGroup count={rightOperand} tone="right" />
    </div>
  );
}

function DotGroup({ count, tone }: { count: number; tone: "left" | "right" }) {
  return (
    <span className={styles.dotGroup}>
      {Array.from({ length: count }, (_, index) => (
        <span
          key={index}
          className={tone === "left" ? styles.dotLeft : styles.dotRight}
          aria-hidden="true"
        />
      ))}
    </span>
  );
}

