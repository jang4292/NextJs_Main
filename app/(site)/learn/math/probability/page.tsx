import type { Metadata } from "next";
import { PageShell } from "@/components/layout/PageShell";
import { ProbabilityLearning } from "@/features/math-learning/probability/presentation/ProbabilityLearning";

export const metadata: Metadata = {
  title: "Probability Basic",
  description:
    "동전, 주사위, 색 공 상황에서 전체 경우와 유리한 경우를 세는 기초 학습",
};

export default function ProbabilityPage() {
  return (
    <PageShell size="wide">
      <ProbabilityLearning />
    </PageShell>
  );
}
