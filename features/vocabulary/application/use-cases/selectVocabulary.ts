import type {
  PartOfSpeechFilter,
  VocabularyWord,
} from "../../domain/entities/Vocabulary";
import { filterVocabulary } from "../../utils/filterVocabulary";

export interface VocabularySelectionParams {
  words: VocabularyWord[];
  query: string;
  partOfSpeech: PartOfSpeechFilter;
  selectedWordId: string | null;
}

export interface VocabularySelection {
  filteredWords: VocabularyWord[];
  selectedWord: VocabularyWord | null;
  selectedIndex: number;
  canGoPrevious: boolean;
  canGoNext: boolean;
  previousWord: VocabularyWord | null;
  nextWord: VocabularyWord | null;
}

export function resolveVocabularySelection({
  words,
  query,
  partOfSpeech,
  selectedWordId,
}: VocabularySelectionParams): VocabularySelection {
  const filteredWords = filterVocabulary({
    words,
    query,
    partOfSpeech,
  });
  const selectedWord =
    filteredWords.find((word) => word.id === selectedWordId) ??
    filteredWords[0] ??
    null;
  const selectedIndex = selectedWord
    ? filteredWords.findIndex((word) => word.id === selectedWord.id)
    : -1;
  const canGoPrevious = selectedIndex > 0;
  const canGoNext =
    selectedIndex >= 0 && selectedIndex < filteredWords.length - 1;

  return {
    filteredWords,
    selectedWord,
    selectedIndex,
    canGoPrevious,
    canGoNext,
    previousWord: canGoPrevious ? filteredWords[selectedIndex - 1] : null,
    nextWord: canGoNext ? filteredWords[selectedIndex + 1] : null,
  };
}

export function getNextSelectedVocabularyWordId({
  words,
  query,
  partOfSpeech,
  currentWordId,
}: {
  words: VocabularyWord[];
  query: string;
  partOfSpeech: PartOfSpeechFilter;
  currentWordId: string | null;
}): string | null {
  const filteredWords = filterVocabulary({
    words,
    query,
    partOfSpeech,
  });

  if (filteredWords.some((word) => word.id === currentWordId)) {
    return currentWordId;
  }

  return filteredWords[0]?.id ?? null;
}
