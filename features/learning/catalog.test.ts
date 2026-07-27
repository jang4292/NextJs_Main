import { describe, expect, it } from "vitest";
import { learningCatalog } from "./catalog";

describe("learningCatalog", () => {
  it("keeps learning ids and hrefs unique", () => {
    const ids = learningCatalog.map((item) => item.id);
    const hrefs = learningCatalog.map((item) => item.href);

    expect(new Set(ids).size).toBe(ids.length);
    expect(new Set(hrefs).size).toBe(hrefs.length);
  });

  it("points every canonical learning item to /learn", () => {
    expect(
      learningCatalog.every((item) => item.href.startsWith("/learn")),
    ).toBe(true);
  });
});
