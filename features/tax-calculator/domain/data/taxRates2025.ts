// 2025년도 대한민국 기준 세율 설정 파일
// 소득세 누진세율 구간, 지방소득세율, 사회보험 요율 정의

export const TaxRates2025 = {
  incomeTaxBrackets: [
    { min: 0, max: 12_000_000, rate: 0.06, deduction: 0 },
    { min: 12_000_000, max: 46_000_000, rate: 0.15, deduction: 1_080_000 },
    { min: 46_000_000, max: 88_000_000, rate: 0.24, deduction: 5_220_000 },
    { min: 88_000_000, max: 150_000_000, rate: 0.35, deduction: 14_900_000 },
    {
      min: 150_000_000,
      max: 300_000_000,
      rate: 0.38,
      deduction: 19_400_000,
    },
    {
      min: 300_000_000,
      max: 500_000_000,
      rate: 0.4,
      deduction: 25_400_000,
    },
    { min: 500_000_000, max: Infinity, rate: 0.45, deduction: 35_400_000 },
  ],
  localIncomeTaxRate: 0.1,
  socialInsuranceRates: {
    nationalPension: 0.045,
    healthInsurance: 0.03545,
    employmentInsurance: 0.009,
  },
} as const;
