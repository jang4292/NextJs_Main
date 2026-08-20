import { describe, expect, it } from "vitest";
import {
  gameCatalog,
  gameCategoryLabels,
  gameCategoryOrder,
  gameSlugs,
  getGameBySlug,
  getGamesByCategory,
} from "./catalog";

describe("gameCatalog", () => {
  it("keeps game slugs and hrefs unique", () => {
    const hrefs = gameCatalog.map((game) => game.href);

    expect(new Set(gameSlugs).size).toBe(gameSlugs.length);
    expect(new Set(hrefs).size).toBe(hrefs.length);
  });

  it("resolves canonical games by slug", () => {
    expect(getGameBySlug("2048")?.href).toBe("/tools/games/2048");
    expect(getGameBySlug("match-three")?.href).toBe("/tools/games/match-three");
    expect(getGameBySlug("typing-rain")?.href).toBe("/tools/games/typing-rain");
    expect(getGameBySlug("bulls-and-cows")?.href).toBe(
      "/tools/games/bulls-and-cows",
    );
    expect(getGameBySlug("unknown")).toBeUndefined();
  });

  it("groups games by the Tools > Games hub categories", () => {
    expect(gameCategoryOrder).toEqual(["card", "puzzle", "learning", "casual"]);
    expect(gameCategoryLabels).toMatchObject({
      card: "Card",
      puzzle: "Puzzle",
      learning: "Learning",
      casual: "Casual",
    });
    expect(getGamesByCategory("card").map((game) => game.slug)).toEqual([
      "solitaire",
      "freecell",
    ]);
    expect(getGamesByCategory("puzzle").map((game) => game.slug)).toEqual([
      "2048",
      "minesweeper",
      "sudoku",
      "match-three",
      "bulls-and-cows",
    ]);
    expect(getGamesByCategory("learning").map((game) => game.slug)).toEqual([
      "arithmetic-addition",
      "typing-rain",
    ]);
    expect(getGamesByCategory("casual").map((game) => game.slug)).toEqual([
      "slot-machine",
    ]);
  });
});
