import type { Ref } from "react";
import type {
  PartOfSpeech,
  VocabularyWord,
} from "@/features/vocabulary/types/vocabulary.types";

const PART_OF_SPEECH_LABELS: Record<PartOfSpeech, string> = {
  noun: "명사",
  verb: "동사",
  adjective: "형용사",
  other: "기타",
};

interface VocabularyListItemProps {
  word: VocabularyWord;
  isSelected: boolean;
  itemRef?: Ref<HTMLButtonElement>;
  onSelect: (wordId: string) => void;
}

export function VocabularyListItem({
  word,
  isSelected,
  itemRef,
  onSelect,
}: VocabularyListItemProps) {
  return (
    <li>
      <button
        ref={itemRef}
        type="button"
        aria-pressed={isSelected}
        aria-label={`${word.word} 단어 선택`}
        onClick={() => onSelect(word.id)}
        className={`w-full rounded-md border p-4 text-left transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 ${
          isSelected
            ? "border-blue-600 bg-blue-50"
            : "border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50/50"
        }`}
      >
        <span className="flex items-start justify-between gap-3">
          <span>
            <span className="block text-base font-semibold text-gray-900">
              {word.order}. {word.word}
            </span>
            <span className="mt-1 block text-sm text-gray-600">
              {word.primaryMeaning}
            </span>
          </span>
          <span className="shrink-0 rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600">
            {PART_OF_SPEECH_LABELS[word.partOfSpeech]}
          </span>
        </span>
      </button>
    </li>
  );
}
