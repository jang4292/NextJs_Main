import type {
  ChinesePartOfSpeech,
  ChinesePartOfSpeechFilter,
} from "@/features/vocabulary-chinese/types/chineseVocabulary.types";

export const CHINESE_PART_OF_SPEECH_LABELS: Record<
  ChinesePartOfSpeech,
  string
> = {
  noun: "명사",
  verb: "동사",
  adjective: "형용사",
  adverb: "부사",
  pronoun: "대명사",
  numeral: "수사",
  "measure-word": "양사",
  other: "기타",
};

const FILTER_OPTIONS: { value: ChinesePartOfSpeechFilter; label: string }[] = [
  { value: "all", label: "전체" },
  { value: "noun", label: "명사" },
  { value: "verb", label: "동사" },
  { value: "adjective", label: "형용사" },
  { value: "adverb", label: "부사" },
  { value: "other", label: "기타" },
];

interface ChineseVocabularyFilterProps {
  value: ChinesePartOfSpeechFilter;
  onChange: (value: ChinesePartOfSpeechFilter) => void;
}

export function ChineseVocabularyFilter({
  value,
  onChange,
}: ChineseVocabularyFilterProps) {
  return (
    <div>
      <p className="text-sm font-semibold text-neutral-950">품사</p>
      <div
        role="group"
        aria-label="품사 필터"
        className="mt-2 flex flex-wrap gap-2"
      >
        {FILTER_OPTIONS.map((option) => {
          const isSelected = option.value === value;

          return (
            <button
              key={option.value}
              type="button"
              aria-pressed={isSelected}
              onClick={() => onChange(option.value)}
              className={`rounded-md border px-3 py-2 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 ${
                isSelected
                  ? "border-emerald-700 bg-emerald-700 text-white"
                  : "border-neutral-300 bg-white text-neutral-700 hover:border-emerald-300 hover:text-emerald-700"
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
