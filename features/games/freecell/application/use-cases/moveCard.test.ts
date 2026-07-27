import { describe, expect, it } from "vitest";
import { card, buildGameState } from "../../test-utils";
import { moveCard, getMovingCards } from "./moveCard";

describe("getMovingCards", () => {
  it("returns null for an empty free cell", () => {
    const state = buildGameState();
    expect(
      getMovingCards(state, { type: "freeCell", slotIndex: 0 }),
    ).toBeNull();
  });

  it("returns the single card held in an occupied free cell", () => {
    const state = buildGameState({
      freeCells: [card("spades", 5), null, null, null],
    });
    expect(getMovingCards(state, { type: "freeCell", slotIndex: 0 })).toEqual([
      card("spades", 5),
    ]);
  });

  it("returns a valid alternating-color run from a tableau column", () => {
    const pile = [
      card("clubs", 10),
      card("spades", 9),
      card("hearts", 8),
      card("clubs", 7),
    ];
    const state = buildGameState({
      tableau: [pile, [], [], [], [], [], [], []],
    });
    const moving = getMovingCards(state, {
      type: "tableau",
      columnIndex: 0,
      cardIndex: 1,
    });
    expect(moving?.map((c) => c.id)).toEqual([
      card("spades", 9).id,
      card("hearts", 8).id,
      card("clubs", 7).id,
    ]);
  });

  it("returns null when the tableau suffix is not a valid sequence", () => {
    const pile = [card("clubs", 10), card("spades", 9), card("clubs", 8)];
    const state = buildGameState({
      tableau: [pile, [], [], [], [], [], [], []],
    });
    expect(
      getMovingCards(state, { type: "tableau", columnIndex: 0, cardIndex: 0 }),
    ).toBeNull();
  });

  it("returns null for a foundation source", () => {
    const state = buildGameState({
      foundations: {
        spades: [card("spades", 1)],
        hearts: [],
        diamonds: [],
        clubs: [],
      },
    });
    expect(
      getMovingCards(state, { type: "foundation", suit: "spades" }),
    ).toBeNull();
  });
});

describe("moveCard - free cell moves", () => {
  it("moves a tableau top card into an empty free cell", () => {
    const state = buildGameState({
      tableau: [[card("hearts", 5)], [], [], [], [], [], [], []],
    });
    const result = moveCard(state, {
      source: { type: "tableau", columnIndex: 0, cardIndex: 0 },
      destination: { type: "freeCell", slotIndex: 0 },
      cardIds: [card("hearts", 5).id],
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.nextState.freeCells[0]).toEqual(card("hearts", 5));
      expect(result.nextState.tableau[0]).toEqual([]);
      expect(result.nextState.moveCount).toBe(1);
    }
  });

  it("rejects moving into an occupied free cell", () => {
    const state = buildGameState({
      tableau: [[card("hearts", 5)], [], [], [], [], [], [], []],
      freeCells: [card("clubs", 2), null, null, null],
    });
    const result = moveCard(state, {
      source: { type: "tableau", columnIndex: 0, cardIndex: 0 },
      destination: { type: "freeCell", slotIndex: 0 },
      cardIds: [card("hearts", 5).id],
    });

    expect(result).toEqual({ success: false, reason: "FREECELL_OCCUPIED" });
  });

  it("rejects moving more than one card into a free cell", () => {
    const pile = [card("spades", 9), card("hearts", 8)];
    const state = buildGameState({
      tableau: [pile, [], [], [], [], [], [], []],
    });
    const result = moveCard(state, {
      source: { type: "tableau", columnIndex: 0, cardIndex: 0 },
      destination: { type: "freeCell", slotIndex: 0 },
      cardIds: [card("spades", 9).id, card("hearts", 8).id],
    });

    expect(result).toEqual({ success: false, reason: "INVALID_DESTINATION" });
  });
});

describe("moveCard - foundation moves", () => {
  it("moves an Ace onto an empty foundation", () => {
    const state = buildGameState({
      tableau: [[card("hearts", 1)], [], [], [], [], [], [], []],
    });
    const result = moveCard(state, {
      source: { type: "tableau", columnIndex: 0, cardIndex: 0 },
      destination: { type: "foundation", suit: "hearts" },
      cardIds: [card("hearts", 1).id],
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.nextState.foundations.hearts).toEqual([card("hearts", 1)]);
    }
  });

  it("rejects a non-Ace onto an empty foundation", () => {
    const state = buildGameState({
      tableau: [[card("hearts", 5)], [], [], [], [], [], [], []],
    });
    const result = moveCard(state, {
      source: { type: "tableau", columnIndex: 0, cardIndex: 0 },
      destination: { type: "foundation", suit: "hearts" },
      cardIds: [card("hearts", 5).id],
    });

    expect(result).toEqual({
      success: false,
      reason: "FOUNDATION_ORDER_MISMATCH",
    });
  });

  it("rejects placing a card from a free cell onto the wrong suit's foundation", () => {
    const state = buildGameState({
      freeCells: [card("spades", 2), null, null, null],
      foundations: {
        spades: [],
        hearts: [card("hearts", 1)],
        diamonds: [],
        clubs: [],
      },
    });
    const result = moveCard(state, {
      source: { type: "freeCell", slotIndex: 0 },
      destination: { type: "foundation", suit: "hearts" },
      cardIds: [card("spades", 2).id],
    });

    expect(result).toEqual({ success: false, reason: "INVALID_DESTINATION" });
  });

  it("increments moveCount and declares victory once the 52nd card lands", () => {
    const rank13 = Array.from({ length: 13 }, (_, i) => i + 1);
    const almostDone = {
      spades: rank13.filter((r) => r !== 13).map((r) => card("spades", r)),
      hearts: rank13.map((r) => card("hearts", r)),
      diamonds: rank13.map((r) => card("diamonds", r)),
      clubs: rank13.map((r) => card("clubs", r)),
    };
    const state = buildGameState({
      freeCells: [card("spades", 13), null, null, null],
      foundations: almostDone,
    });
    const result = moveCard(state, {
      source: { type: "freeCell", slotIndex: 0 },
      destination: { type: "foundation", suit: "spades" },
      cardIds: [card("spades", 13).id],
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.nextState.status).toBe("won");
    }
  });
});

describe("moveCard - tableau moves", () => {
  it("moves a valid alternating-color run onto a matching target", () => {
    const source = [card("clubs", 10), card("spades", 9), card("hearts", 8)];
    const target = [card("diamonds", 10)];
    const state = buildGameState({
      tableau: [source, target, [], [], [], [], [], []],
    });

    const result = moveCard(state, {
      source: { type: "tableau", columnIndex: 0, cardIndex: 1 },
      destination: { type: "tableau", columnIndex: 1, cardIndex: 0 },
      cardIds: [card("spades", 9).id, card("hearts", 8).id],
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.nextState.tableau[0]).toEqual([card("clubs", 10)]);
      expect(result.nextState.tableau[1].map((c) => c.id)).toEqual([
        card("diamonds", 10).id,
        card("spades", 9).id,
        card("hearts", 8).id,
      ]);
    }
  });

  it("rejects a same-color destination", () => {
    const state = buildGameState({
      tableau: [
        [card("spades", 7)],
        [card("clubs", 8)],
        [],
        [],
        [],
        [],
        [],
        [],
      ],
    });
    const result = moveCard(state, {
      source: { type: "tableau", columnIndex: 0, cardIndex: 0 },
      destination: { type: "tableau", columnIndex: 1, cardIndex: 0 },
      cardIds: [card("spades", 7).id],
    });

    expect(result).toEqual({ success: false, reason: "INVALID_DESTINATION" });
  });

  it("allows any card onto an empty column", () => {
    const state = buildGameState({
      tableau: [[card("spades", 7)], [], [], [], [], [], [], []],
    });
    const result = moveCard(state, {
      source: { type: "tableau", columnIndex: 0, cardIndex: 0 },
      destination: { type: "tableau", columnIndex: 1, cardIndex: 0 },
      cardIds: [card("spades", 7).id],
    });

    expect(result.success).toBe(true);
  });

  it("rejects a supermove that exceeds the calculated capacity", () => {
    // 0 empty free cells, 0 empty tableau columns -> capacity (0+1) * 2^0 = 1
    const bigRun = [card("clubs", 10), card("hearts", 9)];
    const state = buildGameState({
      tableau: [
        bigRun,
        [card("hearts", 11)],
        [card("spades", 1)],
        [card("spades", 2)],
        [card("spades", 3)],
        [card("spades", 4)],
        [card("spades", 5)],
        [card("spades", 6)],
      ],
      freeCells: [
        card("diamonds", 2),
        card("diamonds", 3),
        card("diamonds", 4),
        card("diamonds", 5),
      ],
    });
    const result = moveCard(state, {
      source: { type: "tableau", columnIndex: 0, cardIndex: 0 },
      destination: { type: "tableau", columnIndex: 1, cardIndex: 0 },
      cardIds: [card("clubs", 10).id, card("hearts", 9).id],
    });

    expect(result).toEqual({
      success: false,
      reason: "MOVE_CAPACITY_EXCEEDED",
    });
  });

  it("does not mutate the input state on failure", () => {
    const state = buildGameState({
      tableau: [
        [card("spades", 7)],
        [card("clubs", 8)],
        [],
        [],
        [],
        [],
        [],
        [],
      ],
    });
    const snapshot = JSON.parse(JSON.stringify(state));
    moveCard(state, {
      source: { type: "tableau", columnIndex: 0, cardIndex: 0 },
      destination: { type: "tableau", columnIndex: 1, cardIndex: 0 },
      cardIds: [card("spades", 7).id],
    });

    expect(state).toEqual(snapshot);
  });
});
