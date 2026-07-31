export type ChinesePartOfSpeech =
  | "noun"
  | "verb"
  | "adjective"
  | "adverb"
  | "pronoun"
  | "numeral"
  | "measure-word"
  | "other";

export type ChinesePartOfSpeechFilter =
  "all" | "noun" | "verb" | "adjective" | "adverb" | "other";

export interface ChineseVocabularyWord {
  id: string;
  order: number;
  hanzi: string;
  pinyin: string;
  pinyinNumber: string;
  partOfSpeech: ChinesePartOfSpeech;
  primaryMeaning: string;
  meanings: string[];
  example: string;
  examplePinyin: string;
  exampleTranslation: string;
}
