"use client";

import { useEffect, useReducer } from "react";
import type { GameState } from "../../domain/entities/GameState";
import type { CardLocation } from "../../domain/entities/Move";
import { isSameLocation } from "../../domain/entities/Move";
import { startNewGame } from "../../application/use-cases/startNewGame";
import { moveCard, getMovingCards } from "../../application/use-cases/moveCard";
import {
  undoMove,
  type FreecellHistory,
} from "../../application/use-cases/undoMove";

export type Selection = CardLocation | null;

interface State {
  history: FreecellHistory;
  selection: Selection;
}

type Action =
  | { type: "NEW_GAME" }
  | { type: "RESTART" }
  | { type: "UNDO" }
  | { type: "TICK" }
  | { type: "SELECT_OR_MOVE"; location: CardLocation }
  | { type: "COMMIT_MOVE"; source: CardLocation; destination: CardLocation }
  | { type: "HYDRATE"; history: FreecellHistory };

function createInitialState(): State {
  const game = startNewGame();
  return {
    history: { current: game, initial: game, past: [] },
    selection: null,
  };
}

function hasMovableCard(game: GameState, location: CardLocation): boolean {
  return getMovingCards(game, location) !== null;
}

function applyMove(
  state: State,
  source: CardLocation,
  destination: CardLocation,
): State {
  const game = state.history.current;
  const cardIds = (getMovingCards(game, source) ?? []).map(
    (movingCard) => movingCard.id,
  );
  const result = moveCard(game, { source, destination, cardIds });

  if (!result.success) return { ...state, selection: null };

  return {
    history: {
      ...state.history,
      current: result.nextState,
      past: [...state.history.past, game],
    },
    selection: null,
  };
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "NEW_GAME": {
      const game = startNewGame();
      return {
        history: { current: game, initial: game, past: [] },
        selection: null,
      };
    }

    case "RESTART": {
      const { initial } = state.history;
      return {
        history: { current: initial, initial, past: [] },
        selection: null,
      };
    }

    case "UNDO":
      return { history: undoMove(state.history), selection: null };

    case "TICK": {
      if (state.history.current.status === "won") return state;
      return {
        ...state,
        history: {
          ...state.history,
          current: {
            ...state.history.current,
            elapsedSeconds: state.history.current.elapsedSeconds + 1,
          },
        },
      };
    }

    case "SELECT_OR_MOVE": {
      const { location } = action;
      const game = state.history.current;
      if (game.status === "won") return state;

      if (!state.selection) {
        return hasMovableCard(game, location)
          ? { ...state, selection: location }
          : state;
      }

      if (isSameLocation(state.selection, location)) {
        return { ...state, selection: null };
      }

      const next = applyMove(state, state.selection, location);
      if (next.history.current !== game) return next; // move succeeded

      return hasMovableCard(game, location)
        ? { ...state, selection: location }
        : { ...state, selection: null };
    }

    case "COMMIT_MOVE": {
      if (state.history.current.status === "won") return state;
      return applyMove(state, action.source, action.destination);
    }

    case "HYDRATE":
      return { history: action.history, selection: null };

    default:
      return state;
  }
}

export function useFreecellGame() {
  const [state, dispatch] = useReducer(reducer, undefined, createInitialState);
  const status = state.history.current.status;

  useEffect(() => {
    if (status !== "playing") return;
    const intervalId = window.setInterval(
      () => dispatch({ type: "TICK" }),
      1000,
    );
    return () => window.clearInterval(intervalId);
  }, [status]);

  return {
    game: state.history.current,
    initial: state.history.initial,
    past: state.history.past,
    selection: state.selection,
    canUndo: state.history.past.length > 0,
    newGame: () => dispatch({ type: "NEW_GAME" }),
    restart: () => dispatch({ type: "RESTART" }),
    undo: () => dispatch({ type: "UNDO" }),
    selectOrMove: (location: CardLocation) =>
      dispatch({ type: "SELECT_OR_MOVE", location }),
    commitMove: (source: CardLocation, destination: CardLocation) =>
      dispatch({ type: "COMMIT_MOVE", source, destination }),
    hydrate: (history: FreecellHistory) =>
      dispatch({ type: "HYDRATE", history }),
  };
}
