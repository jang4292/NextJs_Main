import { describe, expect, it } from "vitest";
import { japaneseVocabularyWords } from "@/features/vocabulary-japanese/data/japaneseVocabulary.data";

describe("japaneseVocabularyWords", () => {
  it("contains exactly 50 MVP words", () => {
    expect(japaneseVocabularyWords).toHaveLength(50);
  });

  it("keeps ids and orders unique", () => {
    const ids = japaneseVocabularyWords.map((word) => word.id);
    const orders = japaneseVocabularyWords.map((word) => word.order);

    expect(new Set(ids).size).toBe(japaneseVocabularyWords.length);
    expect(new Set(orders).size).toBe(japaneseVocabularyWords.length);
  });

  it("keeps every primary meaning in the meanings list", () => {
    expect(
      japaneseVocabularyWords.every((word) =>
        word.meanings.includes(word.primaryMeaning),
      ),
    ).toBe(true);
  });
});
