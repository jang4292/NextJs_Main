import { describe, expect, it } from "vitest";
import {
  calculateAccuracy,
  calculateCompletedCharactersPerMinute,
} from "./calculateAccuracy";

describe("calculateAccuracy", () => {
  it("returns perfect accuracy before any measured input", () => {
    expect(
      calculateAccuracy({
        typedCharacterCount: 0,
        correctCharacterCount: 0,
      }),
    ).toBe(1);
  });

  it("calculates a clamped correct-character ratio", () => {
    expect(
      calculateAccuracy({
        typedCharacterCount: 10,
        correctCharacterCount: 7,
      }),
    ).toBe(0.7);
    expect(
      calculateAccuracy({
        typedCharacterCount: 4,
        correctCharacterCount: 8,
      }),
    ).toBe(1);
  });
});

describe("calculateCompletedCharactersPerMinute", () => {
  it("calculates completed characters per minute", () => {
    expect(
      calculateCompletedCharactersPerMinute({
        correctCharacterCount: 20,
        elapsedMs: 30000,
      }),
    ).toBe(40);
  });
});
