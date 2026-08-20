import { describe, expect, it } from "vitest";
import {
  getToolsByCategory,
  toolCatalog,
  toolCategoryLabels,
  toolCategoryOrder,
} from "./catalog";

describe("toolCatalog", () => {
  it("keeps tool ids and hrefs unique", () => {
    const ids = toolCatalog.map((tool) => tool.id);
    const hrefs = toolCatalog.map((tool) => tool.href);

    expect(new Set(ids).size).toBe(ids.length);
    expect(new Set(hrefs).size).toBe(hrefs.length);
  });

  it("points every canonical tool to /tools", () => {
    expect(toolCatalog.every((tool) => tool.href.startsWith("/tools"))).toBe(
      true,
    );
  });

  it("groups tools by the primary hub categories", () => {
    expect(toolCategoryOrder).toEqual(["utility", "creative", "play"]);
    expect(toolCategoryLabels).toMatchObject({
      utility: "Utility",
      creative: "Creative",
      play: "Play",
    });
    expect(getToolsByCategory("utility").map((tool) => tool.id)).toEqual([
      "media-downloader",
      "tax-calculator",
    ]);
    expect(getToolsByCategory("creative").map((tool) => tool.id)).toEqual([
      "music",
    ]);
    expect(getToolsByCategory("play").map((tool) => tool.id)).toEqual([
      "games",
    ]);
  });
});
