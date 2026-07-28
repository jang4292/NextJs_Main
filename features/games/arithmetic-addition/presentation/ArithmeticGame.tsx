"use client";

import { AnswerDisplay } from "./components/AnswerDisplay";
import { FeedbackMessage } from "./components/FeedbackMessage";
import { GameHeader } from "./components/GameHeader";
import { GameStart } from "./components/GameStart";
import { NumberPad } from "./components/NumberPad";
import { QuestionBoard } from "./components/QuestionBoard";
import { ResultSummary } from "./components/ResultSummary";
import { useArithmeticGame, type UseArithmeticGameOptions } from "./hooks/useArithmeticGame";
import { useArithmeticKeyboardInput } from "./interaction/useArithmeticKeyboardInput";

export function ArithmeticGame(options: UseArithmeticGameOptions = {}) {
  const game = useArithmeticGame(options);

  useArithmeticKeyboardInput({
    enabled: game.status !== "idle" && game.status !== "completed",
    onDigit: game.inputDigit,
    onDelete: game.deleteDigit,
    onSubmit: game.submitAnswer,
  });

  if (game.status === "idle") {
    return <GameStart onStart={game.start} />;
  }

  if (game.status === "completed" && game.analysis) {
    return (
      <ResultSummary
        analysis={game.analysis}
        reviewMode={game.reviewMode}
        onRestart={game.restart}
        onReviewWrong={game.startReview}
      />
    );
  }

  if (!game.currentQuestion) {
    return <GameStart onStart={game.start} />;
  }

  return (
    <section
      className="mx-auto flex w-full max-w-[560px] flex-col gap-4 px-3 py-5 sm:px-4"
      aria-label="한 자리 덧셈 학습 게임"
    >
      <GameHeader
        currentIndex={game.currentIndex}
        totalQuestions={game.totalQuestions}
        reviewMode={game.reviewMode}
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

