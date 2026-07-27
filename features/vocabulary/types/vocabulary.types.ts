export type PartOfSpeech = "noun" | "verb" | "adjective" | "other";

export type PartOfSpeechFilter = "all" | PartOfSpeech;

export interface VocabularyWord {
  id: string;
  order: number;
  word: string;
  pronunciation: string;
  partOfSpeech: PartOfSpeech;
  primaryMeaning: string;
  meanings: string[];
  example: string;
  exampleTranslation: string;
}
