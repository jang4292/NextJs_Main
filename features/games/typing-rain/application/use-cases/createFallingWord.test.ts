import { describe, expect, it } from "vitest";
import { DIFFICULTY_CONFIGS } from "../../domain/difficulty.config";
import type { TypingContent } from "../../domain/typing.types";
import { createFallingWord } from "./createFallingWord";

describe("createFallingWord", () => {
  it("creates a word with stable metadata and bounded x position", () => {
    const word = createFallingWord({
      content,
      config: DIFFICULTY_CONFIGS.easy,
      now: 1000,
      sequence: 3,
      rng: () => 0.5,
    });

    expect(word).toMatchObject({
      id: "typing-rain-1000-3",
      contentId: "ko-word-test",
      text: "학교",
      x: 47,
      spawnedAt: 1000,
      fallDurationMs: DIFFICULTY_CONFIGS.easy.fallDurationMs,
      status: "active",
    });
  });
});

const content: TypingContent = {
  id: "ko-word-test",
  text: "학교",
  language: "ko",
  type: "word",
  difficulty: "easy",
  category: "test",
  tags: [],
  enabled: true,
};
