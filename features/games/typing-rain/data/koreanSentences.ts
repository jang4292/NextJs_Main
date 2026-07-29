import type { TypingContent } from "../domain/typing.types";

const easySentences = [
  "오늘도 잘했어요.",
  "바람이 시원해요.",
  "하늘이 맑아요.",
  "천천히 입력해요.",
  "기차가 지나가요.",
  "별빛이 반짝여요.",
  "친구와 걸어요.",
  "책상이 깨끗해요.",
  "노래를 불러요.",
  "작은 배가 떠요.",
  "우산을 챙겨요.",
  "달빛이 밝아요.",
] as const;

const normalSentences = [
  "학교 앞 길은 조용했어요.",
  "따뜻한 차를 천천히 마셔요.",
  "구름 사이로 햇살이 보여요.",
  "오늘 연습은 여기까지예요.",
  "작은 실수가 좋은 연습이 돼요.",
  "비가 와도 마음은 가벼워요.",
  "새 문장을 또박또박 입력해요.",
  "고요한 바다 위로 배가 지나가요.",
  "아침 공기가 상쾌하게 느껴져요.",
  "집중하면 속도도 함께 좋아져요.",
  "연필 끝에 생각을 모아요.",
  "문장 속 공백도 정확히 봐요.",
] as const;

const hardSentences = [
  "복합 모음도 차분하게 입력해 봐요.",
  "조합이 끝난 뒤에 정답을 확인해요.",
  "빠른 입력보다 정확한 리듬이 먼저예요.",
  "문장부호까지 놓치지 않고 마무리해요.",
  "모바일 키보드에서도 포커스를 유지해요.",
  "받침이 있는 글자는 마지막까지 확인해요.",
  "한영 전환 뒤에도 입력 흐름을 지켜요.",
  "일시정지 중에는 시간이 흐르지 않아요.",
  "오답 위치를 기억하면 복습이 쉬워져요.",
  "화면 아래에 닿기 전에 문장을 완성해요.",
  "긴 문장은 더 넓은 카드에 표시해요.",
  "게임 결과에서 자주 틀린 문장을 봐요.",
] as const;

export const koreanSentences: TypingContent[] = [
  ...toContent(easySentences, "easy", "sentence-basic"),
  ...toContent(normalSentences, "normal", "sentence-practice"),
  ...toContent(hardSentences, "hard", "sentence-challenge"),
];

function toContent(
  sentences: readonly string[],
  difficulty: TypingContent["difficulty"],
  category: string,
): TypingContent[] {
  return sentences.map((text, index) => ({
    id: `ko-short-sentence-${difficulty}-${String(index + 1).padStart(3, "0")}`,
    text,
    language: "ko",
    type: "short-sentence",
    difficulty,
    category,
    tags: ["한글", "short-sentence", difficulty],
    enabled: true,
  }));
}
