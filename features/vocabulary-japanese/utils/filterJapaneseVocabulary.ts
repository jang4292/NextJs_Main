import type {
  JapanesePartOfSpeechFilter,
  JapaneseVocabularyWord,
} from "@/features/vocabulary-japanese/types/japaneseVocabulary.types";

interface FilterJapaneseVocabularyParams {
  words: JapaneseVocabularyWord[];
  query: string;
  partOfSpeech: JapanesePartOfSpeechFilter;
}

export function filterJapaneseVocabulary({
  words,
  query,
  partOfSpeech,
}: FilterJapaneseVocabularyParams): JapaneseVocabularyWord[] {
  const normalizedQuery = query.trim().toLowerCase();

  return words.filter((word) => {
    const matchesPartOfSpeech =
      partOfSpeech === "all" || word.partOfSpeech === partOfSpeech;

    if (!matchesPartOfSpeech) {
      return false;
    }

    if (!normalizedQuery) {
      return true;
    }

    return (
      word.kanji.includes(normalizedQuery) ||
      word.kana.includes(normalizedQuery) ||
      word.romaji.toLowerCase().includes(normalizedQuery) ||
      word.primaryMeaning.includes(normalizedQuery)
    );
  });
}
