"use client";

import { useReducer, useState } from "react";
import { restartGame } from "../../application/use-cases/restartGame";
import { revealCell } from "../../application/use-cases/revealCell";
import { startNewGame } from "../../application/use-cases/startNewGame";
import { toggleFlag } from "../../application/use-cases/toggleFlag";
import { BEGINNER, type Difficulty } from "../../domain/entities/Difficulty";
import type { GameState } from "../../domain/entities/GameState";
import type { Position } from "../../domain/entities/Position";
import { countRemainingMines } from "../../domain/rules/boardQueries";
import { useElapsedTimer } from "./useElapsedTimer";

type Action =
  | { type: "REVEAL"; position: Position }
  | { type: "TOGGLE_FLAG"; position: Position }
  | { type: "RESTART" };

/** Every case calls exactly one use-case - no game rules live here. */
function reducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case "REVEAL":
      return revealCell(state, action.position);
    case "TOGGLE_FLAG":
      return toggleFlag(state, action.position);
    case "RESTART":
      return restartGame(state);
    default:
      return state;
  }
}

/**
 * ViewModel for Minesweeper: wraps the pure use-cases in a useReducer, and
 * owns the two pieces of state that are presentation-only concerns rather
 * than game rules - the elapsed-time timer and the mobile "flag mode" toggle.
 */
export function useMinesweeper(difficulty: Difficulty = BEGINNER) {
  const [state, dispatch] = useReducer(reducer, difficulty, startNewGame);
  const { elapsedSeconds, reset: resetTimer } = useElapsedTimer(
    state.status === "playing",
  );
  const [flagMode, setFlagMode] = useState(false);

  return {
    board: state.board,
    status: state.status,
    remainingMines: countRemainingMines(
      state.board,
      state.difficulty.mineCount,
    ),
    elapsedSeconds,
    flagMode,
    reveal: (position: Position) => dispatch({ type: "REVEAL", position }),
    toggleFlag: (position: Position) =>
      dispatch({ type: "TOGGLE_FLAG", position }),
    restart: () => {
      dispatch({ type: "RESTART" });
      resetTimer();
    },
    toggleFlagMode: () => setFlagMode((mode) => !mode),
  };
}
