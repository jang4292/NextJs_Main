import type { GameState } from "../../domain/entities/GameState";
import type { Position } from "../../domain/entities/Position";
import { isInputLocked } from "../../domain/rules/cellGuards";
import { setCellFlag } from "../../domain/services/setCellFlag";

export function toggleFlag(state: GameState, position: Position): GameState {
  if (isInputLocked(state.status)) return state;

  const board = setCellFlag(state.board, position);
  if (board === state.board) return state;

  return { ...state, board };
}
