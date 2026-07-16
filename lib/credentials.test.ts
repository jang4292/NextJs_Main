import { beforeEach, describe, expect, it } from "vitest";
import { verifyCredentials } from "./credentials";

const TEST_USERNAME = "admin";
const TEST_PASSWORD = "correct-horse-battery-staple";
// bcrypt hash of TEST_PASSWORD, generated once offline for this fixture
const TEST_PASSWORD_HASH =
  "$2b$10$8VjW5d8QN5Vi4e.l5bgiLunHH/j3b6wwAKH9satTFmD2g6ootywvC";

describe("verifyCredentials", () => {
  beforeEach(() => {
    process.env.ADMIN_USERNAME = TEST_USERNAME;
    process.env.ADMIN_PASSWORD_HASH = TEST_PASSWORD_HASH;
  });

  it("returns true for the correct username and password", async () => {
    await expect(verifyCredentials(TEST_USERNAME, TEST_PASSWORD)).resolves.toBe(
      true,
    );
  });

  it("returns false for the correct username with a wrong password", async () => {
    await expect(
      verifyCredentials(TEST_USERNAME, "wrong-password"),
    ).resolves.toBe(false);
  });

  it("returns false for the wrong username even with a matching password", async () => {
    await expect(
      verifyCredentials("someone-else", TEST_PASSWORD),
    ).resolves.toBe(false);
  });

  it("throws if ADMIN_USERNAME is not set", async () => {
    delete process.env.ADMIN_USERNAME;
    await expect(
      verifyCredentials(TEST_USERNAME, TEST_PASSWORD),
    ).rejects.toThrow();
  });

  it("throws if ADMIN_PASSWORD_HASH is not set", async () => {
    delete process.env.ADMIN_PASSWORD_HASH;
    await expect(
      verifyCredentials(TEST_USERNAME, TEST_PASSWORD),
    ).rejects.toThrow();
  });
});
