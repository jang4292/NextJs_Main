import { describe, expect, it } from "vitest";
import { getAdminSessionUsername } from "./adminSession";

describe("getAdminSessionUsername", () => {
  it("uses the session subject when present", () => {
    expect(getAdminSessionUsername({ sub: "admin" })).toBe("admin");
  });

  it("falls back for malformed payloads", () => {
    expect(getAdminSessionUsername({})).toBe("관리자");
  });
});
