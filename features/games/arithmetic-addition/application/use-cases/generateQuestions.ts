import type {
  ArithmeticQuestion,
  Difficulty,
} from "../../domain/arithmetic.types";
import { classifyAdditionDifficulty } from "../../domain/difficulty";
import { shuffle, type Rng } from "./shuffle";

export interface GenerateQuestionsOptions {
  totalQuestions?: number;
  difficultyDistribution?: Partial<Record<Difficulty, number>>;
  rng?: Rng;
}

const DEFAULT_TOTAL_QUESTIONS = 10;

const DEFAULT_DISTRIBUTION: Record<Difficulty, number> = {
  easy: 3,
  medium: 4,
  hard: 3,
};

const DIFFICULTY_ORDER: Difficulty[] = ["easy", "medium", "hard"];

export function generateQuestions(
  options: GenerateQuestionsOptions = {},
): ArithmeticQuestion[] {
  const totalQuestions = options.totalQuestions ?? DEFAULT_TOTAL_QUESTIONS;
  const rng = options.rng ?? Math.random;
  const distribution = {
    ...DEFAULT_DISTRIBUTION,
    ...options.difficultyDistribution,
  };
  const candidates = shuffle(createAdditionCandidates(), rng);
  const selected: ArithmeticQuestion[] = [];
  const selectedKeys = new Set<string>();

  for (const difficulty of DIFFICULTY_ORDER) {
    const desiredCount = distribution[difficulty] ?? 0;
    const pool = candidates.filter(
      (question) =>
        question.difficulty === difficulty && !selectedKeys.has(question.id),
    );

    for (const question of pool.slice(0, desiredCount)) {
      selected.push(question);
      selectedKeys.add(question.id);
    }
  }

  if (selected.length < totalQuestions) {
    for (const question of candidates) {
      if (selected.length >= totalQuestions) break;
      if (selectedKeys.has(question.id)) continue;

      selected.push(question);
      selectedKeys.add(question.id);
    }
  }

  return shuffle(selected.slice(0, totalQuestions), rng);
}

function createAdditionCandidates(): ArithmeticQuestion[] {
  const questions: ArithmeticQuestion[] = [];

  for (let leftOperand = 1; leftOperand <= 9; leftOperand += 1) {
    for (let rightOperand = 1; rightOperand <= 9; rightOperand += 1) {
      questions.push({
        id: `${leftOperand}-${rightOperand}-addition`,
        leftOperand,
        rightOperand,
        operator: "addition",
        answer: leftOperand + rightOperand,
        difficulty: classifyAdditionDifficulty(leftOperand, rightOperand),
        stageId: "addition-mixed",
      });
    }
  }

  return questions;
}
