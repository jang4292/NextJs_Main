"use client";

import { useState } from "react";
import {
  adjustSalary,
  initialTaxCalculatorState,
  setIncludeInsurance,
  setMonthly,
  submitTaxCalculation,
  updateSalary,
} from "../../application/use-cases/taxCalculatorViewModel";

export function useTaxCalculatorViewModel() {
  const [state, setState] = useState(initialTaxCalculatorState);

  return {
    ...state,
    updateSalary: (value: string) =>
      setState((current) => updateSalary(current, value)),
    adjustSalary: (delta: number) =>
      setState((current) => adjustSalary(current, delta)),
    setMonthly: (monthly: boolean) =>
      setState((current) => setMonthly(current, monthly)),
    setIncludeInsurance: (includeInsurance: boolean) =>
      setState((current) => setIncludeInsurance(current, includeInsurance)),
    submit: () => setState((current) => submitTaxCalculation(current)),
  };
}
