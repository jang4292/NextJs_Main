import { describe, expect, it } from "vitest";
import { rowsToBoard } from "../../test-utils";
import { collectMatchedPositions, findMatches } from "./matchDetector";

describe("findMatches", () => {
  it("finds a horizontal 3-match", () => {
    const matches = findMatches(
      rowsToBoard(["rrrse", "setao", "eotar", "taose", "aoser"]),
    );

    expect(matches).toHaveLength(1);
    expect(matches[0]).toMatchObject({
      direction: "horizontal",
      tileType: "ruby",
    });
    expect(matches[0]?.positions).toEqual([
      { row: 0, column: 0 },
      { row: 0, column: 1 },
      { row: 0, column: 2 },
    ]);
  });

  it("finds a vertical 3-match", () => {
    const matches = findMatches(
      rowsToBoard(["rseao", "rtaos", "reost", "seatr", "tosae"]),
    );

    expect(matches).toHaveLength(1);
    expect(matches[0]).toMatchObject({
      direction: "vertical",
      tileType: "ruby",
    });
    expect(matches[0]?.positions).toEqual([
      { row: 0, column: 0 },
      { row: 1, column: 0 },
      { row: 2, column: 0 },
    ]);
  });

  it("keeps 4-or-more matches as one group", () => {
    const matches = findMatches(
      rowsToBoard(["rrrrs", "setao", "eotar", "taose", "aoser"]),
    );

    expect(matches).toHaveLength(1);
    expect(matches[0]?.positions).toHaveLength(4);
  });

  it("returns no groups when there are no matches", () => {
    expect(
      findMatches(rowsToBoard(["rseao", "etosr", "aores", "sarte", "toesa"])),
    ).toEqual([]);
  });

  it("detects multiple simultaneous groups", () => {
    const matches = findMatches(
      rowsToBoard(["rrrse", "seaao", "eooar", "tttse", "aoser"]),
    );

    expect(matches.map((match) => match.tileType)).toEqual(["ruby", "topaz"]);
  });

  it("deduplicates overlapping T-shape positions", () => {
    const matches = findMatches(
      rowsToBoard(["serta", "arrrs", "tsrao", "eotsa", "taose"]),
    );
    const removed = collectMatchedPositions(matches);

    expect(matches).toHaveLength(2);
    expect(removed).toHaveLength(5);
    expect(removed).toEqual(
      expect.arrayContaining([
        { row: 0, column: 2 },
        { row: 1, column: 1 },
        { row: 1, column: 2 },
        { row: 1, column: 3 },
        { row: 2, column: 2 },
      ]),
    );
  });
});
