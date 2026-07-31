import { describe, expect, it } from "vitest";
import { japaneseVocabularyWords } from "@/features/vocabulary-japanese/data/japaneseVocabulary.data";
import { filterJapaneseVocabulary } from "@/features/vocabulary-japanese/utils/filterJapaneseVocabulary";

describe("filterJapaneseVocabulary", () => {
  it("searches by kanji", () => {
    const results = filterJapaneseVocabulary({
      words: japaneseVocabularyWords,
      query: "食べる",
      partOfSpeech: "all",
    });

    expect(results.map((word) => word.id)).toEqual(["taberu"]);
  });

  it("searches by kana", () => {
    const results = filterJapaneseVocabulary({
      words: japaneseVocabularyWords,
      query: "がっこう",
      partOfSpeech: "all",
    });

    expect(results.map((word) => word.id)).toEqual(["gakkou"]);
  });

  it("searches by romaji without case sensitivity", () => {
    const results = filterJapaneseVocabulary({
      words: japaneseVocabularyWords,
      query: "NIHONGO",
      partOfSpeech: "all",
    });

    expect(results.map((word) => word.id)).toEqual(["nihongo"]);
  });

  it("searches by primary Korean meaning", () => {
    const results = filterJapaneseVocabulary({
      words: japaneseVocabularyWords,
      query: "친구",
      partOfSpeech: "all",
    });

    expect(results.map((word) => word.id)).toEqual(["tomodachi"]);
  });

  it("does not search examples", () => {
    const results = filterJapaneseVocabulary({
      words: japaneseVocabularyWords,
      query: "映画",
      partOfSpeech: "all",
    });

    expect(results).toEqual([]);
  });

  it("combines search and part of speech filters", () => {
    const results = filterJapaneseVocabulary({
      words: japaneseVocabularyWords,
      query: "くる",
      partOfSpeech: "verb",
    });

    expect(results.map((word) => word.id)).toEqual(["kuru"]);
  });
});
