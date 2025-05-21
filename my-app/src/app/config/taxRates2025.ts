// 2025년도 대한민국 기준 세율 설정 파일
// 소득세 누진세율 구간, 지방소득세율, 사회보험 요율 정의

export const TaxRates2025 = {
  // 소득세 누진세율 구간 설정
  incomeTaxBrackets: [
    { min: 0, max: 12000000, rate: 0.06, deduction: 0 },
    { min: 12000000, max: 46000000, rate: 0.15, deduction: 1080000 },
    { min: 46000000, max: 88000000, rate: 0.24, deduction: 5220000 },
    { min: 88000000, max: 150000000, rate: 0.35, deduction: 14900000 },
    { min: 150000000, max: 300000000, rate: 0.38, deduction: 19400000 },
    { min: 300000000, max: 500000000, rate: 0.40, deduction: 25400000 },
    { min: 500000000, max: Infinity, rate: 0.45, deduction: 35400000 },
  ],
  // 지방소득세율: 소득세의 10%
  localIncomeTaxRate: 0.1,

  // 사회보험 요율 (근로자 부담분)
  socialInsuranceRates: {
    nationalPension: 0.045,
    healthInsurance: 0.03545,
    employmentInsurance: 0.009,
  },
};