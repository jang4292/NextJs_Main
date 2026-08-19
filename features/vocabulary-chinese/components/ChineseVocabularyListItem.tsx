import { CHINESE_PART_OF_SPEECH_LABELS } from "@/features/vocabulary-chinese/components/ChineseVocabularyFilter";
import type { ChineseVocabularyWord } from "@/features/vocabulary-chinese/types/chineseVocabulary.types";

interface ChineseVocabularyListItemProps {
  word: ChineseVocabularyWord;
  isSelected: boolean;
  onSelect: (wordId: string) => void;
}

export function ChineseVocabularyListItem({
  word,
  isSelected,
  onSelect,
}: ChineseVocabularyListItemProps) {
  return (
    <li>
      <button
        type="button"
        aria-pressed={isSelected}
        aria-label={`${word.hanzi} 단어 선택`}
        onClick={() => onSelect(word.id)}
        className={`w-full rounded-md border p-4 text-left transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 ${
          isSelected
            ? "border-emerald-700 bg-emerald-50"
            : "border-neutral-200 bg-white hover:border-emerald-300 hover:bg-emerald-50/50"
        }`}
      >
        <span className="flex items-start justify-between gap-3">
          <span className="min-w-0">
            <span className="block text-lg leading-relaxed font-semibold break-words text-neutral-950">
              {word.order}. {word.hanzi}
            </span>
            <span className="mt-1 block text-sm leading-relaxed break-words text-neutral-600">
              {word.pinyin}
            </span>
            <span className="mt-2 block text-sm break-words text-neutral-700">
              {word.primaryMeaning}
            </span>
          </span>
          <span className="shrink-0 rounded-md bg-neutral-100 px-2 py-1 text-xs font-medium text-neutral-600">
            {CHINESE_PART_OF_SPEECH_LABELS[word.partOfSpeech]}
          </span>
        </span>
      </button>
    </li>
  );
}
