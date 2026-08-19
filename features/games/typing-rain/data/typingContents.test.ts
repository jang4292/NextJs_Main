import { describe, expect, it } from "vitest";
import type {
  DifficultyLevel,
  LanguageType,
  PlayableContentType,
} from "../domain/typing.types";
import { typingContents } from "./typingContents";

describe("typingContents", () => {
  it("contains at least the requested MVP word counts", () => {
    expect(countBy("ko", "easy")).toBeGreaterThanOrEqual(40);
    expect(countBy("ko", "normal")).toBeGreaterThanOrEqual(35);
    expect(countBy("ko", "hard")).toBeGreaterThanOrEqual(25);
    expect(countBy("en", "easy")).toBeGreaterThanOrEqual(40);
    expect(countBy("en", "normal")).toBeGreaterThanOrEqual(35);
    expect(countBy("en", "hard")).toBeGreaterThanOrEqual(25);
    expect(typingContents).toHaveLength(272);
  });

  it("contains the requested short sentence counts", () => {
    expect(countTypeByLanguage("ko", "short-sentence")).toBeGreaterThanOrEqual(
      30,
    );
    expect(countTypeByLanguage("en", "short-sentence")).toBeGreaterThanOrEqual(
      30,
    );
  });

  it("does not duplicate ids or text within a language", () => {
    expect(new Set(typingContents.map((content) => content.id)).size).toBe(
      typingContents.length,
    );

    for (const language of ["ko", "en"] satisfies LanguageType[]) {
      const texts = typingContents
        .filter((content) => content.language === language)
        .map((content) => content.text);

      expect(new Set(texts).size).toBe(texts.length);
    }
  });
});

function countBy(language: LanguageType, difficulty: DifficultyLevel): number {
  return typingContents.filter(
    (content) =>
      content.language === language &&
      content.difficulty === difficulty &&
      content.type === "word" &&
      content.enabled,
  ).length;
}

function countTypeByLanguage(
  language: LanguageType,
  contentType: PlayableContentType,
): number {
  return typingContents.filter(
    (content) =>
      content.language === language &&
      content.type === contentType &&
      content.enabled,
  ).length;
}
