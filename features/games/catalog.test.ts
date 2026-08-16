import { describe, expect, it } from "vitest";
import { gameCatalog, gameSlugs, getGameBySlug } from "./catalog";

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
    expect(getGameBySlug("unknown")).toBeUndefined();
  });
});
