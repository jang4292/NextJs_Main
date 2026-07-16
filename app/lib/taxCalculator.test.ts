import { describe, expect, it } from "vitest";
import { calculateTax } from "./taxCalculator";

describe("calculateTax", () => {
  it("selects the correct bracket for a mid-bracket salary", () => {
    // 30,000,000 falls in the 12,000,000-46,000,000 bracket (15%, deduction 1,080,000)
    const result = calculateTax({
      grossSalary: 30_000_000,
      includeInsurance: false,
    });
    const expectedIncomeTax = Math.floor(30_000_000 * 0.15 - 1_080_000);
    expect(result.incomeTax).toBe(expectedIncomeTax);
  });

  it("treats the lower bound of a bracket as inclusive", () => {
    // Exactly 12,000,000 should fall into the second bracket (min: 12,000,000)
    const result = calculateTax({
      grossSalary: 12_000_000,
      includeInsurance: false,
    });
    const expectedIncomeTax = Math.floor(12_000_000 * 0.15 - 1_080_000);
    expect(result.incomeTax).toBe(expectedIncomeTax);
  });

  it("converts monthly salary to annual before bracket lookup", () => {
    const monthly = calculateTax({
      grossSalary: 2_500_000,
      monthly: true,
      includeInsurance: false,
    });
    const annual = calculateTax({
      grossSalary: 30_000_000,
      includeInsurance: false,
    });
    expect(monthly.incomeTax).toBe(annual.incomeTax);
  });

  it("zeroes insurance deductions when includeInsurance is false, but not tax", () => {
    const withInsurance = calculateTax({
      grossSalary: 30_000_000,
      includeInsurance: true,
    });
    const withoutInsurance = calculateTax({
      grossSalary: 30_000_000,
      includeInsurance: false,
    });

    expect(withoutInsurance.nationalPension).toBe(0);
    expect(withoutInsurance.healthInsurance).toBe(0);
    expect(withoutInsurance.employmentInsurance).toBe(0);
    expect(withoutInsurance.incomeTax).toBe(withInsurance.incomeTax);
    expect(withoutInsurance.localIncomeTax).toBe(withInsurance.localIncomeTax);
  });

  it("computes localIncomeTax as 10% of incomeTax", () => {
    const result = calculateTax({
      grossSalary: 30_000_000,
      includeInsurance: false,
    });
    expect(result.localIncomeTax).toBe(Math.floor(result.incomeTax * 0.1));
  });

  it("adds bonus into the bracket lookup", () => {
    const withBonus = calculateTax({
      grossSalary: 11_000_000,
      bonus: 1_500_000,
      includeInsurance: false,
    });
    // totalIncome = 12,500,000 -> second bracket, not the first
    const expectedIncomeTax = Math.floor(12_500_000 * 0.15 - 1_080_000);
    expect(withBonus.incomeTax).toBe(expectedIncomeTax);
  });

  it("throws for a negative salary", () => {
    expect(() => calculateTax({ grossSalary: -1 })).toThrow();
  });

  it("returns integer (floored) values for all fields", () => {
    const result = calculateTax({
      grossSalary: 33_333_333,
      includeInsurance: true,
    });
    for (const value of Object.values(result)) {
      expect(Number.isInteger(value)).toBe(true);
    }
  });

  it("computes netSalary as annualSalary minus totalDeductions", () => {
    const result = calculateTax({
      grossSalary: 30_000_000,
      includeInsurance: true,
    });
    expect(result.netSalary).toBe(30_000_000 - result.totalDeductions);
  });
});
