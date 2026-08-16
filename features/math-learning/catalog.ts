export const ARITHMETIC_LEARNING_HREF = "/tools/games/arithmetic-addition";
export const SEQUENCES_LEARNING_HREF = "/learn/math/sequences";
export const STATISTICS_LEARNING_HREF = "/learn/math/statistics";
export const PROBABILITY_LEARNING_HREF = "/learn/math/probability";

export type MathSubjectId =
  | "arithmetic"
  | "sequences"
  | "statistics"
  | "probability"
  | "algebra"
  | "functions"
  | "geometry"
  | "trigonometry";

export type MathSubjectStatus = "available" | "coming-soon";

export interface MathSubjectItem {
  id: MathSubjectId;
  title: string;
  eyebrow: string;
  description: string;
  status: MathSubjectStatus;
  statusLabel: string;
  href?: string;
  topics: string[];
}

export const mathSubjectCatalog: MathSubjectItem[] = [
  {
    id: "arithmetic",
    title: "수와 연산",
    eyebrow: "Number & Arithmetic",
    description:
      "덧셈, 뺄셈, 곱셈, 나눗셈을 단계별로 풀며 기초 연산 감각을 쌓습니다.",
    status: "available",
    statusLabel: "학습 가능",
    href: ARITHMETIC_LEARNING_HREF,
    topics: [
      "덧셈 6단계",
      "뺄셈 5단계",
      "곱셈 3단계",
      "나눗셈 1단계",
      "오답 복습",
      "학습 기록",
    ],
  },
  {
    id: "sequences",
    title: "수열",
    eyebrow: "Sequences",
    description:
      "일정하게 커지거나 작아지는 숫자 패턴을 보고 다음 수를 찾아요.",
    status: "available",
    statusLabel: "학습 가능",
    href: SEQUENCES_LEARNING_HREF,
    topics: ["다음 수 찾기", "일정한 증가", "일정한 감소", "패턴 추론"],
  },
  {
    id: "statistics",
    title: "통계",
    eyebrow: "Statistics",
    description:
      "숫자 자료를 읽고 합계, 최댓값, 최솟값, 평균, 중앙값, 최빈값을 찾아요.",
    status: "available",
    statusLabel: "학습 가능",
    href: STATISTICS_LEARNING_HREF,
    topics: ["합계", "최댓값", "최솟값", "평균", "중앙값", "최빈값"],
  },
  {
    id: "probability",
    title: "확률",
    eyebrow: "Probability",
    description:
      "동전, 주사위, 색 공 상황에서 전체 경우와 유리한 경우를 세어 봅니다.",
    status: "available",
    statusLabel: "학습 가능",
    href: PROBABILITY_LEARNING_HREF,
    topics: ["전체 경우 수", "유리한 경우 수", "동전", "주사위", "색 공 뽑기"],
  },
  {
    id: "algebra",
    title: "대수",
    eyebrow: "Algebra",
    description: "빈칸 문제에서 변수와 간단한 방정식으로 이어지는 흐름입니다.",
    status: "coming-soon",
    statusLabel: "준비 중",
    topics: ["빈칸", "변수", "문자와 식", "방정식"],
  },
  {
    id: "functions",
    title: "함수",
    eyebrow: "Functions",
    description: "좌표, 입력과 출력, 일차함수로 확장되는 학습 영역입니다.",
    status: "coming-soon",
    statusLabel: "준비 중",
    topics: ["좌표", "함수 개념", "일차함수", "이차함수"],
  },
  {
    id: "geometry",
    title: "기하",
    eyebrow: "Geometry",
    description:
      "각도와 삼각형을 바탕으로 직각삼각형과 피타고라스로 이어집니다.",
    status: "coming-soon",
    statusLabel: "준비 중",
    topics: ["각도", "삼각형", "직각삼각형", "피타고라스"],
  },
  {
    id: "trigonometry",
    title: "삼각법",
    eyebrow: "Trigonometry",
    description: "비율과 직각삼각형을 충분히 다진 뒤 삼각비로 확장합니다.",
    status: "coming-soon",
    statusLabel: "준비 중",
    topics: ["삼각비", "sin", "cos", "tan"],
  },
];

export function getAvailableMathSubjects(): MathSubjectItem[] {
  return mathSubjectCatalog.filter((subject) => subject.status === "available");
}
