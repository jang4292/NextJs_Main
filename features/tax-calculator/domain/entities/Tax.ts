export interface TaxInput {
  grossSalary: number;
  bonus?: number;
  includeInsurance?: boolean;
  monthly?: boolean;
}

export interface TaxResult {
  incomeTax: number;
  localIncomeTax: number;
  nationalPension: number;
  healthInsurance: number;
  employmentInsurance: number;
  totalDeductions: number;
  netSalary: number;
}
