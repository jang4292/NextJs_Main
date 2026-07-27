import type { Card } from "../../domain/entities/Card";
import type { GameState } from "../../domain/entities/GameState";
import type {
  CardLocation,
  MoveCommand,
  MoveResult,
} from "../../domain/entities/Move";
import { isSameLocation } from "../../domain/entities/Move";
import {
  canPlaceOnTableau,
  isValidSequence,
} from "../../domain/rules/tableauRules";
import { canPlaceOnFreeCell } from "../../domain/rules/freeCellRules";
import { canPlaceOnFoundation } from "../../domain/rules/foundationRules";
import { calculateMoveCapacity } from "../../domain/services/moveCapacity";
import { isGameWon } from "../../domain/services/winCheck";

/** Returns the card(s) that would move from `source`, or null if there is nothing movable there. */
export function getMovingCards(
  state: GameState,
  source: CardLocation,
): Card[] | null {
  if (source.type === "foundation") return null;

  if (source.type === "freeCell") {
    const slotCard = state.freeCells[source.slotIndex];
    return slotCard ? [slotCard] : null;
  }

  const pile = state.tableau[source.columnIndex];
  if (!pile || source.cardIndex < 0 || source.cardIndex >= pile.length)
    return null;

  const cards = pile.slice(source.cardIndex);
  return isValidSequence(cards) ? cards : null;
}

function countEmptyFreeCells(state: GameState): number {
  return state.freeCells.filter((slot) => slot === null).length;
}

function countEmptyTableauColumns(state: GameState): number {
  return state.tableau.filter((pile) => pile.length === 0).length;
}

function removeFromSource(
  state: GameState,
  source: CardLocation,
  count: number,
): GameState {
  if (source.type === "freeCell") {
    const freeCells = state.freeCells.map((slot, index) =>
      index === source.slotIndex ? null : slot,
    );
    return { ...state, freeCells };
  }

  if (source.type === "tableau") {
    const tableau = state.tableau.map((pile, index) =>
      index === source.columnIndex ? pile.slice(0, pile.length - count) : pile,
    );
    return { ...state, tableau };
  }

  return state; // unreachable: getMovingCards never returns cards for a foundation source
}

function finalizeMove(state: GameState): GameState {
  const moveCount = state.moveCount + 1;
  const withCount = { ...state, moveCount };
  return isGameWon(withCount) ? { ...withCount, status: "won" } : withCount;
}

export function moveCard(state: GameState, command: MoveCommand): MoveResult {
  const { source, destination } = command;

  if (isSameLocation(source, destination)) {
    return { success: false, reason: "INVALID_DESTINATION" };
  }

  const movingCards = getMovingCards(state, source);
  if (!movingCards) {
    return { success: false, reason: "INVALID_SEQUENCE" };
  }

  const leadCard = movingCards[0];

  if (destination.type === "foundation") {
    if (movingCards.length !== 1)
      return { success: false, reason: "INVALID_DESTINATION" };
    if (leadCard.suit !== destination.suit)
      return { success: false, reason: "INVALID_DESTINATION" };
    if (!canPlaceOnFoundation(leadCard, state.foundations[destination.suit])) {
      return { success: false, reason: "FOUNDATION_ORDER_MISMATCH" };
    }

    const afterRemoval = removeFromSource(state, source, movingCards.length);
    const foundations = {
      ...afterRemoval.foundations,
      [destination.suit]: [
        ...afterRemoval.foundations[destination.suit],
        leadCard,
      ],
    };
    return {
      success: true,
      nextState: finalizeMove({ ...afterRemoval, foundations }),
    };
  }

  if (destination.type === "freeCell") {
    if (movingCards.length !== 1)
      return { success: false, reason: "INVALID_DESTINATION" };
    if (!canPlaceOnFreeCell(state.freeCells[destination.slotIndex])) {
      return { success: false, reason: "FREECELL_OCCUPIED" };
    }

    const afterRemoval = removeFromSource(state, source, movingCards.length);
    const freeCells = afterRemoval.freeCells.map((slot, index) =>
      index === destination.slotIndex ? leadCard : slot,
    );
    return {
      success: true,
      nextState: finalizeMove({ ...afterRemoval, freeCells }),
    };
  }

  // destination.type === "tableau"
  const targetPile = state.tableau[destination.columnIndex];
  const targetTop = targetPile[targetPile.length - 1] ?? null;
  if (!canPlaceOnTableau(leadCard, targetTop)) {
    return { success: false, reason: "INVALID_DESTINATION" };
  }

  const destinationIsEmpty = targetPile.length === 0;
  const capacity = calculateMoveCapacity(
    countEmptyFreeCells(state),
    countEmptyTableauColumns(state),
    destinationIsEmpty,
  );
  if (movingCards.length > capacity) {
    return { success: false, reason: "MOVE_CAPACITY_EXCEEDED" };
  }

  const afterRemoval = removeFromSource(state, source, movingCards.length);
  const tableau = afterRemoval.tableau.map((pile, index) =>
    index === destination.columnIndex ? [...pile, ...movingCards] : pile,
  );
  return {
    success: true,
    nextState: finalizeMove({ ...afterRemoval, tableau }),
  };
}
