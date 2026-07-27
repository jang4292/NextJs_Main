import { describe, expect, it } from "vitest";
import { toolCatalog } from "./catalog";

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
});
