import { describe, expect, it } from "vitest";
import { card } from "../../test-utils";
import { canPlaceOnFoundation } from "./foundationRules";

describe("canPlaceOnFoundation", () => {
  it("allows an Ace onto an empty foundation", () => {
    expect(canPlaceOnFoundation(card("hearts", 1), [])).toBe(true);
  });

  it("rejects a non-Ace onto an empty foundation", () => {
    expect(canPlaceOnFoundation(card("hearts", 2), [])).toBe(false);
  });

  it("allows the next rank of the same suit", () => {
    expect(canPlaceOnFoundation(card("hearts", 2), [card("hearts", 1)])).toBe(true);
  });

  it("rejects a different suit", () => {
    expect(canPlaceOnFoundation(card("spades", 2), [card("hearts", 1)])).toBe(false);
  });

  it("rejects an out-of-order rank", () => {
    expect(canPlaceOnFoundation(card("hearts", 4), [card("hearts", 1)])).toBe(false);
  });
});
