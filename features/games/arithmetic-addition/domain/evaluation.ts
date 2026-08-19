import type { EvaluationMessage, LearningEvaluation } from "./arithmetic.types";

export function calculateStarRating(firstTryCorrectCount: number): 1 | 2 | 3 {
  if (firstTryCorrectCount >= 9) return 3;
  if (firstTryCorrectCount >= 7) return 2;
  return 1;
}

export function evaluateLearningSession(
  firstTryAccuracy: number,
  averageElapsedMs: number,
): EvaluationMessage {
  const level = getEvaluationLevel(firstTryAccuracy, averageElapsedMs);

  switch (level) {
    case "very-stable":
      return {
        level,
        title: "매우 안정적이에요",
        message: "처음부터 정확하고 빠르게 풀었어요. 덧셈 감각이 좋아요.",
      };
    case "doing-well":
      return {
        level,
        title: "잘하고 있어요",
        message: "대부분의 문제를 처음에 맞혔어요. 지금 흐름을 이어가요.",
      };
    case "needs-practice":
      return {
        level,
        title: "추가 연습이 좋아요",
        message: "몇 문제는 다시 풀며 익혔어요. 조금만 더 반복해 볼까요?",
      };
    case "needs-basics":
      return {
        level,
        title: "기초부터 차근차근",
        message: "끝까지 해낸 것이 중요해요. 작은 수부터 다시 연습해요.",
      };
  }
}

function getEvaluationLevel(
  firstTryAccuracy: number,
  averageElapsedMs: number,
): LearningEvaluation {
  if (firstTryAccuracy >= 0.9 && averageElapsedMs <= 5000) {
    return "very-stable";
  }

  if (firstTryAccuracy >= 0.8) {
    return "doing-well";
  }

  if (firstTryAccuracy >= 0.6) {
    return "needs-practice";
  }

  return "needs-basics";
}
