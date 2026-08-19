import { describe, expect, it } from "vitest";
import { chineseVocabularyWords } from "@/features/vocabulary-chinese/data/chineseVocabulary.data";

describe("chineseVocabularyWords", () => {
  it("contains exactly 50 MVP words", () => {
    expect(chineseVocabularyWords).toHaveLength(50);
  });

  it("keeps ids, orders, and hanzi unique", () => {
    const ids = chineseVocabularyWords.map((word) => word.id);
    const orders = chineseVocabularyWords.map((word) => word.order);
    const hanzi = chineseVocabularyWords.map((word) => word.hanzi);

    expect(new Set(ids).size).toBe(chineseVocabularyWords.length);
    expect(new Set(orders).size).toBe(chineseVocabularyWords.length);
    expect(new Set(hanzi).size).toBe(chineseVocabularyWords.length);
  });

  it("keeps every primary meaning in the meanings list", () => {
    expect(
      chineseVocabularyWords.every((word) =>
        word.meanings.includes(word.primaryMeaning),
      ),
    ).toBe(true);
  });
});
