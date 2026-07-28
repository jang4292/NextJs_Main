import { describe, expect, it } from "vitest";
import { DEFAULT_MATCH_THREE_CONFIG } from "../../config/gameConfig";
import { fixedRng, testIdGenerator } from "../../test-utils";
import { hasAvailableMove } from "./availableMoveDetector";
import { generateBoard } from "./boardGenerator";
import { findMatches } from "./matchDetector";

describe("generateBoard", () => {
  it("creates a board with the configured size and tile types", () => {
    const board = generateBoard(
      DEFAULT_MATCH_THREE_CONFIG,
      fixedRng([0.1, 0.4, 0.8, 0.2]),
      testIdGenerator(),
    );

    expect(board).toHaveLength(DEFAULT_MATCH_THREE_CONFIG.rows);
    expect(board[0]).toHaveLength(DEFAULT_MATCH_THREE_CONFIG.columns);
    expect(
      board.every((row) =>
        row.every(
          (tile) =>
            tile !== null &&
            DEFAULT_MATCH_THREE_CONFIG.tileTypes.includes(tile.type),
        ),
      ),
    ).toBe(true);
  });

  it("does not start with automatic matches and has a valid move", () => {
    const board = generateBoard(
      DEFAULT_MATCH_THREE_CONFIG,
      fixedRng([0]),
      testIdGenerator(),
    );

    expect(findMatches(board)).toEqual([]);
    expect(hasAvailableMove(board)).toBe(true);
  });
});
