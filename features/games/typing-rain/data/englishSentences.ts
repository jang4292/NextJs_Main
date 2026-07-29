import type { TypingContent } from "../domain/typing.types";

const easySentences = [
  "Keep a steady rhythm.",
  "The sky is bright today.",
  "Small steps build skill.",
  "Type the words with care.",
  "A calm mind helps typing.",
  "The boat crosses the bay.",
  "Focus on each letter.",
  "Rain taps on the window.",
  "Practice makes speed grow.",
  "The moon lights the road.",
  "Clear input wins points.",
  "Read the line before typing.",
] as const;

const normalSentences = [
  "Every clean attempt makes the next one easier.",
  "The quiet harbor glows under the morning sun.",
  "Accuracy comes before speed in this practice.",
  "A short pause can keep your focus steady.",
  "Check each space before you finish the line.",
  "The falling card needs a wider reading lane.",
  "Mobile keyboards need patient focus handling.",
  "A missed mark becomes useful review data.",
  "The result screen shows what to practice next.",
  "Type punctuation when the rule requires it.",
  "Fast fingers still need a reliable target.",
  "The next sentence should arrive more slowly.",
] as const;

const hardSentences = [
  "Composition input should finish before scoring the answer.",
  "Background tabs must not make every target fail at once.",
  "Sentence mode limits active targets on smaller screens.",
  "Backspace corrections should not unlock the current target.",
  "Cumulative learning records reveal repeated weak spots.",
  "Whitespace rules must stay consistent across all modes.",
  "The locked target remains stable during an invalid prefix.",
  "Average input time excludes paused gameplay intervals.",
  "Recent games are stored newest first with a fixed limit.",
  "The same input engine handles words and short sentences.",
  "A precise mismatch list is enough for this MVP stage.",
  "Safe area padding keeps the dock above mobile keyboards.",
] as const;

export const englishSentences: TypingContent[] = [
  ...toContent(easySentences, "easy", "sentence-basic"),
  ...toContent(normalSentences, "normal", "sentence-practice"),
  ...toContent(hardSentences, "hard", "sentence-challenge"),
];

function toContent(
  sentences: readonly string[],
  difficulty: TypingContent["difficulty"],
  category: string,
): TypingContent[] {
  return sentences.map((text, index) => ({
    id: `en-short-sentence-${difficulty}-${String(index + 1).padStart(3, "0")}`,
    text,
    language: "en",
    type: "short-sentence",
    difficulty,
    category,
    tags: ["english", "short-sentence", difficulty],
    enabled: true,
  }));
}
