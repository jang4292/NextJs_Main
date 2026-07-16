import { describe, expect, it } from "vitest";
import { shuffleArray, upgradeShuffleArray } from "./Utils";

function sortedCopy<T>(arr: T[]): T[] {
  return [...arr].sort();
}

describe.each([
  ["shuffleArray", shuffleArray],
  ["upgradeShuffleArray", upgradeShuffleArray],
])("%s", (_name, shuffle) => {
  it("returns an array with the same length and elements as the input", () => {
    const input = [1, 2, 3, 4, 5];
    const result = shuffle(input);
    expect(result).toHaveLength(input.length);
    expect(sortedCopy(result)).toEqual(sortedCopy(input));
  });

  it("does not mutate the original array", () => {
    const input = [1, 2, 3, 4, 5];
    const original = [...input];
    shuffle(input);
    expect(input).toEqual(original);
  });

  it("returns a new array reference, not the same one", () => {
    const input = [1, 2, 3];
    const result = shuffle(input);
    expect(result).not.toBe(input);
  });

  it("handles an empty array without throwing", () => {
    expect(shuffle([])).toEqual([]);
  });

  it("handles a single-element array without throwing", () => {
    expect(shuffle([42])).toEqual([42]);
  });
});
