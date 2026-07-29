"use client";

import { useReducer } from "react";
import type { Operator, StageId } from "../../domain/arithmetic.types";

export type ArithmeticView =
  | "home"
  | "stage-selection"
  | "playing"
  | "result"
  | "review"
  | "history";

interface ArithmeticNavigationState {
  view: ArithmeticView;
  selectedOperator?: Operator;
  selectedStageId?: StageId;
}

type Action =
  | { type: "GO_HOME" }
  | { type: "SELECT_OPERATION"; operator: Operator }
  | { type: "SELECT_STAGE"; operator: Operator; stageId: StageId }
  | { type: "SHOW_RESULT" }
  | { type: "SHOW_REVIEW" }
  | { type: "SHOW_HISTORY" }
  | { type: "BACK_TO_STAGE_SELECTION" };

const INITIAL_STATE: ArithmeticNavigationState = {
  view: "home",
};

function reducer(
  state: ArithmeticNavigationState,
  action: Action,
): ArithmeticNavigationState {
  switch (action.type) {
    case "GO_HOME":
      return INITIAL_STATE;

    case "SELECT_OPERATION":
      return {
        view: "stage-selection",
        selectedOperator: action.operator,
      };

    case "SELECT_STAGE":
      return {
        view: "playing",
        selectedOperator: action.operator,
        selectedStageId: action.stageId,
      };

    case "SHOW_RESULT":
      return {
        ...state,
        view: "result",
      };

    case "SHOW_REVIEW":
      return {
        ...state,
        view: "review",
      };

    case "SHOW_HISTORY":
      return {
        ...state,
        view: "history",
      };

    case "BACK_TO_STAGE_SELECTION":
      if (!state.selectedOperator) return INITIAL_STATE;

      return {
        view: "stage-selection",
        selectedOperator: state.selectedOperator,
      };
  }
}

export function useArithmeticNavigation() {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);

  return {
    ...state,
    goHome: () => dispatch({ type: "GO_HOME" }),
    selectOperation: (operator: Operator) =>
      dispatch({ type: "SELECT_OPERATION", operator }),
    selectStage: (operator: Operator, stageId: StageId) =>
      dispatch({ type: "SELECT_STAGE", operator, stageId }),
    showResult: () => dispatch({ type: "SHOW_RESULT" }),
    showReview: () => dispatch({ type: "SHOW_REVIEW" }),
    showHistory: () => dispatch({ type: "SHOW_HISTORY" }),
    backToStageSelection: () => dispatch({ type: "BACK_TO_STAGE_SELECTION" }),
  };
}
