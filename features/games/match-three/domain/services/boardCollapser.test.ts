import { describe, expect, it } from "vitest";
import type { MatchThreeConfig } from "../../config/gameConfig";
import {
  boardTypes,
  fixedRng,
  rowsToBoard,
  testIdGenerator,
} from "../../test-utils";
import { collapseAndRefillBoard } from "./boardCollapser";

const TEST_CONFIG: MatchThreeConfig = {
  rows: 4,
  columns: 3,
  tileTypes: ["ruby", "sapphire", "emerald"],
  initialMoves: 10,
  targetScore: 100,
  baseScore: 10,
  maxBoardGenerationAttempts: 5,
  maxCascadeSteps: 5,
};

describe("collapseAndRefillBoard", () => {
  it("drops tiles into one empty space while preserving order", () => {
    const board = rowsToBoard(["rsa", ".se", "eto", "tao"]);

    const result = collapseAndRefillBoard(
      board,
      TEST_CONFIG,
      fixedRng([0, 0.33]),
      testIdGenerator(),
    );

    expect(boardTypes(result.board).map((row) => row[0])).toEqual([
      "r",
      "r",
      "e",
      "t",
    ]);
    expect(result.movements).toEqual(
      expect.arrayContaining([
        {
          tileId: "r-0",
          from: { row: 0, column: 0 },
          to: { row: 1, column: 0 },
        },
      ]),
    );
  });

  it("refills multiple blanks and an entirely empty column", () => {
    const board = rowsToBoard(["r.a", "..e", "e.o", "t.o"]);

    const result = collapseAndRefillBoard(
      board,
      TEST_CONFIG,
      fixedRng([0, 0.33, 0.66, 0]),
      testIdGenerator(),
    );

    expect(result.board).toHaveLength(4);
    expect(result.board.every((row) => row.every(Boolean))).toBe(true);
    expect(result.generated).toHaveLength(5);
    expect(boardTypes(result.board).map((row) => row[1])).toEqual([
      "r",
      "r",
      "s",
      "r",
    ]);
  });
});
