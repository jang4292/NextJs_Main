import { describe, expect, it } from "vitest";
import { buildGameState } from "../../test-utils";
import { undoMove, type FreecellHistory } from "./undoMove";

describe("undoMove", () => {
  it("restores the previous state and pops it off the history", () => {
    const initial = buildGameState({ moveCount: 0 });
    const afterOneMove = buildGameState({ moveCount: 1 });
    const afterTwoMoves = buildGameState({ moveCount: 2 });
    const history: FreecellHistory = {
      initial,
      current: afterTwoMoves,
      past: [initial, afterOneMove],
    };

    const undone = undoMove(history);

    expect(undone.current).toEqual(afterOneMove);
    expect(undone.past).toEqual([initial]);
  });

  it("is a no-op when there is no history to undo", () => {
    const initial = buildGameState();
    const history: FreecellHistory = { initial, current: initial, past: [] };

    expect(undoMove(history)).toEqual(history);
  });
});
