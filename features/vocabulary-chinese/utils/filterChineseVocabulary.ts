import type {
  ChinesePartOfSpeech,
  ChinesePartOfSpeechFilter,
  ChineseVocabularyWord,
} from "@/features/vocabulary-chinese/types/chineseVocabulary.types";

interface FilterChineseVocabularyParams {
  words: ChineseVocabularyWord[];
  query: string;
  partOfSpeech: ChinesePartOfSpeechFilter;
}

const OTHER_FILTER_PARTS_OF_SPEECH: ChinesePartOfSpeech[] = [
  "other",
  "pronoun",
  "numeral",
  "measure-word",
];

function removeSpaces(value: string): string {
  return value.replace(/\s+/g, "");
}

export function normalizePinyinForSearch(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ");
}

function matchesPartOfSpeechFilter(
  wordPartOfSpeech: ChinesePartOfSpeech,
  filter: ChinesePartOfSpeechFilter,
): boolean {
  if (filter === "all") {
    return true;
  }

  if (filter === "other") {
    return OTHER_FILTER_PARTS_OF_SPEECH.includes(wordPartOfSpeech);
  }

  return wordPartOfSpeech === filter;
}

function getTonelessPinyinSyllables(pinyinNumber: string): string[] {
  return pinyinNumber
    .trim()
    .toLowerCase()
    .replace(/[1-5]/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
}

function matchesPinyinQuery(
  word: ChineseVocabularyWord,
  query: string,
): boolean {
  const normalizedQuery = normalizePinyinForSearch(query);
  const compactNormalizedQuery = removeSpaces(normalizedQuery);
  const lowerQuery = query.trim().toLowerCase();
  const compactLowerQuery = removeSpaces(lowerQuery);
  const markedPinyin = word.pinyin.trim().toLowerCase();
  const numberedPinyin = word.pinyinNumber.trim().toLowerCase();
  const compactNumberedPinyin = removeSpaces(numberedPinyin);

  if (
    markedPinyin.includes(lowerQuery) ||
    numberedPinyin.includes(lowerQuery) ||
    compactNumberedPinyin.includes(compactLowerQuery)
  ) {
    return true;
  }

  const syllables = getTonelessPinyinSyllables(word.pinyinNumber);
  const syllableText = syllables.join(" ");
  const compactSyllableText = syllables.join("");

  if (normalizedQuery.includes(" ")) {
    return syllableText.includes(normalizedQuery);
  }

  if (compactSyllableText === compactNormalizedQuery) {
    return true;
  }

  return syllables.some((syllable) =>
    syllable.includes(compactNormalizedQuery),
  );
}

export function filterChineseVocabulary({
  words,
  query,
  partOfSpeech,
}: FilterChineseVocabularyParams): ChineseVocabularyWord[] {
  const normalizedQuery = query.trim().toLowerCase();

  return words.filter((word) => {
    if (!matchesPartOfSpeechFilter(word.partOfSpeech, partOfSpeech)) {
      return false;
    }

    if (!normalizedQuery) {
      return true;
    }

    return (
      word.hanzi.includes(normalizedQuery) ||
      word.primaryMeaning.trim().toLowerCase().includes(normalizedQuery) ||
      matchesPinyinQuery(word, query)
    );
  });
}
