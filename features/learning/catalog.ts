export type LearningCatalogItem = {
  id:
    | "math"
    | "blog"
    | "idioms"
    | "vocabulary"
    | "japanese-vocabulary"
    | "chinese-vocabulary";
  title: string;
  eyebrow: string;
  description: string;
  href: string;
  featured: boolean;
  updatedAt: string;
};

export const learningCatalog: LearningCatalogItem[] = [
  {
    id: "math",
    title: "Math Learning",
    eyebrow: "Math",
    description:
      "사칙연산, 수열, 통계, 확률 기초를 시작점으로 수와 연산, 대수, 함수, 기하로 확장하는 수학 학습 허브입니다.",
    href: "/learn/math",
    featured: true,
    updatedAt: "2026-08-10",
  },
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
  {
    id: "japanese-vocabulary",
    title: "일본어 기초 단어",
    eyebrow: "Japanese",
    description: "N5 수준 기초 일본어 50개의 뜻과 예문, 발음을 확인합니다.",
    href: "/learn/japanese-vocabulary",
    featured: true,
    updatedAt: "2026-08-01",
  },
  {
    id: "chinese-vocabulary",
    title: "중국어 기초 단어",
    eyebrow: "Chinese",
    description:
      "기초 중국어 50개의 간체자, 병음, 뜻, 예문, 발음을 확인합니다.",
    href: "/learn/chinese-vocabulary",
    featured: true,
    updatedAt: "2026-08-01",
  },
];

export function getFeaturedLearningItems(): LearningCatalogItem[] {
  return learningCatalog.filter((item) => item.featured);
}
