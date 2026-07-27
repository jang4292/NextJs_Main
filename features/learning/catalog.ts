export type LearningCatalogItem = {
  id: "blog" | "idioms" | "vocabulary";
  title: string;
  eyebrow: string;
  description: string;
  href: string;
  featured: boolean;
  updatedAt: string;
};

export const learningCatalog: LearningCatalogItem[] = [
  {
    id: "blog",
    title: "Development Blog",
    eyebrow: "Writing",
    description: "프로젝트 구조와 구현 과정을 정리한 개발 기록입니다.",
    href: "/learn/blog",
    featured: true,
    updatedAt: "2026-07-27",
  },
  {
    id: "idioms",
    title: "사자성어 학습",
    eyebrow: "Korean",
    description: "뜻, 한자, 예문으로 기본 사자성어를 탐색합니다.",
    href: "/learn/idioms",
    featured: true,
    updatedAt: "2026-07-27",
  },
  {
    id: "vocabulary",
    title: "English Vocabulary",
    eyebrow: "English",
    description: "기초 영어 단어 50개의 뜻과 예문, 발음을 확인합니다.",
    href: "/learn/vocabulary",
    featured: true,
    updatedAt: "2026-07-27",
  },
];

export function getFeaturedLearningItems(): LearningCatalogItem[] {
  return learningCatalog.filter((item) => item.featured);
}
