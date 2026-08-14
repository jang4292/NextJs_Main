import type { Metadata } from "next";
import { PageShell } from "@/components/layout/PageShell";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { MusicStudio } from "@/features/music/presentation/MusicStudio";
import { resolveMusicStudioMode } from "@/features/music";

export const metadata: Metadata = {
  title: "Music Studio",
  description: "DJ 히스토리, 커스텀 큐, JSON 소스 플레이어를 통합한 음악 도구",
};

export default async function MusicStudioPage({
  searchParams,
}: {
  searchParams: Promise<{ mode?: string }>;
}) {
  const { mode } = await searchParams;
  const initialMode = resolveMusicStudioMode(mode);

  return (
    <PageShell size="content">
      <SectionHeader
        eyebrow="Music Studio"
        title="음악 스튜디오"
        description="날짜별 DJ 히스토리, URL/로컬 파일 커스텀 큐, JSON 소스 플레이어를 구분했습니다."
      />
      <MusicStudio initialMode={initialMode} />
    </PageShell>
  );
}
