import { calculateTax } from "./calculateTax";
import type { TaxResult } from "../../domain/entities/Tax";

export interface TaxCalculatorState {
  salary: string;
  monthly: boolean;
  includeInsurance: boolean;
  result: TaxResult | null;
  error: string;
}

export const TAX_INCREMENT_OPTIONS = [10_000, 100_000, 1_000_000] as const;

export const initialTaxCalculatorState: TaxCalculatorState = {
  salary: "",
  monthly: true,
  includeInsurance: true,
  result: null,
  error: "",
};

export function extractNumbers(value: string): string {
  return value.replace(/[^0-9]/g, "");
}

export function formatNumber(num: number | string): string {
  if (num === "" || num === null || Number.isNaN(Number(num))) return "";
  return Number(num).toLocaleString("ko-KR");
}

export function updateSalary(
  state: TaxCalculatorState,
  value: string,
): TaxCalculatorState {
  return {
    ...state,
    salary: extractNumbers(value),
    error: "",
  };
}

export function setMonthly(
  state: TaxCalculatorState,
  monthly: boolean,
): TaxCalculatorState {
  return { ...state, monthly };
}

export function setIncludeInsurance(
  state: TaxCalculatorState,
  includeInsurance: boolean,
): TaxCalculatorState {
  return { ...state, includeInsurance };
}

export function adjustSalary(
  state: TaxCalculatorState,
  delta: number,
): TaxCalculatorState {
  const nextValue = (Number(state.salary) || 0) + delta;
  if (nextValue < 0) {
    return { ...state, error: "금액은 0원 미만이 될 수 없습니다." };
  }

  return { ...state, salary: String(nextValue), error: "" };
}

export function submitTaxCalculation(
  state: TaxCalculatorState,
): TaxCalculatorState {
  if (!state.salary) {
    return { ...state, result: null, error: "금액을 입력하세요." };
  }

  const grossSalary = Number(state.salary);
  if (Number.isNaN(grossSalary) || grossSalary <= 0) {
    return { ...state, result: null, error: "유효한 금액을 입력하세요." };
  }

  try {
    return {
      ...state,
      result: calculateTax({
        grossSalary,
        monthly: state.monthly,
        includeInsurance: state.includeInsurance,
      }),
      error: "",
    };
  } catch {
    return { ...state, result: null, error: "계산 중 오류가 발생했습니다." };
  }
}
