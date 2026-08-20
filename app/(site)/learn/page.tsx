import type { Metadata } from "next";
import { FeatureCard } from "@/components/cards/FeatureCard";
import { ContentGrid } from "@/components/layout/ContentGrid";
import { PageShell } from "@/components/layout/PageShell";
import { SectionHeader } from "@/components/layout/SectionHeader";
import {
  getLearningItemsByCategory,
  learningCategoryLabels,
  learningCategoryOrder,
} from "@/features/learning/catalog";

export const metadata: Metadata = {
  title: "Learn",
  description: "블로그와 학습 콘텐츠 허브",
};

export default function LearnPage() {
  return (
    <PageShell>
      <SectionHeader
        eyebrow="Learn"
        title="학습 허브"
        description="개발 기록, 사자성어, 영어 단어 콘텐츠를 탐색 중심으로 정리했습니다."
      />
      <div className="space-y-8">
        {learningCategoryOrder.map((category) => {
          const items = getLearningItemsByCategory(category);

          return (
            <section key={category} aria-labelledby={`${category}-learning`}>
              <h2
                id={`${category}-learning`}
                className="mb-3 text-xl font-bold text-neutral-950"
              >
                {learningCategoryLabels[category]}
              </h2>
              <ContentGrid>
                {items.map((item) => (
                  <FeatureCard
                    key={item.id}
                    eyebrow={item.eyebrow}
                    title={item.title}
                    description={item.description}
                    href={item.href}
                    cta="Browse"
                  />
                ))}
              </ContentGrid>
            </section>
          );
        })}
      </div>
    </PageShell>
  );
}
