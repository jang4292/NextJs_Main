"use client";

import { useMemo, useReducer } from "react";

export type NumericQuizStatus = "idle" | "playing" | "feedback" | "completed";

export type NumericQuizFeedbackKind =
  | "correct"
  | "try-again"
  | "answer-revealed";

export interface NumericQuizFeedbackState {
  kind: NumericQuizFeedbackKind;
  title: string;
  message: string;
}

export interface NumericQuizAttempt {
  submittedAnswer: number;
  isCorrect: boolean;
  elapsedMs: number;
  attemptNumber: number;
}

export interface NumericQuizResult<TQuestion> {
  question: TQuestion;
  attempts: NumericQuizAttempt[];
  firstTryCorrect: boolean;
  completed: boolean;
  totalElapsedMs: number;
}

export interface NumericQuizSession<TQuestion> {
  id: string;
  startedAt: string;
  completedAt?: string;
  totalQuestions: number;
  results: NumericQuizResult<TQuestion>[];
}

interface NumericQuizState<TQuestion> {
  status: NumericQuizStatus;
  questions: TQuestion[];
  currentIndex: number;
  inputValue: string;
  results: NumericQuizResult<TQuestion>[];
  questionStartedAt: number;
  feedback: NumericQuizFeedbackState | null;
  reviewMode: boolean;
  sessionId: string;
  startedAt: string | null;
  completedAt?: string;
}

type NumericQuizAction<TQuestion> =
  | {
      type: "START";
      questions: TQuestion[];
      now: number;
      reviewMode: boolean;
    }
  | { type: "INPUT_DIGIT"; digit: number }
  | { type: "DELETE_DIGIT" }
  | { type: "SUBMIT"; now: number }
  | { type: "NEXT"; now: number }
  | { type: "RESET" };

interface FeedbackContent {
  title: string;
  message: string;
}

interface NumericQuizMessages<TQuestion> {
  correct: (question: TQuestion) => FeedbackContent;
  tryAgain: (question: TQuestion) => FeedbackContent;
  revealed: (question: TQuestion) => FeedbackContent;
}

export interface UseNumericQuizOptions<TQuestion> {
  autoStart?: boolean;
  createQuestions?: () => TQuestion[];
  getAnswer: (question: TQuestion) => number;
  maxInputLength: number;
  messages: NumericQuizMessages<TQuestion>;
  now?: () => number;
  sessionIdPrefix: string;
}

interface ReducerConfig<TQuestion> {
  getAnswer: (question: TQuestion) => number;
  maxInputLength: number;
  messages: NumericQuizMessages<TQuestion>;
  sessionIdPrefix: string;
}

export function useNumericQuiz<TQuestion>(
  options: UseNumericQuizOptions<TQuestion>,
) {
  const now = options.now ?? Date.now;
  const createQuestions = options.createQuestions ?? (() => []);
  const reducerConfig: ReducerConfig<TQuestion> = {
    getAnswer: options.getAnswer,
    maxInputLength: options.maxInputLength,
    messages: options.messages,
    sessionIdPrefix: options.sessionIdPrefix,
  };
  const [state, dispatch] = useReducer(
    (currentState: NumericQuizState<TQuestion>, action: NumericQuizAction<TQuestion>) =>
      reducer(currentState, action, reducerConfig),
    undefined,
    () =>
      options.autoStart
        ? createStartedState(createQuestions(), now(), false, options.sessionIdPrefix)
        : createIdleState<TQuestion>(),
  );
  const currentQuestion = state.questions[state.currentIndex];
  const currentResult = state.results[state.currentIndex];
  const session = useMemo(() => createSessionFromState(state), [state]);

  function start() {
    startWithQuestions(createQuestions(), false);
  }

  function restart() {
    start();
  }

  function reset() {
    dispatch({ type: "RESET" });
  }

  function startWithQuestions(questions: TQuestion[], reviewMode = false) {
    dispatch({
      type: "START",
      questions,
      now: now(),
      reviewMode,
    });
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
    canInput: canEditAnswer(state),
    canSubmit: canSubmitAnswer(state),
    canGoNext:
      state.status === "feedback" && Boolean(currentResult?.completed),
    isLastQuestion: state.currentIndex === state.questions.length - 1,
    start,
    restart,
    reset,
    startWithQuestions,
    inputDigit: (digit: number) => dispatch({ type: "INPUT_DIGIT", digit }),
    deleteDigit: () => dispatch({ type: "DELETE_DIGIT" }),
    submitAnswer: () => dispatch({ type: "SUBMIT", now: now() }),
    nextQuestion: () => dispatch({ type: "NEXT", now: now() }),
  };
}

function reducer<TQuestion>(
  state: NumericQuizState<TQuestion>,
  action: NumericQuizAction<TQuestion>,
  config: ReducerConfig<TQuestion>,
): NumericQuizState<TQuestion> {
  switch (action.type) {
    case "START":
      return createStartedState(
        action.questions,
        action.now,
        action.reviewMode,
        config.sessionIdPrefix,
      );

    case "INPUT_DIGIT": {
      if (!canEditAnswer(state)) return state;

      const nextInput =
        state.inputValue === "0"
          ? String(action.digit)
          : `${state.inputValue}${action.digit}`;

      return {
        ...state,
        status: "playing",
        inputValue: nextInput.slice(0, config.maxInputLength),
        feedback:
          state.feedback?.kind === "try-again" ? state.feedback : null,
      };
    }

    case "DELETE_DIGIT":
      if (!canEditAnswer(state)) return state;

      return {
        ...state,
        status: "playing",
        inputValue: state.inputValue.slice(0, -1),
      };

    case "SUBMIT": {
      if (!canSubmitAnswer(state)) return state;

      const currentQuestion = state.questions[state.currentIndex];
      const currentResult = state.results[state.currentIndex];
      if (!currentQuestion || !currentResult) return state;

      const submittedAnswer = Number(state.inputValue);
      const isCorrect = submittedAnswer === config.getAnswer(currentQuestion);
      const attempt: NumericQuizAttempt = {
        submittedAnswer,
        isCorrect,
        elapsedMs: Math.max(0, action.now - state.questionStartedAt),
        attemptNumber: currentResult.attempts.length + 1,
      };
      const attempts = [...currentResult.attempts, attempt];
      const shouldComplete = isCorrect || attempts.length >= 2;
      const nextResult: NumericQuizResult<TQuestion> = {
        ...currentResult,
        attempts,
        firstTryCorrect: attempts[0]?.isCorrect ?? false,
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
        return {
          ...state,
          status: "feedback",
          inputValue: "",
          results: nextResults,
          feedback: createFeedback(
            "correct",
            config.messages.correct(currentQuestion),
          ),
        };
      }

      if (!shouldComplete) {
        return {
          ...state,
          status: "feedback",
          inputValue: "",
          results: nextResults,
          questionStartedAt: action.now,
          feedback: createFeedback(
            "try-again",
            config.messages.tryAgain(currentQuestion),
          ),
        };
      }

      return {
        ...state,
        status: "feedback",
        inputValue: "",
        results: nextResults,
        feedback: createFeedback(
          "answer-revealed",
          config.messages.revealed(currentQuestion),
        ),
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

function createIdleState<TQuestion>(): NumericQuizState<TQuestion> {
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
  };
}

function createStartedState<TQuestion>(
  questions: TQuestion[],
  now: number,
  reviewMode: boolean,
  sessionIdPrefix: string,
): NumericQuizState<TQuestion> {
  return {
    status: questions.length > 0 ? "playing" : "completed",
    questions,
    currentIndex: 0,
    inputValue: "",
    results: questions.map(createEmptyResult),
    questionStartedAt: now,
    feedback: null,
    reviewMode,
    sessionId: `${sessionIdPrefix}-${now}`,
    startedAt: new Date(now).toISOString(),
  };
}

function createEmptyResult<TQuestion>(
  question: TQuestion,
): NumericQuizResult<TQuestion> {
  return {
    question,
    attempts: [],
    firstTryCorrect: false,
    completed: false,
    totalElapsedMs: 0,
  };
}

function canEditAnswer<TQuestion>(
  state: NumericQuizState<TQuestion>,
): boolean {
  if (!["playing", "feedback"].includes(state.status)) return false;
  const currentResult = state.results[state.currentIndex];
  return !currentResult?.completed;
}

function canSubmitAnswer<TQuestion>(
  state: NumericQuizState<TQuestion>,
): boolean {
  return canEditAnswer(state) && state.inputValue.length > 0;
}

function replaceResult<TQuestion>(
  results: NumericQuizResult<TQuestion>[],
  index: number,
  result: NumericQuizResult<TQuestion>,
): NumericQuizResult<TQuestion>[] {
  return results.map((currentResult, currentIndex) =>
    currentIndex === index ? result : currentResult,
  );
}

function createSessionFromState<TQuestion>(
  state: NumericQuizState<TQuestion>,
): NumericQuizSession<TQuestion> | null {
  if (!state.startedAt) return null;

  return {
    id: state.sessionId,
    startedAt: state.startedAt,
    completedAt: state.completedAt,
    totalQuestions: state.questions.length,
    results: state.results,
  };
}

function createFeedback(
  kind: NumericQuizFeedbackKind,
  content: FeedbackContent,
): NumericQuizFeedbackState {
  return {
    kind,
    ...content,
  };
}
