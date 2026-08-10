export interface StatisticsSummary {
  sum: number;
  minimum: number;
  maximum: number;
  mean: number;
  median: number;
  mode: number;
}

export function calculateStatistics(values: readonly number[]): StatisticsSummary {
  assertNonEmpty(values);

  return {
    sum: calculateSum(values),
    minimum: calculateMinimum(values),
    maximum: calculateMaximum(values),
    mean: calculateMean(values),
    median: calculateMedian(values),
    mode: calculateMode(values),
  };
}

export function calculateSum(values: readonly number[]): number {
  assertNonEmpty(values);
  return values.reduce((sum, value) => sum + value, 0);
}

export function calculateMinimum(values: readonly number[]): number {
  assertNonEmpty(values);
  return Math.min(...values);
}

export function calculateMaximum(values: readonly number[]): number {
  assertNonEmpty(values);
  return Math.max(...values);
}

export function calculateMean(values: readonly number[]): number {
  return calculateSum(values) / values.length;
}

export function calculateMedian(values: readonly number[]): number {
  assertNonEmpty(values);

  const sorted = [...values].sort((left, right) => left - right);
  const middleIndex = Math.floor(sorted.length / 2);

  if (sorted.length % 2 === 1) {
    return sorted[middleIndex];
  }

  return (sorted[middleIndex - 1] + sorted[middleIndex]) / 2;
}

export function calculateMode(values: readonly number[]): number {
  assertNonEmpty(values);

  const counts = new Map<number, number>();

  for (const value of values) {
    counts.set(value, (counts.get(value) ?? 0) + 1);
  }

  return [...counts.entries()].sort(
    ([leftValue, leftCount], [rightValue, rightCount]) => {
      if (rightCount !== leftCount) return rightCount - leftCount;
      return leftValue - rightValue;
    },
  )[0][0];
}

export function hasUniqueMode(values: readonly number[]): boolean {
  assertNonEmpty(values);

  const counts = new Map<number, number>();

  for (const value of values) {
    counts.set(value, (counts.get(value) ?? 0) + 1);
  }

  const frequencies = [...counts.values()].sort((left, right) => right - left);

  return frequencies.length === 1 || frequencies[0] > frequencies[1];
}

function assertNonEmpty(values: readonly number[]) {
  if (values.length === 0) {
    throw new Error("Statistics values must not be empty.");
  }
}
