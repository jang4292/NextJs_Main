import type { JapaneseVocabularyWord } from "@/features/vocabulary-japanese/types/japaneseVocabulary.types";
import { JapaneseVocabularyListItem } from "@/features/vocabulary-japanese/components/JapaneseVocabularyListItem";

interface JapaneseVocabularyListProps {
  words: JapaneseVocabularyWord[];
  selectedWordId: string | null;
  onSelectWord: (wordId: string) => void;
}

export function JapaneseVocabularyList({
  words,
  selectedWordId,
  onSelectWord,
}: JapaneseVocabularyListProps) {
  return (
    <section
      aria-labelledby="japanese-vocabulary-list-title"
      className="rounded-md border border-neutral-200 bg-white p-4 lg:sticky lg:top-20 lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto"
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2
          id="japanese-vocabulary-list-title"
          className="text-lg font-semibold text-neutral-950"
        >
          단어 목록
        </h2>
        <span className="text-sm text-neutral-500">{words.length}개</span>
      </div>

      {words.length === 0 ? (
        <p
          role="status"
          className="rounded-md border border-dashed border-neutral-300 px-4 py-10 text-center text-sm text-neutral-500"
        >
          검색 결과가 없습니다.
        </p>
      ) : (
        <ul aria-label="일본어 단어 목록" className="space-y-2">
          {words.map((word) => (
            <JapaneseVocabularyListItem
              key={word.id}
              word={word}
              isSelected={word.id === selectedWordId}
              onSelect={onSelectWord}
            />
          ))}
        </ul>
      )}
    </section>
  );
}
