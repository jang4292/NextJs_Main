import { describe, expect, it } from "vitest";
import { card, buildGameState } from "../../test-utils";
import { moveCard } from "./moveCard";
import { createEmptyFoundations } from "../../domain/entities/GameState";

describe("moveCard: tableau -> tableau", () => {
  it("moves a valid descending, opposite-color card onto another tableau pile", () => {
    const state = buildGameState({
      tableau: [
        [card("spades", "8", true)],
        [card("hearts", "7", true)],
        [],
        [],
        [],
        [],
        [],
      ],
    });

    const result = moveCard(
      state,
      { zone: "tableau", column: 1, cardIndex: 0 },
      { zone: "tableau", column: 0 },
    );

    expect(result.moved).toBe(true);
    expect(result.state.tableau[0].map((c) => c.id)).toEqual(["8_spades", "7_hearts"]);
    expect(result.state.tableau[1]).toHaveLength(0);
  });

  it("rejects an invalid move and returns the original state unchanged", () => {
    const state = buildGameState({
      tableau: [[card("spades", "8", true)], [card("clubs", "7", true)]],
    });

    const result = moveCard(
      state,
      { zone: "tableau", column: 1, cardIndex: 0 },
      { zone: "tableau", column: 0 },
    );

    expect(result.moved).toBe(false);
    expect(result.state).toBe(state);
  });

  it("moves a whole face-up run together", () => {
    const state = buildGameState({
      tableau: [
        [card("spades", "9", true)],
        [
          card("hearts", "8", true),
          card("clubs", "7", true),
          card("diamonds", "6", true),
        ],
      ],
    });

    const result = moveCard(
      state,
      { zone: "tableau", column: 1, cardIndex: 0 },
      { zone: "tableau", column: 0 },
    );

    expect(result.moved).toBe(true);
    expect(result.state.tableau[0].map((c) => c.id)).toEqual([
      "9_spades",
      "8_hearts",
      "7_clubs",
      "6_diamonds",
    ]);
  });

  it("flips the newly exposed top card of the source column face up", () => {
    const state = buildGameState({
      tableau: [
        [card("spades", "9", true)],
        [card("diamonds", "4", false), card("hearts", "8", true)],
      ],
    });

    const result = moveCard(
      state,
      { zone: "tableau", column: 1, cardIndex: 1 },
      { zone: "tableau", column: 0 },
    );

    expect(result.moved).toBe(true);
    expect(result.state.tableau[1]).toHaveLength(1);
    expect(result.state.tableau[1][0].faceUp).toBe(true);
  });

  it("only allows a King onto an empty column", () => {
    const state = buildGameState({
      tableau: [[], [card("hearts", "Q", true)]],
    });

    const result = moveCard(
      state,
      { zone: "tableau", column: 1, cardIndex: 0 },
      { zone: "tableau", column: 0 },
    );

    expect(result.moved).toBe(false);
  });
});

describe("moveCard: waste -> tableau / foundation", () => {
  it("moves the top waste card onto a valid tableau pile", () => {
    const state = buildGameState({
      tableau: [[card("spades", "8", true)]],
      waste: [card("hearts", "9", true), card("hearts", "7", true)],
    });

    const result = moveCard(state, { zone: "waste" }, { zone: "tableau", column: 0 });

    expect(result.moved).toBe(true);
    expect(result.state.waste.map((c) => c.id)).toEqual(["9_hearts"]);
    expect(result.state.tableau[0].map((c) => c.id)).toEqual(["8_spades", "7_hearts"]);
  });

  it("moves an Ace from the waste onto an empty foundation", () => {
    const state = buildGameState({ waste: [card("spades", "A", true)] });

    const result = moveCard(state, { zone: "waste" }, { zone: "foundation", suit: "spades" });

    expect(result.moved).toBe(true);
    expect(result.state.foundations.spades.map((c) => c.id)).toEqual(["A_spades"]);
    expect(result.state.waste).toHaveLength(0);
  });
});

describe("moveCard: foundation win detection", () => {
  it("marks the game as won when the last card completes all foundations", () => {
    const foundations = createEmptyFoundations();
    const fullRun = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"] as const;
    foundations.hearts = fullRun.map((rank) => card("hearts", rank, true));
    foundations.diamonds = fullRun.map((rank) => card("diamonds", rank, true));
    foundations.clubs = fullRun.map((rank) => card("clubs", rank, true));
    foundations.spades = (
      ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q"] as const
    ).map((rank) => card("spades", rank, true));

    const state = buildGameState({
      foundations,
      waste: [card("spades", "K", true)],
    });

    const result = moveCard(state, { zone: "waste" }, { zone: "foundation", suit: "spades" });

    expect(result.moved).toBe(true);
    expect(result.state.status).toBe("won");
  });
});
