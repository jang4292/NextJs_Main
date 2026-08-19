import { describe, expect, it, vi } from "vitest";
import {
  generateSecret,
  isGameLost,
  isGameWon,
  judgeGuess,
  validateGuess,
} from "./bullsAndCowsEngine";

describe("bullsAndCowsEngine", () => {
  it("judges a perfect guess as three strikes", () => {
    expect(judgeGuess("427", "427")).toEqual({
      guess: "427",
      strikes: 3,
      balls: 0,
      isOut: false,
    });
  });

  it("judges one strike and two balls", () => {
    expect(judgeGuess("427", "472")).toMatchObject({
      strikes: 1,
      balls: 2,
      isOut: false,
    });
  });

  it("judges zero strikes and three balls", () => {
    expect(judgeGuess("427", "274")).toMatchObject({
      strikes: 0,
      balls: 3,
      isOut: false,
    });
  });

  it("judges a miss as out", () => {
    expect(judgeGuess("427", "135")).toEqual({
      guess: "135",
      strikes: 0,
      balls: 0,
      isOut: true,
    });
  });

  it("rejects duplicate digits", () => {
    expect(validateGuess("112")).toMatchObject({ valid: false });
  });

  it("rejects guesses with the wrong length", () => {
    expect(validateGuess("12")).toMatchObject({ valid: false });
  });

  it("rejects non-numeric guesses", () => {
    expect(validateGuess("abc")).toMatchObject({ valid: false });
  });

  it("rejects a leading zero", () => {
    expect(validateGuess("042")).toMatchObject({ valid: false });
  });

  it("accepts zero after the first digit", () => {
    expect(validateGuess("407")).toEqual({ valid: true });
  });

  it("detects wins and losses", () => {
    expect(isGameWon(judgeGuess("427", "427"))).toBe(true);
    expect(isGameWon(judgeGuess("427", "472"))).toBe(false);
    expect(isGameLost(10, 10)).toBe(true);
    expect(isGameLost(9, 10)).toBe(false);
  });

  it("generates unique numeric secrets that do not start with zero", () => {
    const randomSpy = vi
      .spyOn(Math, "random")
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(0);

    const secret = generateSecret();

    expect(secret).toHaveLength(3);
    expect(secret).toMatch(/^[1-9]\d{2}$/);
    expect(new Set(secret).size).toBe(3);

    randomSpy.mockRestore();
  });
});
