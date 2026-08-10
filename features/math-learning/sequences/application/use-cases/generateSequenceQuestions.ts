import type {
  SequenceDirection,
  SequenceDifficulty,
  SequenceQuestion,
  SequenceStage,
} from "../../domain/sequence.types";
import { SEQUENCE_STAGE } from "../../domain/stages";

type Rng = () => number;

const DISPLAY_VALUE_COUNT = 4;
const MIN_STEP = 1;
const MAX_STEP = 5;
const INCREASE_START_MAX = 20;
const DECREASE_ANSWER_MAX = 20;

export function generateSequenceQuestions(
  stage: SequenceStage = SEQUENCE_STAGE,
  rng: Rng = Math.random,
): SequenceQuestion[] {
  const increaseQuestions = shuffle(
    createCandidates(stage, "increase"),
    rng,
  );
  const decreaseQuestions = shuffle(
    createCandidates(stage, "decrease"),
    rng,
  );
  const increaseCount = Math.ceil(stage.questionCount / 2);
  const decreaseCount = stage.questionCount - increaseCount;

  return shuffle(
    [
      ...increaseQuestions.slice(0, increaseCount),
      ...decreaseQuestions.slice(0, decreaseCount),
    ],
    rng,
  );
}

function createCandidates(
  stage: SequenceStage,
  direction: SequenceDirection,
): SequenceQuestion[] {
  const questions: SequenceQuestion[] = [];

  for (let step = MIN_STEP; step <= MAX_STEP; step += 1) {
    if (direction === "increase") {
      for (let start = 1; start <= INCREASE_START_MAX; start += 1) {
        questions.push(createQuestion(stage, direction, start, step));
      }
      continue;
    }

    for (let answer = 1; answer <= DECREASE_ANSWER_MAX; answer += 1) {
      const start = answer + step * DISPLAY_VALUE_COUNT;
      questions.push(createQuestion(stage, direction, start, step));
    }
  }

  return questions;
}

function createQuestion(
  stage: SequenceStage,
  direction: SequenceDirection,
  start: number,
  step: number,
): SequenceQuestion {
  const values = Array.from({ length: DISPLAY_VALUE_COUNT }, (_, index) =>
    direction === "increase" ? start + step * index : start - step * index,
  );
  const answer =
    direction === "increase"
      ? start + step * DISPLAY_VALUE_COUNT
      : start - step * DISPLAY_VALUE_COUNT;

  return {
    id: `${stage.id}-${direction}-${step}-${start}`,
    values,
    answer,
    step,
    direction,
    difficulty: classifyDifficulty(step),
    stageId: stage.id,
  };
}

function classifyDifficulty(step: number): SequenceDifficulty {
  return step <= 2 ? "easy" : "medium";
}

function shuffle<T>(items: readonly T[], rng: Rng): T[] {
  const shuffled = [...items];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(rng() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [
      shuffled[swapIndex],
      shuffled[index],
    ];
  }

  return shuffled;
}
