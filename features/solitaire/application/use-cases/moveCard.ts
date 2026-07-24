import type { GameState } from "../../domain/entities/GameState";
import type { Card } from "../../domain/entities/Card";
import type { MoveSource, MoveTarget } from "../../domain/entities/Move";
import { canPlaceOnTableau } from "../../domain/rules/tableauRules";
import { canPlaceOnFoundation } from "../../domain/rules/foundationRules";
import { isGameWon } from "../../domain/services/winCheck";
import { flipTableauTop } from "./flipTableauTop";

export interface MoveResult {
  state: GameState;
  moved: boolean;
}

export function getMovingCards(state: GameState, source: MoveSource): Card[] | null {
  if (source.zone === "waste") {
    const top = state.waste[state.waste.length - 1];
    return top ? [top] : null;
  }

  const pile = state.tableau[source.column];
  if (!pile || source.cardIndex < 0 || source.cardIndex >= pile.length) return null;

  const cards = pile.slice(source.cardIndex);
  return cards.every((card) => card.faceUp) ? cards : null;
}

function removeFromSource(state: GameState, source: MoveSource): GameState {
  if (source.zone === "waste") {
    return { ...state, waste: state.waste.slice(0, -1) };
  }

  const tableau = state.tableau.map((pile, index) =>
    index === source.column ? pile.slice(0, source.cardIndex) : pile,
  );
  return flipTableauTop({ ...state, tableau }, source.column);
}

export function moveCard(state: GameState, source: MoveSource, target: MoveTarget): MoveResult {
  if (source.zone === "tableau" && target.zone === "tableau" && source.column === target.column) {
    return { state, moved: false };
  }

  const movingCards = getMovingCards(state, source);
  if (!movingCards) return { state, moved: false };

  const leadCard = movingCards[0];

  if (target.zone === "foundation") {
    if (movingCards.length !== 1) return { state, moved: false };
    if (leadCard.suit !== target.suit) return { state, moved: false };
    if (!canPlaceOnFoundation(leadCard, state.foundations[target.suit])) {
      return { state, moved: false };
    }

    const afterRemoval = removeFromSource(state, source);
    const foundations = {
      ...afterRemoval.foundations,
      [target.suit]: [...afterRemoval.foundations[target.suit], leadCard],
    };
    return { state: finalizeMove({ ...afterRemoval, foundations }), moved: true };
  }

  const targetPile = state.tableau[target.column];
  const targetTop = targetPile[targetPile.length - 1] ?? null;
  if (!canPlaceOnTableau(leadCard, targetTop)) return { state, moved: false };

  const afterRemoval = removeFromSource(state, source);
  const tableau = afterRemoval.tableau.map((pile, index) =>
    index === target.column ? [...pile, ...movingCards] : pile,
  );
  return { state: finalizeMove({ ...afterRemoval, tableau }), moved: true };
}

function finalizeMove(state: GameState): GameState {
  return isGameWon(state) ? { ...state, status: "won" } : state;
}
