import type { Metadata } from "next";
import { PageShell } from "@/components/layout/PageShell";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { MusicStudio } from "@/features/music/presentation/MusicStudio";
import type { MusicStudioMode } from "@/features/music";

export const metadata: Metadata = {
  title: "Music Studio",
  description: "날짜별 음원 리스트와 DJ 큐를 통합한 음악 도구",
};

export default async function MusicStudioPage({
  searchParams,
}: {
  searchParams: Promise<{ mode?: string }>;
}) {
  const { mode } = await searchParams;
  const initialMode: MusicStudioMode = mode === "dj" ? "dj" : "playlist";

  return (
    <PageShell size="content">
      <SectionHeader
        eyebrow="Music Studio"
        title="음악 스튜디오"
        description="날짜별 스윙 재즈 플레이리스트와 URL/로컬 파일을 다루는 DJ 큐를 통합했습니다."
      />
      <MusicStudio initialMode={initialMode} />
    </PageShell>
  );
}
