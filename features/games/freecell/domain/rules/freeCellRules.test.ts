import { describe, expect, it } from "vitest";
import { card } from "../../test-utils";
import { canPlaceOnFreeCell } from "./freeCellRules";

describe("canPlaceOnFreeCell", () => {
  it("allows placing a card into an empty slot", () => {
    expect(canPlaceOnFreeCell(null)).toBe(true);
  });

  it("rejects placing a card into an occupied slot", () => {
    expect(canPlaceOnFreeCell(card("spades", 5))).toBe(false);
  });
});
