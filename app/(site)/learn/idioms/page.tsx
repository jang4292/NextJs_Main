import type { Metadata } from "next";
import { PageShell } from "@/components/layout/PageShell";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { IdiomsBrowser } from "@/features/idioms/presentation/IdiomsBrowser";

export const metadata: Metadata = {
  title: "사자성어 학습",
  description: "사자성어의 뜻과 사용 예문을 쉽게 확인할 수 있는 학습 페이지",
};

export default function IdiomsPage() {
  return (
    <PageShell>
      <SectionHeader
        eyebrow="Korean"
        title="사자성어 학습"
        description="일상과 업무에서 활용할 수 있는 사자성어의 뜻과 예문을 확인합니다."
      />
      <IdiomsBrowser />
    </PageShell>
  );
}
