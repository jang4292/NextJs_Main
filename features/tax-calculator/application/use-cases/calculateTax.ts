import { TaxRates2025 } from "../../domain/data/taxRates2025";
import type { TaxInput, TaxResult } from "../../domain/entities/Tax";

export function calculateTax({
  grossSalary,
  bonus = 0,
  includeInsurance = true,
  monthly = false,
}: TaxInput): TaxResult {
  const annualSalary = monthly ? grossSalary * 12 : grossSalary;

  if (annualSalary < 0) {
    throw new Error("급여는 0 이상이어야 합니다.");
  }

  const totalIncome = annualSalary + bonus;
  const bracket = TaxRates2025.incomeTaxBrackets.find(
    (b) => totalIncome >= b.min && totalIncome < b.max,
  );

  if (!bracket) {
    throw new Error(
      `적절한 세율 구간을 찾을 수 없습니다. 입력 금액: ${totalIncome}`,
    );
  }

  const incomeTax = totalIncome * bracket.rate - bracket.deduction;
  const localIncomeTax = incomeTax * TaxRates2025.localIncomeTaxRate;
  const nationalPension = includeInsurance
    ? annualSalary * TaxRates2025.socialInsuranceRates.nationalPension
    : 0;
  const healthInsurance = includeInsurance
    ? annualSalary * TaxRates2025.socialInsuranceRates.healthInsurance
    : 0;
  const employmentInsurance = includeInsurance
    ? annualSalary * TaxRates2025.socialInsuranceRates.employmentInsurance
    : 0;
  const totalDeductions =
    incomeTax +
    localIncomeTax +
    nationalPension +
    healthInsurance +
    employmentInsurance;
  const netSalary = annualSalary - totalDeductions;

  return {
    incomeTax: Math.floor(incomeTax),
    localIncomeTax: Math.floor(localIncomeTax),
    nationalPension: Math.floor(nationalPension),
    healthInsurance: Math.floor(healthInsurance),
    employmentInsurance: Math.floor(employmentInsurance),
    totalDeductions: Math.floor(totalDeductions),
    netSalary: Math.floor(netSalary),
  };
}
