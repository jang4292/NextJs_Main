import type {
  ProbabilityDifficulty,
  ProbabilityQuestion,
  ProbabilityQuestionKind,
  ProbabilityScenarioKind,
  ProbabilityStage,
} from "../../domain/probability.types";
import { PROBABILITY_STAGE } from "../../domain/stages";

type Rng = () => number;

interface ProbabilityQuestionSpec {
  scenarioKind: ProbabilityScenarioKind;
  scenarioTitle: string;
  situation: string;
  questionText: string;
  outcomes: string[];
  targetOutcomeLabels: string[];
  explanation: string;
  kind: ProbabilityQuestionKind;
}

const QUESTION_KINDS: ProbabilityQuestionKind[] = [
  "total-outcomes",
  "favorable-outcomes",
];

const SCENARIO_KINDS: ProbabilityScenarioKind[] = ["coin", "die", "color-pick"];

const QUESTION_SPECS: ProbabilityQuestionSpec[] = [
  {
    scenarioKind: "coin",
    scenarioTitle: "동전 한 개",
    situation: "동전을 한 번 던질 때 나올 수 있는 결과를 살펴봐요.",
    questionText: "나올 수 있는 결과는 모두 몇 가지인가요?",
    outcomes: ["앞면", "뒷면"],
    targetOutcomeLabels: [],
    explanation: "동전은 앞면 또는 뒷면, 모두 2가지 결과가 있어요.",
    kind: "total-outcomes",
  },
  {
    scenarioKind: "coin",
    scenarioTitle: "동전 한 개",
    situation: "동전을 한 번 던질 때 앞면이 나오는 경우를 찾아봐요.",
    questionText: "앞면이 나오는 경우는 몇 가지인가요?",
    outcomes: ["앞면", "뒷면"],
    targetOutcomeLabels: ["앞면"],
    explanation: "앞면은 표시된 결과 중 1가지예요.",
    kind: "favorable-outcomes",
  },
  {
    scenarioKind: "coin",
    scenarioTitle: "동전 두 번",
    situation: "동전을 두 번 던질 때 앞면과 뒷면의 순서를 구분해요.",
    questionText: "나올 수 있는 결과는 모두 몇 가지인가요?",
    outcomes: ["앞-앞", "앞-뒤", "뒤-앞", "뒤-뒤"],
    targetOutcomeLabels: [],
    explanation: "두 번 던지면 앞-앞, 앞-뒤, 뒤-앞, 뒤-뒤로 4가지예요.",
    kind: "total-outcomes",
  },
  {
    scenarioKind: "coin",
    scenarioTitle: "동전 두 번",
    situation: "동전을 두 번 던질 때 앞면이 한 번만 나오는 결과를 찾아요.",
    questionText: "앞면이 한 번만 나오는 경우는 몇 가지인가요?",
    outcomes: ["앞-앞", "앞-뒤", "뒤-앞", "뒤-뒤"],
    targetOutcomeLabels: ["앞-뒤", "뒤-앞"],
    explanation: "앞-뒤와 뒤-앞, 모두 2가지가 조건에 맞아요.",
    kind: "favorable-outcomes",
  },
  {
    scenarioKind: "die",
    scenarioTitle: "주사위 한 개",
    situation: "주사위를 한 번 굴릴 때 윗면에 나올 수 있는 눈을 살펴봐요.",
    questionText: "나올 수 있는 결과는 모두 몇 가지인가요?",
    outcomes: ["1", "2", "3", "4", "5", "6"],
    targetOutcomeLabels: [],
    explanation: "주사위 눈은 1부터 6까지 모두 6가지예요.",
    kind: "total-outcomes",
  },
  {
    scenarioKind: "die",
    scenarioTitle: "주사위 한 개",
    situation: "주사위를 한 번 굴릴 때 짝수 눈을 찾아봐요.",
    questionText: "짝수 눈이 나오는 경우는 몇 가지인가요?",
    outcomes: ["1", "2", "3", "4", "5", "6"],
    targetOutcomeLabels: ["2", "4", "6"],
    explanation: "짝수 눈은 2, 4, 6으로 3가지예요.",
    kind: "favorable-outcomes",
  },
  {
    scenarioKind: "die",
    scenarioTitle: "주사위 한 개",
    situation: "주사위를 한 번 굴릴 때 5보다 큰 눈을 찾아봐요.",
    questionText: "5보다 큰 눈이 나오는 경우는 몇 가지인가요?",
    outcomes: ["1", "2", "3", "4", "5", "6"],
    targetOutcomeLabels: ["6"],
    explanation: "5보다 큰 눈은 6 하나뿐이라 1가지예요.",
    kind: "favorable-outcomes",
  },
  {
    scenarioKind: "die",
    scenarioTitle: "주사위 한 개",
    situation: "주사위를 한 번 굴릴 때 3보다 작은 눈을 찾아봐요.",
    questionText: "3보다 작은 눈이 나오는 경우는 몇 가지인가요?",
    outcomes: ["1", "2", "3", "4", "5", "6"],
    targetOutcomeLabels: ["1", "2"],
    explanation: "3보다 작은 눈은 1과 2로 2가지예요.",
    kind: "favorable-outcomes",
  },
  {
    scenarioKind: "color-pick",
    scenarioTitle: "색 공 뽑기",
    situation: "상자에 서로 다른 색 공이 하나씩 들어 있어요.",
    questionText: "뽑을 수 있는 결과는 모두 몇 가지인가요?",
    outcomes: ["빨강", "파랑", "노랑", "초록"],
    targetOutcomeLabels: [],
    explanation: "색이 4가지이므로 뽑을 수 있는 결과도 4가지예요.",
    kind: "total-outcomes",
  },
  {
    scenarioKind: "color-pick",
    scenarioTitle: "색 공 뽑기",
    situation: "상자에 빨강 공 2개, 파랑 공 1개, 노랑 공 1개가 있어요.",
    questionText: "빨강 공을 뽑는 경우는 몇 가지인가요?",
    outcomes: ["빨강", "빨강", "파랑", "노랑"],
    targetOutcomeLabels: ["빨강"],
    explanation: "빨강 공이 2개 있으므로 조건에 맞는 경우는 2가지예요.",
    kind: "favorable-outcomes",
  },
  {
    scenarioKind: "color-pick",
    scenarioTitle: "색 공 뽑기",
    situation: "상자에 빨강, 파랑, 노랑, 초록, 보라 공이 있어요.",
    questionText: "초록 공을 뽑는 경우는 몇 가지인가요?",
    outcomes: ["빨강", "파랑", "노랑", "초록", "보라"],
    targetOutcomeLabels: ["초록"],
    explanation: "초록 공은 하나이므로 조건에 맞는 경우는 1가지예요.",
    kind: "favorable-outcomes",
  },
  {
    scenarioKind: "color-pick",
    scenarioTitle: "색 공 뽑기",
    situation: "상자에 빨강 공 2개, 노랑 공 2개, 파랑 공 1개가 있어요.",
    questionText: "노랑 공을 뽑는 경우는 몇 가지인가요?",
    outcomes: ["빨강", "빨강", "노랑", "노랑", "파랑"],
    targetOutcomeLabels: ["노랑"],
    explanation: "노랑 공이 2개 있으므로 조건에 맞는 경우는 2가지예요.",
    kind: "favorable-outcomes",
  },
];

export function generateProbabilityQuestions(
  stage: ProbabilityStage = PROBABILITY_STAGE,
  rng: Rng = Math.random,
): ProbabilityQuestion[] {
  const candidates = createCandidates(stage);
  const requiredQuestions = uniqueQuestions(
    compact([
      ...QUESTION_KINDS.map((kind) =>
        shuffle(
          candidates.filter((question) => question.kind === kind),
          rng,
        ).at(0),
      ),
      ...SCENARIO_KINDS.map((scenarioKind) =>
        shuffle(
          candidates.filter(
            (question) => question.scenarioKind === scenarioKind,
          ),
          rng,
        ).at(0),
      ),
    ]),
  );
  const requiredIds = new Set(requiredQuestions.map((question) => question.id));
  const fillerQuestions = shuffle(
    candidates.filter((question) => !requiredIds.has(question.id)),
    rng,
  );

  return shuffle(
    [...requiredQuestions, ...fillerQuestions].slice(0, stage.questionCount),
    rng,
  );
}

function createCandidates(stage: ProbabilityStage): ProbabilityQuestion[] {
  return QUESTION_SPECS.map((spec, index) => {
    const answer = calculateAnswer(spec);

    return {
      id: `${stage.id}-${spec.scenarioKind}-${spec.kind}-${index + 1}`,
      scenarioKind: spec.scenarioKind,
      scenarioTitle: spec.scenarioTitle,
      situation: spec.situation,
      questionText: spec.questionText,
      outcomes: spec.outcomes,
      targetOutcomeLabels: spec.targetOutcomeLabels,
      answer,
      explanation: spec.explanation,
      kind: spec.kind,
      difficulty: classifyDifficulty(spec.outcomes.length, answer),
      stageId: stage.id,
    };
  });
}

function calculateAnswer(spec: ProbabilityQuestionSpec): number {
  if (spec.kind === "total-outcomes") return spec.outcomes.length;

  return spec.outcomes.filter((outcome) =>
    spec.targetOutcomeLabels.includes(outcome),
  ).length;
}

function classifyDifficulty(
  outcomeCount: number,
  answer: number,
): ProbabilityDifficulty {
  return outcomeCount <= 4 && answer <= 2 ? "easy" : "medium";
}

function uniqueQuestions(
  questions: readonly ProbabilityQuestion[],
): ProbabilityQuestion[] {
  const seen = new Set<string>();

  return questions.filter((question) => {
    if (seen.has(question.id)) return false;

    seen.add(question.id);
    return true;
  });
}

function compact<T>(items: Array<T | undefined>): T[] {
  return items.filter((item): item is T => item !== undefined);
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
