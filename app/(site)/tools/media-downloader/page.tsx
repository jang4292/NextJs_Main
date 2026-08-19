import type { Metadata } from "next";
import { PageShell } from "@/components/layout/PageShell";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { MediaDownloader } from "@/features/media-downloader/presentation/MediaDownloader";

export const metadata: Metadata = {
  title: "Media Downloader",
  description: "공개 YouTube 단일 영상을 분석하고 로컬에서 다운로드하는 도구",
};

export default function MediaDownloaderPage() {
  return (
    <PageShell size="content">
      <SectionHeader
        eyebrow="Utility"
        title="Media Downloader"
        description="공개 YouTube 단일 영상의 메타데이터를 확인하고 Video 또는 Audio 파일로 저장합니다."
      />
      <MediaDownloader />
    </PageShell>
  );
}
