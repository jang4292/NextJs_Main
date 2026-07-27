import type { Metadata } from "next";
import { FeatureCard } from "@/components/cards/FeatureCard";
import { ContentGrid } from "@/components/layout/ContentGrid";
import { PageShell } from "@/components/layout/PageShell";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { toolCatalog } from "@/features/tools/catalog";

export const metadata: Metadata = {
  title: "Tools",
  description: "음악, 게임, 계산기를 모은 도구 허브",
};

export default function ToolsPage() {
  return (
    <PageShell>
      <SectionHeader
        eyebrow="Tools"
        title="도구 허브"
        description="바로 실행할 수 있는 음악 스튜디오, 미니게임, 계산 도구를 한 곳에 모았습니다."
      />
      <ContentGrid>
        {toolCatalog.map((tool) => (
          <FeatureCard
            key={tool.id}
            eyebrow={tool.eyebrow}
            title={tool.title}
            description={tool.description}
            href={tool.href}
            cta="Open"
          />
        ))}
      </ContentGrid>
    </PageShell>
  );
}
