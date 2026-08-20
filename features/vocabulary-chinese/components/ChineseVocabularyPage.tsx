"use client";

import { useState } from "react";
import { BackLink } from "@/components/navigation/BackLink";
import { ChineseVocabularyDetail } from "@/features/vocabulary-chinese/components/ChineseVocabularyDetail";
import { ChineseVocabularyFilter } from "@/features/vocabulary-chinese/components/ChineseVocabularyFilter";
import { ChineseVocabularyList } from "@/features/vocabulary-chinese/components/ChineseVocabularyList";
import { ChineseVocabularySearch } from "@/features/vocabulary-chinese/components/ChineseVocabularySearch";
import { chineseVocabularyWords } from "@/features/vocabulary-chinese/data/chineseVocabulary.data";
import type {
  ChinesePartOfSpeechFilter,
  ChineseVocabularyWord,
} from "@/features/vocabulary-chinese/types/chineseVocabulary.types";
import { filterChineseVocabulary } from "@/features/vocabulary-chinese/utils/filterChineseVocabulary";

function getNextSelectedWordId({
  words,
  currentWordId,
}: {
  words: ChineseVocabularyWord[];
  currentWordId: string | null;
}) {
  if (words.some((word) => word.id === currentWordId)) {
    return currentWordId;
  }

  return words[0]?.id ?? null;
}

export function ChineseVocabularyPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [partOfSpeechFilter, setPartOfSpeechFilter] =
    useState<ChinesePartOfSpeechFilter>("all");
  const [selectedWordId, setSelectedWordId] = useState<string | null>(
    chineseVocabularyWords[0]?.id ?? null,
  );

  const filteredWords = filterChineseVocabulary({
    words: chineseVocabularyWords,
    query: searchQuery,
    partOfSpeech: partOfSpeechFilter,
  });
  const selectedWord =
    filteredWords.find((word) => word.id === selectedWordId) ??
    filteredWords[0] ??
    null;
  const selectedIndex = selectedWord
    ? filteredWords.findIndex((word) => word.id === selectedWord.id)
    : -1;
  const previousWord =
    selectedIndex > 0 ? filteredWords[selectedIndex - 1] : null;
  const nextWord =
    selectedIndex >= 0 && selectedIndex < filteredWords.length - 1
      ? filteredWords[selectedIndex + 1]
      : null;
  const canGoPrevious = previousWord !== null;
  const canGoNext = nextWord !== null;

  function handleSearchQueryChange(nextQuery: string) {
    const nextWords = filterChineseVocabulary({
      words: chineseVocabularyWords,
      query: nextQuery,
      partOfSpeech: partOfSpeechFilter,
    });

    setSearchQuery(nextQuery);
    setSelectedWordId((currentWordId) =>
      getNextSelectedWordId({
        words: nextWords,
        currentWordId,
      }),
    );
  }

  function handlePartOfSpeechFilterChange(
    nextFilter: ChinesePartOfSpeechFilter,
  ) {
    const nextWords = filterChineseVocabulary({
      words: chineseVocabularyWords,
      query: searchQuery,
      partOfSpeech: nextFilter,
    });

    setPartOfSpeechFilter(nextFilter);
    setSelectedWordId((currentWordId) =>
      getNextSelectedWordId({
        words: nextWords,
        currentWordId,
      }),
    );
  }

  function handlePrevious() {
    if (!previousWord) {
      return;
    }

    setSelectedWordId(previousWord.id);
  }

  function handleNext() {
    if (!nextWord) {
      return;
    }

    setSelectedWordId(nextWord.id);
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 pb-24 md:pb-10">
      <BackLink href="/learn">Back to learn</BackLink>

      <header className="mb-8 border-b border-neutral-200 pb-6">
        <p className="text-sm font-semibold text-emerald-700">
          Basic Chinese Vocabulary
        </p>
        <h1 className="mt-2 text-3xl font-bold text-neutral-950 md:text-4xl">
          중국어 기초 단어 학습
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-neutral-600">
          일상에서 자주 사용하는 기초 중국어 단어 50개를 간체자, 병음, 뜻,
          예문과 함께 확인할 수 있습니다.
        </p>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-neutral-600">
          Next.js와 TypeScript로 제작한 반응형 중국어 단어 학습 페이지입니다.
          Browser Web Speech API를 활용해 단어와 예문의 중국어 발음을
          제공합니다.
        </p>
      </header>

      <section
        aria-label="중국어 단어 검색과 필터"
        className="mb-6 grid gap-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-end"
      >
        <ChineseVocabularySearch
          value={searchQuery}
          onChange={handleSearchQueryChange}
        />
        <ChineseVocabularyFilter
          value={partOfSpeechFilter}
          onChange={handlePartOfSpeechFilterChange}
        />
      </section>

      <main className="grid gap-6 lg:grid-cols-[360px_minmax(0,1fr)]">
        <ChineseVocabularyList
          words={filteredWords}
          selectedWordId={selectedWord?.id ?? null}
          onSelectWord={setSelectedWordId}
        />
        <ChineseVocabularyDetail
          word={selectedWord}
          currentPosition={selectedIndex >= 0 ? selectedIndex + 1 : 0}
          totalCount={filteredWords.length}
          previousWord={previousWord}
          nextWord={nextWord}
          canGoPrevious={canGoPrevious}
          canGoNext={canGoNext}
          onPrevious={handlePrevious}
          onNext={handleNext}
        />
      </main>
    </div>
  );
}
