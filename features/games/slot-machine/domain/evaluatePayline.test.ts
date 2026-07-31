import { describe, expect, it } from "vitest";
import { evaluatePayline } from "./evaluatePayline";

describe("evaluatePayline", () => {
  it("marks three matching symbols as a win", () => {
    expect(evaluatePayline(["seven", "seven", "seven"])).toEqual({
      isWin: true,
      symbol: "seven",
    });
  });

  it("marks mixed symbols as no win", () => {
    expect(evaluatePayline(["cherry", "lemon", "cherry"])).toEqual({
      isWin: false,
      symbol: null,
    });
  });
});
