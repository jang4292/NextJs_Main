"use client";

import { useCallback, useEffect, useReducer } from "react";
import {
  DEFAULT_MAX_ATTEMPTS,
  DEFAULT_SECRET_LENGTH,
} from "../../domain/game.constants";
import {
  generateSecret,
  isGameLost,
  isGameWon,
  judgeGuess,
  validateGuess,
} from "../../domain/bullsAndCowsEngine";
import type { GameState } from "../../domain/game.types";

const INITIAL_MESSAGE =
  "중복 없는 세 자리 숫자를 입력하세요. 0은 첫 자리를 제외하고 사용할 수 있어요.";

type Action =
  | { type: "INPUT_DIGIT"; digit: string }
  | { type: "DELETE_DIGIT" }
  | { type: "SET_INPUT"; value: string }
  | { type: "SUBMIT" }
  | { type: "RESTART" };

function createInitialState(): GameState {
  return {
    secret: generateSecret(),
    currentInput: "",
    attempts: [],
    maxAttempts: DEFAULT_MAX_ATTEMPTS,
    status: "ready",
    message: INITIAL_MESSAGE,
  };
}

function isInputLocked(state: GameState) {
  return state.status === "win" || state.status === "lose";
}

function reducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case "INPUT_DIGIT": {
      if (isInputLocked(state)) return state;
      if (state.currentInput.length >= DEFAULT_SECRET_LENGTH) return state;
      if (!/^\d$/.test(action.digit)) return state;
      if (state.currentInput.includes(action.digit)) {
        return { ...state, message: "이미 입력한 숫자예요." };
      }
      if (state.currentInput.length === 0 && action.digit === "0") {
        return { ...state, message: "첫 자리에는 0을 사용할 수 없어요." };
      }

      return {
        ...state,
        currentInput: `${state.currentInput}${action.digit}`,
        status: state.status === "ready" ? "playing" : state.status,
        message: "좋아요. 숫자를 완성한 뒤 제출해 주세요.",
      };
    }

    case "DELETE_DIGIT": {
      if (isInputLocked(state)) return state;
      if (!state.currentInput) return state;

      return {
        ...state,
        currentInput: state.currentInput.slice(0, -1),
        message: "마지막 숫자를 지웠어요.",
      };
    }

    case "SET_INPUT": {
      if (isInputLocked(state)) return state;
      const value = action.value
        .replace(/\D/g, "")
        .slice(0, DEFAULT_SECRET_LENGTH);

      return {
        ...state,
        currentInput: value,
status: value || state.attempts.length > 0 ? "playing" : "ready",
        message: value ? "입력값을 확인하고 제출해 주세요." : INITIAL_MESSAGE,
      };
    }

    case "SUBMIT": {
      if (isInputLocked(state)) {
        return { ...state, message: "게임이 끝났어요. 다시 시작해 주세요." };
      }

      const validation = validateGuess(state.currentInput);
      if (!validation.valid) {
        return {
          ...state,
          status: state.attempts.length > 0 ? "playing" : "ready",
          message: validation.message ?? "입력값을 확인해 주세요.",
        };
      }

      const result = judgeGuess(state.secret, state.currentInput);
      const attempts = [result, ...state.attempts];

      if (isGameWon(result)) {
        return {
          ...state,
          currentInput: "",
          attempts,
          status: "win",
          message: `정답입니다! ${attempts.length}번 만에 맞혔어요.`,
        };
      }

      if (isGameLost(attempts.length, state.maxAttempts)) {
        return {
          ...state,
          currentInput: "",
          attempts,
          status: "lose",
          message: `실패했어요. 정답은 ${state.secret}였습니다.`,
        };
      }

      const resultLabel = result.isOut
        ? "Out"
        : `${result.strikes} Strike ${result.balls} Ball`;

      return {
        ...state,
        currentInput: "",
        attempts,
        status: "playing",
        message: `${resultLabel}. 남은 기회는 ${
          state.maxAttempts - attempts.length
        }번입니다.`,
      };
    }

    case "RESTART":
      return createInitialState();

    default:
      return state;
  }
}

export function useBullsAndCowsGame() {
  const [state, dispatch] = useReducer(reducer, undefined, createInitialState);
  const inputDigit = useCallback(
    (digit: string) => dispatch({ type: "INPUT_DIGIT", digit }),
    [],
  );
  const deleteDigit = useCallback(() => dispatch({ type: "DELETE_DIGIT" }), []);
  const setInput = useCallback(
    (value: string) => dispatch({ type: "SET_INPUT", value }),
    [],
  );
  const submit = useCallback(() => dispatch({ type: "SUBMIT" }), []);
  const restart = useCallback(() => dispatch({ type: "RESTART" }), []);
  const inputDisabled = state.status === "win" || state.status === "lose";

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
if (
  event.ctrlKey ||
  event.metaKey ||
  event.altKey ||
  event.target instanceof HTMLButtonElement
) {
  return;
}

      if (/^\d$/.test(event.key)) {
        event.preventDefault();
        inputDigit(event.key);
        return;
      }

      if (event.key === "Backspace" || event.key === "Delete") {
        event.preventDefault();
        deleteDigit();
        return;
      }

      if (event.key === "Enter") {
        event.preventDefault();
        submit();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [deleteDigit, inputDigit, submit]);

  return {
    ...state,
    remainingAttempts: state.maxAttempts - state.attempts.length,
    inputDisabled,
    inputDigit,
    deleteDigit,
    setInput,
    submit,
    restart,
  };
}
