import { describe, expect, it } from "vitest";
import { canDrawFromStock, canRecycleWaste } from "./stockRules";

describe("stockRules", () => {
  it("canDrawFromStock is true only when the stock has cards", () => {
    expect(canDrawFromStock(1)).toBe(true);
    expect(canDrawFromStock(0)).toBe(false);
  });

  it("canRecycleWaste is true only when the stock is empty and waste has cards", () => {
    expect(canRecycleWaste(0, 5)).toBe(true);
    expect(canRecycleWaste(1, 5)).toBe(false);
    expect(canRecycleWaste(0, 0)).toBe(false);
  });
});
