import { describe, expect, it } from "vitest";
import {
  getLearningItemsByCategory,
  learningCatalog,
  learningCategoryLabels,
  learningCategoryOrder,
} from "./catalog";

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

  it("includes the math learning hub as the canonical math entry", () => {
    expect(learningCatalog).toContainEqual(
      expect.objectContaining({
        id: "math",
        href: "/learn/math",
        title: "Math Learning",
      }),
    );
  });

  it("groups learning content by the primary learning categories", () => {
    expect(learningCategoryOrder).toEqual(["math", "language", "writing"]);
    expect(learningCategoryLabels).toMatchObject({
      math: "Math",
      language: "Language",
      writing: "Writing",
    });
    expect(getLearningItemsByCategory("math").map((item) => item.id)).toEqual([
      "math",
    ]);
    expect(
      getLearningItemsByCategory("language").map((item) => item.id),
    ).toEqual([
      "idioms",
      "vocabulary",
      "japanese-vocabulary",
      "chinese-vocabulary",
    ]);
    expect(
      getLearningItemsByCategory("writing").map((item) => item.id),
    ).toEqual(["blog"]);
  });
});
