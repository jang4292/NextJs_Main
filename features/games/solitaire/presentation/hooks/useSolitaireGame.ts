"use client";

import { useReducer } from "react";
import type { GameState } from "../../domain/entities/GameState";
import type { MoveSource, MoveTarget } from "../../domain/entities/Move";
import type { Suit } from "../../domain/value-objects/Suit";
import { startNewGame } from "../../application/use-cases/startNewGame";
import { drawFromStock } from "../../application/use-cases/drawFromStock";
import { recycleWaste } from "../../application/use-cases/recycleWaste";
import { moveCard } from "../../application/use-cases/moveCard";

export type Selection = MoveSource | null;

interface State {
  game: GameState;
  selection: Selection;
}

type Action =
  | { type: "NEW_GAME" }
  | { type: "DRAW_OR_RECYCLE" }
  | { type: "CLICK_TABLEAU"; column: number; cardIndex: number }
  | { type: "CLICK_WASTE" }
  | { type: "CLICK_FOUNDATION"; suit: Suit }
  | { type: "COMMIT_MOVE"; source: MoveSource; target: MoveTarget };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "NEW_GAME":
      return { game: startNewGame(), selection: null };

    case "DRAW_OR_RECYCLE": {
      const game =
        state.game.stock.length > 0
          ? drawFromStock(state.game)
          : recycleWaste(state.game);
      return { game, selection: null };
    }

    case "CLICK_TABLEAU": {
      const { column, cardIndex } = action;
      const clickedCard = state.game.tableau[column]?.[cardIndex];
      const clickedIsFaceUp = clickedCard?.faceUp ?? false;

      if (state.selection) {
        const result = moveCard(state.game, state.selection, {
          zone: "tableau",
          column,
        });
        if (result.moved) return { game: result.state, selection: null };
        return clickedIsFaceUp
          ? { ...state, selection: { zone: "tableau", column, cardIndex } }
          : { ...state, selection: null };
      }

      return clickedIsFaceUp
        ? { ...state, selection: { zone: "tableau", column, cardIndex } }
        : state;
    }

    case "CLICK_WASTE": {
      const topCard = state.game.waste[state.game.waste.length - 1];
      return topCard
        ? { ...state, selection: { zone: "waste" } }
        : { ...state, selection: null };
    }

    case "CLICK_FOUNDATION": {
      if (!state.selection) return state;
      const result = moveCard(state.game, state.selection, {
        zone: "foundation",
        suit: action.suit,
      });
      return result.moved
        ? { game: result.state, selection: null }
        : { ...state, selection: null };
    }

    case "COMMIT_MOVE": {
      const result = moveCard(state.game, action.source, action.target);
      return result.moved ? { game: result.state, selection: null } : state;
    }

    default:
      return state;
  }
}

export function useSolitaireGame() {
  const [state, dispatch] = useReducer(reducer, undefined, () => ({
    game: startNewGame(),
    selection: null,
  }));

  return {
    game: state.game,
    selection: state.selection,
    newGame: () => dispatch({ type: "NEW_GAME" }),
    drawOrRecycle: () => dispatch({ type: "DRAW_OR_RECYCLE" }),
    clickTableau: (column: number, cardIndex: number) =>
      dispatch({ type: "CLICK_TABLEAU", column, cardIndex }),
    clickWaste: () => dispatch({ type: "CLICK_WASTE" }),
    clickFoundation: (suit: Suit) =>
      dispatch({ type: "CLICK_FOUNDATION", suit }),
    commitMove: (source: MoveSource, target: MoveTarget) =>
      dispatch({ type: "COMMIT_MOVE", source, target }),
  };
}
