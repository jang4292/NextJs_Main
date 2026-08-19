export type ToolStatus = "ready" | "expanded" | "legacy-compatible";

export type ToolCatalogItem = {
  id: "music" | "games" | "tax-calculator" | "media-downloader";
  title: string;
  eyebrow: string;
  description: string;
  href: string;
  category: "creative" | "play" | "utility";
  status: ToolStatus;
  featured: boolean;
  updatedAt: string;
};

export const toolCatalog: ToolCatalogItem[] = [
  {
    id: "media-downloader",
    title: "Media Downloader",
    eyebrow: "Utility",
    description:
      "공개 YouTube 단일 영상을 분석하고 Video/Audio 파일로 저장합니다.",
    href: "/tools/media-downloader",
    category: "utility",
    status: "ready",
    featured: true,
    updatedAt: "2026-08-10",
  },
  {
    id: "music",
    title: "Music Studio",
    eyebrow: "Audio",
    description: "DJ 히스토리, 커스텀 큐, JSON 소스 플레이어를 다룹니다.",
    href: "/tools/music",
    category: "creative",
    status: "expanded",
    featured: true,
    updatedAt: "2026-07-27",
  },
  {
    id: "games",
    title: "Games",
    eyebrow: "Play",
    description: "카드, 퍼즐, 보드 기반 미니게임을 바로 실행합니다.",
    href: "/tools/games",
    category: "play",
    status: "ready",
    featured: true,
    updatedAt: "2026-07-27",
  },
  {
    id: "tax-calculator",
    title: "Tax Calculator",
    eyebrow: "Utility",
    description: "2025년 한국 세율 기준 월급/연봉 실수령액을 계산합니다.",
    href: "/tools/tax-calculator",
    category: "utility",
    status: "legacy-compatible",
    featured: true,
    updatedAt: "2026-07-27",
  },
];

export function getFeaturedTools(): ToolCatalogItem[] {
  return toolCatalog.filter((tool) => tool.featured);
}
