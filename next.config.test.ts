import { describe, expect, it } from "vitest";
import { normalizeDevOrigin, parseAllowedDevOrigins } from "./next.config";

describe("next.config dev origins", () => {
  it("includes the default local network development origins", () => {
    expect(parseAllowedDevOrigins(undefined)).toEqual([
      "172.30.1.23",
      "172.30.1.60",
      "172.30.1.97",
    ]);
  });

  it("normalizes configured origins and removes duplicates", () => {
    expect(
      parseAllowedDevOrigins(
        "172.30.1.97, https://dev.local:3000/, 172.30.1.23",
      ),
    ).toEqual(["172.30.1.23", "172.30.1.60", "172.30.1.97", "dev.local"]);
  });

  it("normalizes hostnames, IP addresses, URLs, and empty values", () => {
    expect(normalizeDevOrigin(" 172.30.1.97:3000 ")).toBe("172.30.1.97");
    expect(normalizeDevOrigin("https://dev.local:3000/")).toBe("dev.local");
    expect(normalizeDevOrigin(" ")).toBeNull();
    expect(normalizeDevOrigin("https://%/")).toBeNull();
  });
});
