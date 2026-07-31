import { describe, expect, it } from "vitest";
import { PAYOUT_MULTIPLIERS, SLOT_SYMBOLS } from "./symbols";
import { calculatePayout } from "./calculatePayout";

describe("calculatePayout", () => {
  it("calculates each symbol payout as bet times multiplier", () => {
    for (const symbol of SLOT_SYMBOLS) {
      expect(calculatePayout([symbol, symbol, symbol], 10)).toMatchObject({
        isWin: true,
        winSymbol: symbol,
        multiplier: PAYOUT_MULTIPLIERS[symbol],
        payout: 10 * PAYOUT_MULTIPLIERS[symbol],
      });
    }
  });

  it("returns zero for non-matching paylines", () => {
    expect(calculatePayout(["cherry", "lemon", "bell"], 50)).toEqual({
      isWin: false,
      winSymbol: null,
      multiplier: 0,
      payout: 0,
    });
  });
});
