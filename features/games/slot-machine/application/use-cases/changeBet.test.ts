import { describe, expect, it } from "vitest";
import {
  createInitialGameSession,
  startSpinSession,
} from "../../domain/gameSession";
import type { SpinResult } from "../../domain/slot.types";
import { changeBet } from "./changeBet";

describe("changeBet", () => {
  it("increases and decreases through allowed values", () => {
    const increased = changeBet(createInitialGameSession(), "increase");
    const decreased = changeBet(increased, "decrease");

    expect(increased.bet).toBe(20);
    expect(decreased.bet).toBe(10);
  });

  it("does not move to a bet above the current balance", () => {
    const session = {
      ...createInitialGameSession(),
      balance: 20,
      bet: 20,
    };

    expect(changeBet(session, "increase").bet).toBe(20);
  });

  it("ignores changes while spinning", () => {
    const spinning = startSpinSession(
      createInitialGameSession(),
      createResult(),
      "spin-1",
    );

    expect(changeBet(spinning, "increase")).toBe(spinning);
  });
});

function createResult(): SpinResult {
  return {
    reels: [
      { top: "lemon", middle: "cherry", bottom: "bell" },
      { top: "lemon", middle: "cherry", bottom: "bell" },
      { top: "lemon", middle: "cherry", bottom: "bell" },
    ],
    stopIndexes: [0, 5, 4],
    payline: ["cherry", "cherry", "cherry"],
    isWin: true,
    winSymbol: "cherry",
    multiplier: 2,
    payout: 20,
  };
}
