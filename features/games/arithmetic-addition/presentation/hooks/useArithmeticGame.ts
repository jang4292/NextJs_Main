"use client";

import { useMemo, useReducer } from "react";
import { calculateSessionResult } from "../../application/use-cases/calculateSessionResult";
import { generateQuestions } from "../../application/use-cases/generateQuestions";
import type {
  ArithmeticQuestion,
  FeedbackState,
  GameStatus,
  LearningSession,
  QuestionAttempt,
  QuestionResult,
} from "../../domain/arithmetic.types";
import {
  formatAnswerSentence,
  formatTryAgainMessage,
} from "../../domain/operatorMeta";

interface ArithmeticGameState {
  status: GameStatus;
  questions: ArithmeticQuestion[];
  currentIndex: number;
  inputValue: string;
  results: QuestionResult[];
  questionStartedAt: number;
  feedback: FeedbackState | null;
  reviewMode: boolean;
  sessionId: string;
  startedAt: string | null;
  completedAt?: string;
  streak: number;
  maxStreak: number;
}

type Action =
  | {
      type: "START";
      questions: ArithmeticQuestion[];
      now: number;
      reviewMode: boolean;
    }
  | { type: "INPUT_DIGIT"; digit: number }
  | { type: "DELETE_DIGIT" }
  | { type: "SUBMIT"; now: number }
  | { type: "NEXT"; now: number }
  | { type: "RESET" };

export interface UseArithmeticGameOptions {
  createQuestions?: () => ArithmeticQuestion[];
  now?: () => number;
}

const MAX_INPUT_LENGTH = 2;

function createIdleState(): ArithmeticGameState {
  return {
    status: "idle",
    questions: [],
    currentIndex: 0,
    inputValue: "",
    results: [],
    questionStartedAt: 0,
    feedback: null,
    reviewMode: false,
    sessionId: "",
    startedAt: null,
    streak: 0,
    maxStreak: 0,
  };
}

function reducer(
  state: ArithmeticGameState,
  action: Action,
): ArithmeticGameState {
  switch (action.type) {
    case "START": {
      const startedAt = new Date(action.now).toISOString();

      return {
        status: action.questions.length > 0 ? "playing" : "completed",
        questions: action.questions,
        currentIndex: 0,
        inputValue: "",
        results: action.questions.map(createEmptyResult),
        questionStartedAt: action.now,
        feedback: null,
        reviewMode: action.reviewMode,
        sessionId: `arithmetic-${action.now}`,
        startedAt,
        streak: 0,
        maxStreak: 0,
      };
    }

    case "INPUT_DIGIT": {
      if (!canEditAnswer(state)) return state;

      const nextInput =
        state.inputValue === "0"
          ? String(action.digit)
          : `${state.inputValue}${action.digit}`;

      return {
        ...state,
        status: "playing",
        inputValue: nextInput.slice(0, MAX_INPUT_LENGTH),
        feedback:
          state.feedback?.kind === "try-again" ? state.feedback : null,
      };
    }

    case "DELETE_DIGIT": {
      if (!canEditAnswer(state)) return state;

      return {
        ...state,
        status: "playing",
        inputValue: state.inputValue.slice(0, -1),
      };
    }

    case "SUBMIT": {
      if (!canSubmitAnswer(state)) return state;

      const currentQuestion = state.questions[state.currentIndex];
      const currentResult = state.results[state.currentIndex];
      const submittedAnswer = Number(state.inputValue);
      const isCorrect = submittedAnswer === currentQuestion.answer;
      const attempt: QuestionAttempt = {
        submittedAnswer,
        isCorrect,
        elapsedMs: Math.max(0, action.now - state.questionStartedAt),
        attemptNumber: currentResult.attempts.length + 1,
      };
      const attempts = [...currentResult.attempts, attempt];
      const shouldComplete = isCorrect || attempts.length >= 2;
      const firstTryCorrect = attempts[0]?.isCorrect ?? false;
      const nextResult: QuestionResult = {
        ...currentResult,
        attempts,
        firstTryCorrect,
        completed: shouldComplete,
        totalElapsedMs: attempts.reduce(
          (totalElapsedMs, currentAttempt) =>
            totalElapsedMs + currentAttempt.elapsedMs,
          0,
        ),
      };
      const nextResults = replaceResult(
        state.results,
        state.currentIndex,
        nextResult,
      );

      if (isCorrect) {
        const streak = state.streak + 1;

        return {
          ...state,
          status: "feedback",
          inputValue: "",
          results: nextResults,
          feedback: {
            kind: "correct",
            title: "정답이에요!",
            message: formatAnswerSentence(currentQuestion),
          },
          streak,
          maxStreak: Math.max(state.maxStreak, streak),
        };
      }

      if (!shouldComplete) {
        return {
          ...state,
          status: "feedback",
          inputValue: "",
          results: nextResults,
          questionStartedAt: action.now,
          feedback: {
            kind: "try-again",
            title: "다시 생각해 보세요.",
            message: formatTryAgainMessage(currentQuestion),
          },
          streak: 0,
        };
      }

      return {
        ...state,
        status: "feedback",
        inputValue: "",
        results: nextResults,
        feedback: {
          kind: "answer-revealed",
          title: "정답을 함께 확인해요.",
          message: formatAnswerSentence(currentQuestion),
        },
        streak: 0,
      };
    }

    case "NEXT": {
      const currentResult = state.results[state.currentIndex];
      if (state.status !== "feedback" || !currentResult?.completed) {
        return state;
      }

      const nextIndex = state.currentIndex + 1;

      if (nextIndex >= state.questions.length) {
        return {
          ...state,
          status: "completed",
          inputValue: "",
          feedback: null,
          completedAt: new Date(action.now).toISOString(),
        };
      }

      return {
        ...state,
        status: "playing",
        currentIndex: nextIndex,
        inputValue: "",
        questionStartedAt: action.now,
        feedback: null,
      };
    }

    case "RESET":
      return createIdleState();
  }
}

export function useArithmeticGame(options: UseArithmeticGameOptions = {}) {
  const now = options.now ?? Date.now;
  const createQuestions = options.createQuestions ?? generateQuestions;
  const [state, dispatch] = useReducer(reducer, undefined, createIdleState);
  const currentQuestion = state.questions[state.currentIndex];
  const currentResult = state.results[state.currentIndex];
  const session = useMemo(
    () => createSessionFromState(state),
    [state],
  );
  const analysis = useMemo(
    () => (session ? calculateSessionResult(session) : null),
    [session],
  );

  function start() {
    startWithQuestions(createQuestions(), false);
  }

  function startWithQuestions(
    questions: ArithmeticQuestion[],
    reviewMode = false,
  ) {
    dispatch({
      type: "START",
      questions,
      now: now(),
      reviewMode,
    });
  }

  function restart() {
    start();
  }

  function reset() {
    dispatch({ type: "RESET" });
  }

  function startReview() {
    if (!analysis || analysis.wrongResults.length === 0) return;

    startWithQuestions(
      analysis.wrongResults.map((result) => result.question),
      true,
    );
  }

  return {
    status: state.status,
    currentQuestion,
    currentResult,
    currentIndex: state.currentIndex,
    totalQuestions: state.questions.length,
    inputValue: state.inputValue,
    feedback: state.feedback,
    reviewMode: state.reviewMode,
    session,
    analysis,
    canInput: canEditAnswer(state),
    canSubmit: canSubmitAnswer(state),
    canGoNext:
      state.status === "feedback" &&
      Boolean(currentResult?.completed),
    isLastQuestion: state.currentIndex === state.questions.length - 1,
    start,
    restart,
    reset,
    startWithQuestions,
    startReview,
    inputDigit: (digit: number) => dispatch({ type: "INPUT_DIGIT", digit }),
    deleteDigit: () => dispatch({ type: "DELETE_DIGIT" }),
    submitAnswer: () => dispatch({ type: "SUBMIT", now: now() }),
    nextQuestion: () => dispatch({ type: "NEXT", now: now() }),
  };
}

function canEditAnswer(state: ArithmeticGameState): boolean {
  if (!["playing", "feedback"].includes(state.status)) return false;
  const currentResult = state.results[state.currentIndex];
  return !currentResult?.completed;
}

function canSubmitAnswer(state: ArithmeticGameState): boolean {
  return canEditAnswer(state) && state.inputValue.length > 0;
}

function createEmptyResult(question: ArithmeticQuestion): QuestionResult {
  return {
    question,
    attempts: [],
    firstTryCorrect: false,
    completed: false,
    totalElapsedMs: 0,
  };
}

function replaceResult(
  results: QuestionResult[],
  index: number,
  result: QuestionResult,
): QuestionResult[] {
  return results.map((currentResult, currentIndex) =>
    currentIndex === index ? result : currentResult,
  );
}

function createSessionFromState(
  state: ArithmeticGameState,
): LearningSession | null {
  if (!state.startedAt) return null;

  return {
    id: state.sessionId,
    startedAt: state.startedAt,
    completedAt: state.completedAt,
    totalQuestions: state.questions.length,
    results: state.results,
  };
}
