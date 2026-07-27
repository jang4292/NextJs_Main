import type { PartOfSpeechFilter } from "@/features/vocabulary/types/vocabulary.types";

const FILTER_OPTIONS: { value: PartOfSpeechFilter; label: string }[] = [
  { value: "all", label: "전체" },
  { value: "noun", label: "명사" },
  { value: "verb", label: "동사" },
  { value: "adjective", label: "형용사" },
  { value: "other", label: "기타" },
];

interface VocabularyFilterProps {
  value: PartOfSpeechFilter;
  onChange: (value: PartOfSpeechFilter) => void;
}

export function VocabularyFilter({ value, onChange }: VocabularyFilterProps) {
  return (
    <div>
      <p className="text-sm font-semibold text-gray-900">품사</p>
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
              className={`rounded-md border px-3 py-2 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 ${
                isSelected
                  ? "border-blue-600 bg-blue-600 text-white"
                  : "border-gray-300 bg-white text-gray-700 hover:border-blue-300 hover:text-blue-700"
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
