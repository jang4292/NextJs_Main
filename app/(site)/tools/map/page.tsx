import type { Metadata } from "next";
import { BackLink } from "@/components/navigation/BackLink";
import { PageShell } from "@/components/layout/PageShell";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { MapExplorer } from "@/features/maps/presentation/MapExplorer";

export const metadata: Metadata = {
  title: "Map Explorer",
  description:
    "네이버와 카카오 지도를 비교하며 장소를 검색하고 상세 정보를 확인합니다.",
};

export default function MapPage() {
  return (
    <PageShell size="content">
      <BackLink href="/tools">Back to tools</BackLink>
      <SectionHeader
        eyebrow="Utility"
        title="Map Explorer"
        description="장소를 검색하고, 결과를 선택해 지도 중심과 상세 정보를 확인할 수 있습니다."
      />
      <MapExplorer />
    </PageShell>
  );
}
