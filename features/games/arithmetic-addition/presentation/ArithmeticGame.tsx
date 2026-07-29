"use client";

import { useEffect, useMemo, useRef } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { buildRecommendation } from "../application/use-cases/buildRecommendation";
import { generateAdditionStageQuestions } from "../application/use-cases/generateAdditionStageQuestions";
import { generateSubtractionQuestions } from "../application/use-cases/generateSubtractionQuestions";
import {
  getFrequentMistakes,
  getRecentMistakes,
} from "../application/use-cases/reviewSelectors";
import type {
  ArithmeticQuestion,
  LearningStage,
  Operator,
  StageId,
} from "../domain/arithmetic.types";
import type {
  LearningRecommendation,
  MistakeRecord,
} from "../domain/learningProgress.types";
import { OPERATOR_LABEL } from "../domain/operatorMeta";
import {
  ADDITION_STAGES,
  type AdditionStageConfig,
} from "../domain/stages/additionStages";
import {
  SUBTRACTION_STAGES,
  type SubtractionStageConfig,
} from "../domain/stages/subtractionStages";
import { AnswerDisplay } from "./components/AnswerDisplay";
import { FeedbackMessage } from "./components/FeedbackMessage";
import { GameHeader } from "./components/GameHeader";
import { ArithmeticHome } from "./components/home/ArithmeticHome";
import { NumberPad } from "./components/NumberPad";
import { QuestionBoard } from "./components/QuestionBoard";
import { ReviewMenu } from "./components/review/ReviewMenu";
import { ResultSummary } from "./components/ResultSummary";
import { StageList } from "./components/stage/StageList";
import { useArithmeticNavigation } from "./hooks/useArithmeticNavigation";
import { useArithmeticGame, type UseArithmeticGameOptions } from "./hooks/useArithmeticGame";
import { useLearningProgress } from "./hooks/useLearningProgress";
import { useArithmeticKeyboardInput } from "./interaction/useArithmeticKeyboardInput";

export function ArithmeticGame(options: UseArithmeticGameOptions = {}) {
  const game = useArithmeticGame(options);
  const navigation = useArithmeticNavigation();
  const learningProgress = useLearningProgress();
  const handledSessionRef = useRef<string | null>(null);
  const selectedStage = navigation.selectedStageId
    ? getStageById(navigation.selectedStageId)
    : undefined;
  const selectedStages = navigation.selectedOperator
    ? getStagesForOperator(navigation.selectedOperator)
    : [];
  const continueStage = getContinueStage(learningProgress.data.lastPlayedStageId);
  const continueProgress = continueStage
    ? learningProgress.data.stageProgress.find(
        (record) => record.stageId === continueStage.id,
      )
    : undefined;
  const recentMistakes = useMemo(
    () => getRecentMistakes(learningProgress.data),
    [learningProgress.data],
  );
  const frequentMistakes = useMemo(
    () => getFrequentMistakes(learningProgress.data),
    [learningProgress.data],
  );
  const recommendation =
    selectedStage && game.analysis && !game.reviewMode
      ? buildRecommendation(game.analysis, selectedStage, {
          stages: getStagesForOperator(selectedStage.operator),
          progress: learningProgress.data.stageProgress.find(
            (record) => record.stageId === selectedStage.id,
          ),
        })
      : undefined;

  useArithmeticKeyboardInput({
    enabled:
      navigation.view === "playing" &&
      game.status !== "idle" &&
      game.status !== "completed",
    onDigit: game.inputDigit,
    onDelete: game.deleteDigit,
    onSubmit: game.submitAnswer,
  });

  useEffect(() => {
    if (!game.session || !game.analysis || game.status !== "completed") return;
    if (handledSessionRef.current === game.session.id) return;

    handledSessionRef.current = game.session.id;

    if (!game.reviewMode && selectedStage) {
      learningProgress.recordStageResult(
        selectedStage,
        game.session,
        game.analysis,
      );
    }

    navigation.showResult();
  }, [
    game.analysis,
    game.reviewMode,
    game.session,
    game.status,
    learningProgress,
    navigation,
    selectedStage,
  ]);

  function startStage(stage: LearningStage) {
    navigation.selectStage(stage.operator, stage.id);
    game.startWithQuestions(createQuestionsForStage(stage, options), false);
  }

  function restartStage() {
    if (!selectedStage) return;
    startStage(selectedStage);
  }

  function startResultReview() {
    if (!game.analysis || game.analysis.wrongResults.length === 0) return;
    const reviewQuestions = game.analysis.wrongResults.map(
      (result) => result.question,
    );
    const reviewStage = getStageById(reviewQuestions[0]?.stageId);

    if (reviewStage) {
      navigation.selectStage(reviewStage.operator, reviewStage.id);
    }

    game.startWithQuestions(reviewQuestions, true);
  }

  function startMistakeReview(mistakes: MistakeRecord[]) {
    if (mistakes.length === 0) return;

    const reviewQuestions = mistakes.map(mistakeToQuestion);
    const reviewStage = getStageById(reviewQuestions[0]?.stageId);

    if (reviewStage) {
      navigation.selectStage(reviewStage.operator, reviewStage.id);
    }

    game.startWithQuestions(reviewQuestions, true);
  }

  function goHome() {
    game.reset();
    navigation.goHome();
  }

  function handleRecommendationAction(
    currentRecommendation: LearningRecommendation,
  ) {
    if (currentRecommendation.kind === "review-mistakes") {
      startResultReview();
      return;
    }

    if (currentRecommendation.kind === "complete") {
      goHome();
      return;
    }

    if (currentRecommendation.targetStageId) {
      const targetStage = getStageById(currentRecommendation.targetStageId);
      if (targetStage) startStage(targetStage);
    }
  }

  if (navigation.view === "home") {
    return (
      <ArithmeticHome
        learningData={learningProgress.data}
        continueStage={continueStage}
        continueProgress={continueProgress}
        onContinue={() => {
          if (continueStage) startStage(continueStage);
        }}
        onSelectOperation={navigation.selectOperation}
        onOpenReview={navigation.showReview}
        onOpenHistory={navigation.showHistory}
      />
    );
  }

  if (navigation.view === "stage-selection") {
    return (
      <StageList
        stages={selectedStages}
        progress={learningProgress.data.stageProgress}
        recommendedStageId={getRecommendedStageId(
          selectedStages,
          learningProgress.data.stageProgress,
        )}
        onBack={navigation.goHome}
        onStartStage={startStage}
      />
    );
  }

  if (navigation.view === "review") {
    return (
      <ReviewMenu
        recentMistakes={recentMistakes}
        frequentMistakes={frequentMistakes}
        onBack={navigation.goHome}
        onStartLearning={navigation.goHome}
        onStartReview={startMistakeReview}
      />
    );
  }

  if (navigation.view === "history") {
    return (
      <LearningHistory
        sessions={learningProgress.data.recentSessions}
        onBack={navigation.goHome}
      />
    );
  }

  if (navigation.view === "result" && game.analysis) {
    return (
      <ResultSummary
        analysis={game.analysis}
        reviewMode={game.reviewMode}
        stage={selectedStage}
        recommendation={recommendation}
        onRestart={restartStage}
        onReviewWrong={startResultReview}
        onBackHome={goHome}
        onRecommendationAction={handleRecommendationAction}
      />
    );
  }

  if (!game.currentQuestion) {
    return (
      <StageList
        stages={selectedStages}
        progress={learningProgress.data.stageProgress}
        recommendedStageId={getRecommendedStageId(
          selectedStages,
          learningProgress.data.stageProgress,
        )}
        onBack={navigation.goHome}
        onStartStage={startStage}
      />
    );
  }

  return (
    <section
      className="mx-auto flex w-full max-w-[560px] flex-col gap-4 px-3 py-5 sm:px-4"
      aria-label="사칙연산 학습 게임"
    >
      <GameHeader
        currentIndex={game.currentIndex}
        totalQuestions={game.totalQuestions}
        reviewMode={game.reviewMode}
        stage={selectedStage}
        operator={game.currentQuestion.operator}
        onBack={() => {
          game.reset();
          navigation.backToStageSelection();
        }}
      />

      <QuestionBoard question={game.currentQuestion} />

      <AnswerDisplay value={game.inputValue} />

      <FeedbackMessage
        feedback={game.feedback}
        question={game.currentQuestion}
      />

      <NumberPad
        canInput={game.canInput}
        canSubmit={game.canSubmit}
        canGoNext={game.canGoNext}
        isLastQuestion={game.isLastQuestion}
        onDigit={game.inputDigit}
        onDelete={game.deleteDigit}
        onSubmit={game.submitAnswer}
        onNext={game.nextQuestion}
      />
    </section>
  );
}

function createQuestionsForStage(
  stage: LearningStage,
  options: UseArithmeticGameOptions,
): ArithmeticQuestion[] {
  if (options.createQuestions) {
    return options.createQuestions().map((question) => ({
      ...question,
      operator: stage.operator,
      stageId: stage.id,
    }));
  }

  if (stage.operator === "addition") {
    return generateAdditionStageQuestions(stage as AdditionStageConfig);
  }

  return generateSubtractionQuestions(stage as SubtractionStageConfig);
}

function getStagesForOperator(operator: Operator): LearningStage[] {
  return operator === "addition" ? ADDITION_STAGES : SUBTRACTION_STAGES;
}

function getStageById(stageId: StageId | undefined): LearningStage | undefined {
  if (!stageId) return undefined;

  return [...ADDITION_STAGES, ...SUBTRACTION_STAGES].find(
    (stage) => stage.id === stageId,
  );
}

function getContinueStage(stageId: StageId | undefined) {
  return getStageById(stageId);
}

function getRecommendedStageId(
  stages: LearningStage[],
  progress: { stageId: StageId; status: string }[],
): StageId | undefined {
  const firstOpenStage = stages.find((stage) => {
    const record = progress.find((current) => current.stageId === stage.id);
    return record?.status !== "completed";
  });

  return firstOpenStage?.id ?? stages.at(-1)?.id;
}

function mistakeToQuestion(mistake: MistakeRecord): ArithmeticQuestion {
  return {
    id: mistake.questionKey,
    leftOperand: mistake.leftOperand,
    rightOperand: mistake.rightOperand,
    operator: mistake.operation,
    answer: mistake.answer,
    difficulty: mistake.difficulty,
    stageId: mistake.stageId,
  };
}

function LearningHistory({
  sessions,
  onBack,
}: {
  sessions: Array<{
    id: string;
    stageId: StageId;
    operation: Operator;
    totalQuestions: number;
    firstTryAccuracy: number;
    starRating: 1 | 2 | 3;
  }>;
  onBack: () => void;
}) {
  return (
    <section
      className="mx-auto flex w-full max-w-[720px] flex-col gap-4 px-3 py-5 sm:px-4"
      aria-label="학습 기록"
    >
      <header className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-emerald-700">학습 기록</p>
          <h1 className="mt-1 text-2xl font-bold text-neutral-950">
            최근 학습
          </h1>
        </div>
        <Button type="button" variant="outline" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          뒤로
        </Button>
      </header>

      <div className="grid gap-2">
        {sessions.map((session) => {
          const stage = getStageById(session.stageId);

          return (
            <div
              key={session.id}
              className="rounded-lg border border-neutral-200 bg-white p-4 shadow-sm"
            >
              <p className="text-sm font-semibold text-neutral-500">
                {OPERATOR_LABEL[session.operation]}
              </p>
              <h2 className="mt-1 font-bold text-neutral-950">
                {stage?.title ?? session.stageId}
              </h2>
              <p className="mt-2 text-sm text-neutral-600">
                {session.totalQuestions}문제 · 최초 정답률{" "}
                {Math.round(session.firstTryAccuracy * 100)}% · 별{" "}
                {session.starRating}개
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
