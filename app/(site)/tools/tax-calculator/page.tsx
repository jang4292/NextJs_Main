import type { Metadata } from "next";
import { PageShell } from "@/components/layout/PageShell";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { TaxCalculator } from "@/features/tax-calculator/presentation/TaxCalculator";

export const metadata: Metadata = {
  title: "Tax Calculator",
  description: "2025 한국 세율 기준 세후 급여 계산기",
};

export default function TaxCalculatorPage() {
  return (
    <PageShell size="narrow">
      <SectionHeader
        eyebrow="Utility"
        title="2025 세금 계산기"
        description="월급 또는 연봉을 입력해 소득세, 4대보험, 실수령액을 계산합니다."
      />
      <TaxCalculator />
    </PageShell>
  );
}
