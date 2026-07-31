import { describe, expect, it } from "vitest";
import { resetGame } from "./resetGame";

describe("resetGame", () => {
  it("restores the initial game session", () => {
    expect(resetGame()).toMatchObject({
      balance: 1000,
      bet: 10,
      lastPayout: 0,
      state: { status: "ready" },
    });
  });
});
