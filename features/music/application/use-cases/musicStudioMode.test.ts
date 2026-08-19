import { describe, expect, it } from "vitest";
import { resolveMusicStudioMode } from "./musicStudioMode";

describe("music studio mode aliases", () => {
  it("resolves history mode and its legacy playlist alias", () => {
    expect(resolveMusicStudioMode()).toBe("history");
    expect(resolveMusicStudioMode("history")).toBe("history");
    expect(resolveMusicStudioMode("playlist")).toBe("history");
  });

  it("resolves custom queue mode and its legacy aliases", () => {
    expect(resolveMusicStudioMode("custom")).toBe("custom");
    expect(resolveMusicStudioMode("queue")).toBe("custom");
    expect(resolveMusicStudioMode("dj")).toBe("custom");
  });

  it("resolves source player mode and its legacy JSON alias", () => {
    expect(resolveMusicStudioMode("source")).toBe("source");
    expect(resolveMusicStudioMode("json")).toBe("source");
  });
});
