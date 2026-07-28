import type { MatchThreeConfig } from "../../config/gameConfig";
import { DEFAULT_MATCH_THREE_CONFIG } from "../../config/gameConfig";
import {
  createEmptyBoard,
  getBoardSize,
  type Board,
} from "../entities/Board";
import type { Position } from "../entities/Position";
import type { TileType } from "../entities/Tile";
import { isWithinBoard } from "../rules/positionRules";
import { hasAvailableMove } from "./availableMoveDetector";
import { findMatches } from "./matchDetector";
import { randomIndex, type Rng } from "./random";
import {
  createSequentialTileIdGenerator,
  createTile,
  type TileIdGenerator,
} from "./tileFactory";

export function generateBoard(
  config: MatchThreeConfig = DEFAULT_MATCH_THREE_CONFIG,
  rng: Rng = Math.random,
  nextId: TileIdGenerator = createSequentialTileIdGenerator(),
): Board {
  validateConfig(config);

  for (let attempt = 0; attempt < config.maxBoardGenerationAttempts; attempt++) {
    const board = createCandidateBoard(config, rng, nextId);

    if (findMatches(board).length === 0 && hasAvailableMove(board)) {
      return board;
    }
  }

  return createFallbackBoard(config, nextId);
}

function createCandidateBoard(
  config: MatchThreeConfig,
  rng: Rng,
  nextId: TileIdGenerator,
): Board {
  const board = createEmptyBoard(config.rows, config.columns);

  for (let row = 0; row < config.rows; row++) {
    for (let column = 0; column < config.columns; column++) {
      const position = { row, column };
      const tileType = pickTileTypeForPosition(board, position, config, rng);
      board[row][column] = createTile(tileType, nextId);
    }
  }

  return board;
}

function pickTileTypeForPosition(
  board: Board,
  position: Position,
  config: MatchThreeConfig,
  rng: Rng,
): TileType {
  const safeTypes = config.tileTypes.filter(
    (tileType) => !wouldCreateInitialMatch(board, position, tileType),
  );
  const candidates = safeTypes.length > 0 ? safeTypes : config.tileTypes;
  return candidates[randomIndex(candidates.length, rng)];
}

function wouldCreateInitialMatch(
  board: Board,
  position: Position,
  tileType: TileType,
): boolean {
  const leftOne = { row: position.row, column: position.column - 1 };
  const leftTwo = { row: position.row, column: position.column - 2 };
  const upOne = { row: position.row - 1, column: position.column };
  const upTwo = { row: position.row - 2, column: position.column };

  return (
    hasSameType(board, leftOne, tileType) &&
    hasSameType(board, leftTwo, tileType)
  ) || (
    hasSameType(board, upOne, tileType) &&
    hasSameType(board, upTwo, tileType)
  );
}

function hasSameType(
  board: Board,
  position: Position,
  tileType: TileType,
): boolean {
  const size = getBoardSize(board);
  return (
    isWithinBoard(position, size) &&
    board[position.row][position.column]?.type === tileType
  );
}

function createFallbackBoard(
  config: MatchThreeConfig,
  nextId: TileIdGenerator,
): Board {
  const board = createEmptyBoard(config.rows, config.columns);

  for (let row = 0; row < config.rows; row++) {
    for (let column = 0; column < config.columns; column++) {
      const typeIndex = (row * 2 + column) % config.tileTypes.length;
      board[row][column] = createTile(config.tileTypes[typeIndex], nextId);
    }
  }

  if (config.rows >= 3 && config.columns >= 3) {
    const [first, second, third] = config.tileTypes;
    board[0][0] = createTile(first, nextId);
    board[0][1] = createTile(second, nextId);
    board[0][2] = createTile(first, nextId);
    board[1][0] = createTile(third, nextId);
    board[1][1] = createTile(first, nextId);
    board[1][2] = createTile(third, nextId);
  }

  if (findMatches(board).length === 0 && hasAvailableMove(board)) {
    return board;
  }

  throw new Error("Unable to create a playable match-three board.");
}

function validateConfig(config: MatchThreeConfig) {
  if (config.rows < 3 || config.columns < 3) {
    throw new Error("Match-three boards must be at least 3 by 3.");
  }
  if (config.tileTypes.length < 3) {
    throw new Error("At least three tile types are required.");
  }
}
