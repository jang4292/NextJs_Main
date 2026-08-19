import { englishWords } from "./englishWords";
import { englishSentences } from "./englishSentences";
import { koreanWords } from "./koreanWords";
import { koreanSentences } from "./koreanSentences";

export const typingContents = [
  ...koreanWords,
  ...englishWords,
  ...koreanSentences,
  ...englishSentences,
];
