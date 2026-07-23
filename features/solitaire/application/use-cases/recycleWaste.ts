import type { GameState } from "../../domain/entities/GameState";
import { withFaceUp } from "../../domain/entities/Card";
import { canRecycleWaste } from "../../domain/rules/stockRules";

export function recycleWaste(state: GameState): GameState {
  if (!canRecycleWaste(state.stock.length, state.waste.length)) return state;

  const stock = [...state.waste].reverse().map((card) => withFaceUp(card, false));

  return {
    ...state,
    stock,
    waste: [],
  };
}
