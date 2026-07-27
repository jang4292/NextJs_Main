import { describe, expect, it } from "vitest";
import type { VocabularyWord } from "../../domain/entities/Vocabulary";
import {
  getNextSelectedVocabularyWordId,
  resolveVocabularySelection,
} from "./selectVocabulary";

const words: VocabularyWord[] = [
  {
    id: "alpha",
    order: 1,
    word: "apple",
    pronunciation: "apple",
    partOfSpeech: "noun",
    primaryMeaning: "사과",
    meanings: ["사과"],
    example: "An apple a day.",
    exampleTranslation: "하루 사과 하나.",
  },
  {
    id: "beta",
    order: 2,
    word: "build",
    pronunciation: "build",
    partOfSpeech: "verb",
    primaryMeaning: "짓다",
    meanings: ["짓다"],
    example: "Build an app.",
    exampleTranslation: "앱을 만들다.",
  },
];

describe("selectVocabulary", () => {
  it("resolves selected word navigation state from filters", () => {
    const selection = resolveVocabularySelection({
      words,
      query: "",
      partOfSpeech: "all",
      selectedWordId: "alpha",
    });

    expect(selection.selectedWord?.id).toBe("alpha");
    expect(selection.canGoPrevious).toBe(false);
    expect(selection.canGoNext).toBe(true);
    expect(selection.nextWord?.id).toBe("beta");
  });

  it("keeps the current word if it remains visible after filtering", () => {
    expect(
      getNextSelectedVocabularyWordId({
        words,
        query: "apple",
        partOfSpeech: "noun",
        currentWordId: "alpha",
      }),
    ).toBe("alpha");
  });

  it("selects the first visible word when the current word is filtered out", () => {
    expect(
      getNextSelectedVocabularyWordId({
        words,
        query: "",
        partOfSpeech: "verb",
        currentWordId: "alpha",
      }),
    ).toBe("beta");
  });
});
