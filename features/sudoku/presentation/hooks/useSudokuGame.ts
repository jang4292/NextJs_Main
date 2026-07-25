"use client";

import { useReducer } from "react";
import { deselectCell } from "../../application/use-cases/deselectCell";
import { inputValue } from "../../application/use-cases/inputValue";
import {
  moveSelection,
  type MoveDirection,
} from "../../application/use-cases/moveSelection";
import { pauseGame } from "../../application/use-cases/pauseGame";
import { restartGame } from "../../application/use-cases/restartGame";
import { resumeGame } from "../../application/use-cases/resumeGame";
import { selectCell } from "../../application/use-cases/selectCell";
import { startNewGame } from "../../application/use-cases/startNewGame";
import type { CellPosition } from "../../domain/entities/CellPosition";
import type { SudokuGameState } from "../../domain/entities/GameState";
import type { SudokuValue } from "../../domain/entities/SudokuValue";
import { useElapsedTimer } from "./useElapsedTimer";

type Action =
  | { type: "NEW_GAME" }
  | { type: "RESTART" }
  | { type: "SELECT_CELL"; position: CellPosition }
  | { type: "DESELECT" }
  | { type: "INPUT_VALUE"; value: SudokuValue }
  | { type: "MOVE_SELECTION"; direction: MoveDirection }
  | { type: "PAUSE" }
  | { type: "RESUME" };

/** Every case calls exactly one use-case - no game rules live here. */
function reducer(state: SudokuGameState, action: Action): SudokuGameState {
  switch (action.type) {
    case "NEW_GAME":
      return startNewGame();
    case "RESTART":
      return restartGame(state);
    case "SELECT_CELL":
      return selectCell(state, action.position);
    case "DESELECT":
      return deselectCell(state);
    case "INPUT_VALUE":
      return inputValue(state, action.value);
    case "MOVE_SELECTION":
      return moveSelection(state, action.direction);
    case "PAUSE":
      return pauseGame(state);
    case "RESUME":
      return resumeGame(state);
    default:
      return state;
  }
}

/** ViewModel for Sudoku: wraps the pure use-cases in a useReducer and owns the elapsed-time timer, a presentation-only concern. */
export function useSudokuGame() {
  const [state, dispatch] = useReducer(reducer, undefined, () =>
    startNewGame(),
  );
  const { elapsedSeconds, reset: resetTimer } = useElapsedTimer(
    state.status === "playing",
  );

  return {
    board: state.board,
    status: state.status,
    selectedCell: state.selectedCell,
    errorCount: state.errorCount,
    elapsedSeconds,
    newGame: () => {
      dispatch({ type: "NEW_GAME" });
      resetTimer();
    },
    restart: () => {
      dispatch({ type: "RESTART" });
      resetTimer();
    },
    selectCell: (position: CellPosition) =>
      dispatch({ type: "SELECT_CELL", position }),
    deselect: () => dispatch({ type: "DESELECT" }),
    inputValue: (value: SudokuValue) =>
      dispatch({ type: "INPUT_VALUE", value }),
    moveSelection: (direction: MoveDirection) =>
      dispatch({ type: "MOVE_SELECTION", direction }),
    pause: () => dispatch({ type: "PAUSE" }),
    resume: () => dispatch({ type: "RESUME" }),
  };
}
