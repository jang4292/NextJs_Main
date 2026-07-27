import type { GameState } from "../../domain/entities/GameState";
import { withFaceUp } from "../../domain/entities/Card";
import { canDrawFromStock } from "../../domain/rules/stockRules";

export function drawFromStock(state: GameState): GameState {
  if (!canDrawFromStock(state.stock.length)) return state;

  const stock = [...state.stock];
  const card = stock.pop();
  if (!card) return state;

  return {
    ...state,
    stock,
    waste: [...state.waste, withFaceUp(card, true)],
  };
}
