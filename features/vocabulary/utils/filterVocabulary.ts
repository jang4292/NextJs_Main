import type {
  PartOfSpeechFilter,
  VocabularyWord,
} from "@/features/vocabulary/types/vocabulary.types";

interface FilterVocabularyParams {
  words: VocabularyWord[];
  query: string;
  partOfSpeech: PartOfSpeechFilter;
}

export function filterVocabulary({
  words,
  query,
  partOfSpeech,
}: FilterVocabularyParams): VocabularyWord[] {
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
      word.word.toLowerCase().includes(normalizedQuery) ||
      word.primaryMeaning.toLowerCase().includes(normalizedQuery)
    );
  });
}
