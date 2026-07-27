"use client";

import { useReducer, useState } from "react";
import { makeMove } from "../../application/use-cases/makeMove";
import {
  reconcileTiles,
  tilesFromBoard,
  type Tile,
} from "../../application/use-cases/reconcileTiles";
import { startNewGame } from "../../application/use-cases/startNewGame";
import type { Direction } from "../../domain/entities/Direction";
import type { GameState } from "../../domain/entities/GameState";
import { createTileIdGenerator } from "./tileIdGenerator";
import { useBestScore } from "./useBestScore";

interface UIState {
  game: GameState;
  tiles: Tile[];
}

type Action =
  | { type: "MOVE"; direction: Direction; nextId: () => string }
  | { type: "RESTART"; nextId: () => string }
  | { type: "CLEAR_TILE_FLAGS" };

function reducer(state: UIState, action: Action): UIState {
  switch (action.type) {
    case "MOVE": {
      const result = makeMove(state.game, action.direction);
      if (!result.moved) return state;
      const tiles = reconcileTiles(
        state.tiles,
        result.traces,
        result.spawned,
        action.nextId,
      );
      return { game: result.state, tiles };
    }

    case "RESTART": {
      const game = startNewGame();
      return { game, tiles: tilesFromBoard(game.board, action.nextId) };
    }

    case "CLEAR_TILE_FLAGS": {
      if (state.tiles.every((tile) => !tile.isNew && !tile.isMerged))
        return state;
      return {
        ...state,
        tiles: state.tiles.map((tile) => ({
          ...tile,
          isNew: false,
          isMerged: false,
        })),
      };
    }

    default:
      return state;
  }
}

/**
 * ViewModel for the 2048 game: wraps the pure makeMove/startNewGame use-cases
 * in a useReducer. No game rules live here or in any React component -
 * every case calls exactly one use-case.
 */
export function useGame2048() {
  const [idGen] = useState(() => createTileIdGenerator());
  const [state, dispatch] = useReducer(reducer, undefined, () => {
    const game = startNewGame();
    return { game, tiles: tilesFromBoard(game.board, idGen) };
  });
  const bestScore = useBestScore(state.game.score);

  return {
    tiles: state.tiles,
    score: state.game.score,
    bestScore,
    status: state.game.status,
    hasWon: state.game.hasWon,
    move: (direction: Direction) =>
      dispatch({ type: "MOVE", direction, nextId: idGen }),
    restart: () => dispatch({ type: "RESTART", nextId: idGen }),
    clearTileFlags: () => dispatch({ type: "CLEAR_TILE_FLAGS" }),
  };
}
