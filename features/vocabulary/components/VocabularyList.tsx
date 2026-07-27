import type { Ref } from "react";
import type { VocabularyWord } from "@/features/vocabulary/types/vocabulary.types";
import { VocabularyListItem } from "@/features/vocabulary/components/VocabularyListItem";

interface VocabularyListProps {
  words: VocabularyWord[];
  selectedWordId: string | null;
  selectedItemRef: Ref<HTMLButtonElement>;
  onSelectWord: (wordId: string) => void;
}

export function VocabularyList({
  words,
  selectedWordId,
  selectedItemRef,
  onSelectWord,
}: VocabularyListProps) {
  return (
    <section
      aria-labelledby="vocabulary-list-title"
      className="rounded-lg border border-gray-200 bg-white p-4 lg:sticky lg:top-6 lg:max-h-[calc(100vh-3rem)] lg:overflow-y-auto"
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2
          id="vocabulary-list-title"
          className="text-lg font-semibold text-gray-900"
        >
          단어 목록
        </h2>
        <span className="text-sm text-gray-500">{words.length}개</span>
      </div>

      {words.length === 0 ? (
        <p
          role="status"
          className="rounded-md border border-dashed border-gray-300 px-4 py-10 text-center text-sm text-gray-500"
        >
          검색 결과가 없습니다.
        </p>
      ) : (
        <ul aria-label="영어 단어 목록" className="space-y-2">
          {words.map((word) => (
            <VocabularyListItem
              key={word.id}
              word={word}
              isSelected={word.id === selectedWordId}
              itemRef={word.id === selectedWordId ? selectedItemRef : undefined}
              onSelect={onSelectWord}
            />
          ))}
        </ul>
      )}
    </section>
  );
}
