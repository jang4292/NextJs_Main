"use client";

import { useState } from "react";
import { BackLink } from "@/components/navigation/BackLink";
import { japaneseVocabularyWords } from "@/features/vocabulary-japanese/data/japaneseVocabulary.data";
import type {
  JapanesePartOfSpeechFilter,
  JapaneseVocabularyWord,
} from "@/features/vocabulary-japanese/types/japaneseVocabulary.types";
import { JapaneseVocabularyDetail } from "@/features/vocabulary-japanese/components/JapaneseVocabularyDetail";
import { JapaneseVocabularyFilter } from "@/features/vocabulary-japanese/components/JapaneseVocabularyFilter";
import { JapaneseVocabularyList } from "@/features/vocabulary-japanese/components/JapaneseVocabularyList";
import { JapaneseVocabularySearch } from "@/features/vocabulary-japanese/components/JapaneseVocabularySearch";
import { filterJapaneseVocabulary } from "@/features/vocabulary-japanese/utils/filterJapaneseVocabulary";

function getNextSelectedWordId({
  words,
  currentWordId,
}: {
  words: JapaneseVocabularyWord[];
  currentWordId: string | null;
}) {
  if (words.some((word) => word.id === currentWordId)) {
    return currentWordId;
  }

  return words[0]?.id ?? null;
}

export function JapaneseVocabularyPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [partOfSpeechFilter, setPartOfSpeechFilter] =
    useState<JapanesePartOfSpeechFilter>("all");
  const [selectedWordId, setSelectedWordId] = useState<string | null>(
    japaneseVocabularyWords[0]?.id ?? null,
  );

  const filteredWords = filterJapaneseVocabulary({
    words: japaneseVocabularyWords,
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
    const nextWords = filterJapaneseVocabulary({
      words: japaneseVocabularyWords,
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
    nextFilter: JapanesePartOfSpeechFilter,
  ) {
    const nextWords = filterJapaneseVocabulary({
      words: japaneseVocabularyWords,
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
          Japanese Vocabulary
        </p>
        <h1 className="mt-2 text-3xl font-bold text-neutral-950 md:text-4xl">
          일본어 기초 단어 학습
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-neutral-600">
          N5 수준의 기초 일본어 단어 50개를 한자, 히라가나, 로마자, 한국어 뜻,
          예문, 발음으로 탐색하는 MVP 학습 페이지입니다.
        </p>
      </header>

      <section
        aria-label="일본어 단어 검색과 필터"
        className="mb-6 grid gap-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-end"
      >
        <JapaneseVocabularySearch
          value={searchQuery}
          onChange={handleSearchQueryChange}
        />
        <JapaneseVocabularyFilter
          value={partOfSpeechFilter}
          onChange={handlePartOfSpeechFilterChange}
        />
      </section>

      <main className="grid gap-6 lg:grid-cols-[360px_minmax(0,1fr)]">
        <JapaneseVocabularyList
          words={filteredWords}
          selectedWordId={selectedWord?.id ?? null}
          onSelectWord={setSelectedWordId}
        />
        <JapaneseVocabularyDetail
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
