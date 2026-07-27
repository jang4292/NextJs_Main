import type { Metadata } from "next";
import { FeatureCard } from "@/components/cards/FeatureCard";
import { ContentGrid } from "@/components/layout/ContentGrid";
import { PageShell } from "@/components/layout/PageShell";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { gameCatalog } from "@/features/games/catalog";

export const metadata: Metadata = {
  title: "Games",
  description: "브라우저에서 즐기는 미니게임 모음",
};

export default function GamesPage() {
  return (
    <PageShell>
      <SectionHeader
        eyebrow="Games"
        title="게임 허브"
        description="카드, 숫자, 보드 기반 미니게임을 한 화면에서 선택합니다."
      />
      <ContentGrid>
        {gameCatalog.map((game) => (
          <FeatureCard
            key={game.slug}
            eyebrow="Mini Game"
            title={game.title}
            description={game.description}
            href={game.href}
            cta="Play"
          />
        ))}
      </ContentGrid>
    </PageShell>
  );
}
