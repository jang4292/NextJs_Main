import { describe, expect, it } from "vitest";
import { chineseVocabularyWords } from "@/features/vocabulary-chinese/data/chineseVocabulary.data";
import { filterChineseVocabulary } from "@/features/vocabulary-chinese/utils/filterChineseVocabulary";

describe("filterChineseVocabulary", () => {
  it("searches by simplified hanzi", () => {
    const results = filterChineseVocabulary({
      words: chineseVocabularyWords,
      query: "学习",
      partOfSpeech: "all",
    });

    expect(results.map((word) => word.id)).toEqual(["xuexi"]);
  });

  it("searches by primary Korean meaning", () => {
    const results = filterChineseVocabulary({
      words: chineseVocabularyWords,
      query: "친구",
      partOfSpeech: "all",
    });

    expect(results.map((word) => word.id)).toEqual(["pengyou"]);
  });

  it("searches by pinyin with tone marks", () => {
    const results = filterChineseVocabulary({
      words: chineseVocabularyWords,
      query: "xuéxí",
      partOfSpeech: "all",
    });

    expect(results.map((word) => word.id)).toEqual(["xuexi"]);
  });

  it("searches by pinyin without tone marks", () => {
    const results = filterChineseVocabulary({
      words: chineseVocabularyWords,
      query: "xuexi",
      partOfSpeech: "all",
    });

    expect(results.map((word) => word.id)).toEqual(["xuexi"]);
  });

  it("searches by numbered pinyin", () => {
    const results = filterChineseVocabulary({
      words: chineseVocabularyWords,
      query: "xue2xi2",
      partOfSpeech: "all",
    });

    expect(results.map((word) => word.id)).toEqual(["xuexi"]);
  });

  it("searches spaced pinyin variants", () => {
    const results = filterChineseVocabulary({
      words: chineseVocabularyWords,
      query: "ni3 hao3",
      partOfSpeech: "all",
    });

    expect(results.map((word) => word.id)).toEqual(["ni-hao"]);
  });

  it("does not search examples or secondary meanings", () => {
    const exampleResults = filterChineseVocabulary({
      words: chineseVocabularyWords,
      query: "苹果",
      partOfSpeech: "all",
    });
    const secondaryMeaningResults = filterChineseVocabulary({
      words: chineseVocabularyWords,
      query: "구입하다",
      partOfSpeech: "all",
    });

    expect(exampleResults).toEqual([]);
    expect(secondaryMeaningResults).toEqual([]);
  });

  it("combines search and part of speech filters", () => {
    const results = filterChineseVocabulary({
      words: chineseVocabularyWords,
      query: "学",
      partOfSpeech: "verb",
    });

    expect(results.map((word) => word.id)).toEqual(["xuexi"]);
  });

  it("groups pronouns, numerals, measure words, and other under the other filter", () => {
    const results = filterChineseVocabulary({
      words: chineseVocabularyWords,
      query: "",
      partOfSpeech: "other",
    });

    expect(results.map((word) => word.id)).toEqual([
      "ni-hao",
      "wo",
      "ni",
      "ta-male",
      "ta-female",
      "shenme",
      "nali",
      "duoshao",
      "ge",
      "yi",
    ]);
  });
});
