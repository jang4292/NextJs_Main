import type { GameState } from "../../domain/entities/GameState";
import { withFaceUp } from "../../domain/entities/Card";

export function flipTableauTop(state: GameState, column: number): GameState {
  const pile = state.tableau[column];
  const topCard = pile?.[pile.length - 1];
  if (!topCard || topCard.faceUp) return state;

  const tableau = state.tableau.map((pileAt, index) =>
    index === column
      ? [...pileAt.slice(0, -1), withFaceUp(topCard, true)]
      : pileAt,
  );

  return { ...state, tableau };
}
