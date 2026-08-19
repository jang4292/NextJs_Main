import { describe, expect, it } from "vitest";
import {
  calculateMaximum,
  calculateMean,
  calculateMedian,
  calculateMinimum,
  calculateMode,
  calculateStatistics,
  calculateSum,
  hasUniqueMode,
} from "./statistics";

describe("statistics calculations", () => {
  it("calculates sum, min, max, mean, median, and mode", () => {
    expect(calculateStatistics([3, 5, 5, 7, 10])).toEqual({
      sum: 30,
      minimum: 3,
      maximum: 10,
      mean: 6,
      median: 5,
      mode: 5,
    });
  });

  it("calculates each statistic independently", () => {
    const values = [2, 4, 6, 8];

    expect(calculateSum(values)).toBe(20);
    expect(calculateMinimum(values)).toBe(2);
    expect(calculateMaximum(values)).toBe(8);
    expect(calculateMean(values)).toBe(5);
    expect(calculateMedian(values)).toBe(5);
  });

  it("uses the smallest value when multiple modes tie", () => {
    expect(calculateMode([1, 2, 2, 3, 3])).toBe(2);
  });

  it("detects whether a data set has a unique mode", () => {
    expect(hasUniqueMode([1, 2, 2, 3, 4])).toBe(true);
    expect(hasUniqueMode([1, 2, 2, 3, 3])).toBe(false);
  });

  it("rejects empty data sets", () => {
    expect(() => calculateStatistics([])).toThrow(
      "Statistics values must not be empty.",
    );
  });
});
