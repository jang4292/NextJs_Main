import { describe, expect, it } from "vitest";
import type { TypingContent } from "../../domain/typing.types";
import {
  getEligibleContents,
  selectTypingContent,
} from "./selectContent";

describe("selectContent", () => {
  it("filters by language, difficulty, type, enabled flag, active words, and previous id", () => {
    const eligible = getEligibleContents(contents, {
      language: "ko",
      difficulty: "easy",
      type: "word",
      activeTexts: ["하늘"],
      previousContentId: "ko-1",
    });

    expect(eligible.map((content) => content.id)).toEqual(["ko-5"]);
  });

  it("selects deterministically when rng is injected", () => {
    const selected = selectTypingContent(contents, {
      language: "ko",
      difficulty: "easy",
      activeTexts: [],
      rng: () => 0.99,
    });

    expect(selected?.id).toBe("ko-5");
  });

  it("returns null when every matching word is already active", () => {
    expect(
      selectTypingContent(contents, {
        language: "en",
        difficulty: "easy",
        activeTexts: ["sky"],
      }),
    ).toBeNull();
  });

  it("can prefer review content ids when enabled", () => {
    const selected = selectTypingContent(contents, {
      language: "ko",
      difficulty: "easy",
      activeTexts: [],
      reviewContentIds: ["ko-5"],
      reviewPriorityEnabled: true,
      rng: () => 0,
    });

    expect(selected?.id).toBe("ko-5");
  });
});

const contents: TypingContent[] = [
  content("ko-1", "바다", "ko", "easy", true),
  content("ko-2", "하늘", "ko", "easy", true),
  content("ko-3", "구름", "ko", "normal", true),
  content("ko-4", "비활성", "ko", "easy", false),
  content("ko-5", "노을", "ko", "easy", true),
  content("en-1", "sky", "en", "easy", true),
];

function content(
  id: string,
  text: string,
  language: TypingContent["language"],
  difficulty: TypingContent["difficulty"],
  enabled: boolean,
): TypingContent {
  return {
    id,
    text,
    language,
    type: "word",
    difficulty,
    category: "test",
    tags: [],
    enabled,
  };
}
