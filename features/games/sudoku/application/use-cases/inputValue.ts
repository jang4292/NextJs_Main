import type { SudokuGameState } from "../../domain/entities/GameState";
import type { SudokuValue } from "../../domain/entities/SudokuValue";
import { canEditCell, isInputLocked } from "../../domain/rules/cellGuards";
import { applyErrorFlags } from "../../domain/rules/duplicateRules";
import { isSolved } from "../../domain/services/winCheck";

/** `value: 0` clears the selected cell. */
export function inputValue(
  state: SudokuGameState,
  value: SudokuValue,
): SudokuGameState {
  if (isInputLocked(state.status) || !state.selectedCell) return state;

  const { row, column } = state.selectedCell;
  const targetCell = state.board[row][column];
  if (!canEditCell(targetCell)) return state;

  const isWrongEntry = value !== 0 && value !== targetCell.solution;

  const nextBoard = state.board.map((boardRow, rowIndex) =>
    rowIndex === row
      ? boardRow.map((cell, columnIndex) =>
          columnIndex === column ? { ...cell, value } : cell,
        )
      : boardRow,
  );
  const flaggedBoard = applyErrorFlags(nextBoard);

  return {
    ...state,
    board: flaggedBoard,
    errorCount: state.errorCount + (isWrongEntry ? 1 : 0),
    status: isSolved(flaggedBoard)
      ? "completed"
      : state.status === "ready"
        ? "playing"
        : state.status,
  };
}
