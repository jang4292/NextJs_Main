import type { Metadata } from "next";
import { PageShell } from "@/components/layout/PageShell";
import { StatisticsLearning } from "@/features/math-learning/statistics/presentation/StatisticsLearning";

export const metadata: Metadata = {
  title: "Statistics Basic",
  description: "숫자 자료에서 합계, 최댓값, 최솟값, 평균, 중앙값, 최빈값을 찾는 기초 학습",
};

export default function StatisticsPage() {
  return (
    <PageShell size="wide">
      <StatisticsLearning />
    </PageShell>
  );
}
