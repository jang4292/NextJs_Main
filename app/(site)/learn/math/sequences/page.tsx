import type { Metadata } from "next";
import { PageShell } from "@/components/layout/PageShell";
import { SequenceLearning } from "@/features/math-learning/sequences/presentation/SequenceLearning";

export const metadata: Metadata = {
  title: "Sequences Basic",
  description: "일정한 증가와 감소 수열에서 다음 수를 찾는 기초 학습",
};

export default function SequencesPage() {
  return (
    <PageShell size="wide">
      <SequenceLearning />
    </PageShell>
  );
}
