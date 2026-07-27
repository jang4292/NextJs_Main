import { describe, expect, it } from "vitest";
import {
  adjustSalary,
  formatNumber,
  initialTaxCalculatorState,
  submitTaxCalculation,
  updateSalary,
} from "./taxCalculatorViewModel";

describe("taxCalculatorViewModel", () => {
  it("keeps only numeric characters in salary input", () => {
    const state = updateSalary(initialTaxCalculatorState, "월 4,000,000원");

    expect(state.salary).toBe("4000000");
    expect(state.error).toBe("");
  });

  it("blocks salary decrement below zero", () => {
    const state = adjustSalary(initialTaxCalculatorState, -10_000);

    expect(state.salary).toBe("");
    expect(state.error).toBe("금액은 0원 미만이 될 수 없습니다.");
  });

  it("submits a valid monthly salary into a tax result", () => {
    const state = submitTaxCalculation({
      ...initialTaxCalculatorState,
      salary: "2500000",
      monthly: true,
      includeInsurance: false,
    });

    expect(state.error).toBe("");
    expect(state.result?.incomeTax).toBe(3_420_000);
  });

  it("formats numeric display values for Korean users", () => {
    expect(formatNumber(1_000_000)).toBe("1,000,000");
    expect(formatNumber("")).toBe("");
  });
});
