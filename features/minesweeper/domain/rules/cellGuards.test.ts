import { describe, expect, it } from "vitest";
import { createEmptyBoard } from "../entities/Board";
import { canReveal, canToggleFlag, isInputLocked } from "./cellGuards";

describe("canReveal", () => {
  it("is true for a closed, unflagged cell", () => {
    const [[cell]] = createEmptyBoard(1, 1);
    expect(canReveal(cell)).toBe(true);
  });

  it("is false for an already-revealed cell", () => {
    const [[cell]] = createEmptyBoard(1, 1);
    cell.isRevealed = true;
    expect(canReveal(cell)).toBe(false);
  });

  it("is false for a flagged cell", () => {
    const [[cell]] = createEmptyBoard(1, 1);
    cell.isFlagged = true;
    expect(canReveal(cell)).toBe(false);
  });
});

describe("canToggleFlag", () => {
  it("is true for a closed cell", () => {
    const [[cell]] = createEmptyBoard(1, 1);
    expect(canToggleFlag(cell)).toBe(true);
  });

  it("is false for a revealed cell", () => {
    const [[cell]] = createEmptyBoard(1, 1);
    cell.isRevealed = true;
    expect(canToggleFlag(cell)).toBe(false);
  });
});

describe("isInputLocked", () => {
  it("locks on won and lost", () => {
    expect(isInputLocked("won")).toBe(true);
    expect(isInputLocked("lost")).toBe(true);
  });

  it("stays unlocked on ready and playing", () => {
    expect(isInputLocked("ready")).toBe(false);
    expect(isInputLocked("playing")).toBe(false);
  });
});
