export type JapanesePartOfSpeech =
  "noun" | "verb" | "adjective" | "adverb" | "other";

export type JapanesePartOfSpeechFilter = "all" | JapanesePartOfSpeech;

export interface JapaneseVocabularyWord {
  id: string;
  order: number;
  kana: string;
  kanji: string;
  romaji: string;
  pronunciation: string;
  partOfSpeech: JapanesePartOfSpeech;
  primaryMeaning: string;
  meanings: string[];
  example: string;
  exampleTranslation: string;
}
