import { describe, expect, it } from "vitest";
import {
  assertAllowedBet,
  canCoverBet,
  getAffordableBetOptions,
  getNextBet,
  isAllowedBet,
} from "./betting";

describe("betting", () => {
  it("moves between allowed bet values within the current balance", () => {
    expect(getNextBet(10, "increase", 1000)).toBe(20);
    expect(getNextBet(50, "increase", 60)).toBe(50);
    expect(getNextBet(20, "decrease", 1000)).toBe(10);
    expect(getNextBet(10, "decrease", 1000)).toBe(10);
  });

  it("filters out bets above the balance", () => {
    expect(getAffordableBetOptions(25)).toEqual([10, 20]);
    expect(getAffordableBetOptions(9)).toEqual([]);
  });

  it("validates supported bet values", () => {
    expect(isAllowedBet(20)).toBe(true);
    expect(isAllowedBet(30)).toBe(false);
    expect(() => assertAllowedBet(30)).toThrow("Unsupported bet value: 30.");
  });

  it("requires the balance to cover the bet", () => {
    expect(canCoverBet(100, 100)).toBe(true);
    expect(canCoverBet(90, 100)).toBe(false);
    expect(canCoverBet(100, 30)).toBe(false);
  });
});
