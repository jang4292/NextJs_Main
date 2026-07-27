"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  getNextSelectedVocabularyWordId,
  resolveVocabularySelection,
} from "@/features/vocabulary/application/use-cases/selectVocabulary";
import { vocabularyWords } from "@/features/vocabulary/data/vocabulary.data";
import type { PartOfSpeechFilter } from "@/features/vocabulary/types/vocabulary.types";
import { VocabularyDetail } from "@/features/vocabulary/components/VocabularyDetail";
import { VocabularyFilter } from "@/features/vocabulary/components/VocabularyFilter";
import { VocabularyList } from "@/features/vocabulary/components/VocabularyList";
import { VocabularySearch } from "@/features/vocabulary/components/VocabularySearch";

type LastInteraction = "list-select" | "detail-navigation" | "programmatic";

const MOBILE_LAYOUT_QUERY = "(max-width: 1023px)";
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function isMobileVocabularyLayout() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia(MOBILE_LAYOUT_QUERY).matches
  );
}

function getScrollBehavior(): ScrollBehavior {
  if (
    typeof window !== "undefined" &&
    window.matchMedia(REDUCED_MOTION_QUERY).matches
  ) {
    return "auto";
  }

  return "smooth";
}

function focusWithoutScrolling(element: HTMLElement | null) {
  if (!element) {
    return;
  }

  element.focus({ preventScroll: true });
}

function scrollToDetail(element: HTMLElement | null) {
  if (!element) {
    return;
  }

  element.scrollIntoView({
    block: "start",
    behavior: getScrollBehavior(),
  });
  focusWithoutScrolling(element);
}

function scrollToListItem(
  element: HTMLElement | null,
  block: ScrollLogicalPosition,
) {
  if (!element) {
    return;
  }

  element.scrollIntoView({
    block,
    behavior: getScrollBehavior(),
  });
}

export function VocabularyPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [partOfSpeechFilter, setPartOfSpeechFilter] =
    useState<PartOfSpeechFilter>("all");
  const [selectedWordId, setSelectedWordId] = useState<string | null>(
    vocabularyWords[0]?.id ?? null,
  );
  const detailRef = useRef<HTMLDivElement | null>(null);
  const selectedListItemRef = useRef<HTMLButtonElement | null>(null);
  const lastInteractionRef = useRef<LastInteraction>("programmatic");

  const {
    filteredWords,
    selectedWord,
    selectedIndex,
    canGoPrevious,
    canGoNext,
    previousWord,
    nextWord,
  } = resolveVocabularySelection({
    words: vocabularyWords,
    query: searchQuery,
    partOfSpeech: partOfSpeechFilter,
    selectedWordId,
  });
  const selectedWordIdForEffect = selectedWord?.id ?? null;

  useEffect(() => {
    if (!selectedWordIdForEffect) {
      return;
    }

    const lastInteraction = lastInteractionRef.current;

    if (lastInteraction === "list-select" && isMobileVocabularyLayout()) {
      scrollToDetail(detailRef.current);
      return;
    }

    if (
      lastInteraction === "detail-navigation" &&
      !isMobileVocabularyLayout()
    ) {
      scrollToListItem(selectedListItemRef.current, "nearest");
    }
  }, [selectedWordIdForEffect]);

  function handleSearchQueryChange(nextQuery: string) {
    lastInteractionRef.current = "programmatic";
    setSearchQuery(nextQuery);
    setSelectedWordId((currentWordId) =>
      getNextSelectedVocabularyWordId({
        words: vocabularyWords,
        query: nextQuery,
        partOfSpeech: partOfSpeechFilter,
        currentWordId,
      }),
    );
  }

  function handlePartOfSpeechFilterChange(nextFilter: PartOfSpeechFilter) {
    lastInteractionRef.current = "programmatic";
    setPartOfSpeechFilter(nextFilter);
    setSelectedWordId((currentWordId) =>
      getNextSelectedVocabularyWordId({
        words: vocabularyWords,
        query: searchQuery,
        partOfSpeech: nextFilter,
        currentWordId,
      }),
    );
  }

  function handleSelectWord(wordId: string) {
    lastInteractionRef.current = "list-select";
    setSelectedWordId(wordId);

    if (wordId === selectedWordIdForEffect && isMobileVocabularyLayout()) {
      window.requestAnimationFrame(() => scrollToDetail(detailRef.current));
    }
  }

  function handlePrevious() {
    if (!canGoPrevious) {
      return;
    }

    lastInteractionRef.current = "detail-navigation";
    setSelectedWordId(filteredWords[selectedIndex - 1].id);
  }

  function handleNext() {
    if (!canGoNext) {
      return;
    }

    lastInteractionRef.current = "detail-navigation";
    setSelectedWordId(filteredWords[selectedIndex + 1].id);
  }

  function handleBackToList() {
    lastInteractionRef.current = "programmatic";
    scrollToListItem(selectedListItemRef.current, "center");
    focusWithoutScrolling(selectedListItemRef.current);
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 pb-24 md:pb-8">
      <Link
        href="/learn"
        className="mb-6 inline-block rounded-md text-sm text-blue-600 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-600"
      >
        Learn으로 돌아가기
      </Link>

      <header className="mb-8">
        <p className="text-sm font-medium text-blue-600">English Vocabulary</p>
        <h1 className="mt-2 text-3xl font-bold text-gray-900">
          영어 단어 학습
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-gray-600">
          기초 영단어 50개의 뜻, 예문, 발음을 한 화면에서 확인하는 MVP 학습
          페이지입니다.
        </p>
      </header>

      <section
        aria-label="단어 검색과 필터"
        className="mb-6 grid gap-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-end"
      >
        <VocabularySearch
          value={searchQuery}
          onChange={handleSearchQueryChange}
        />
        <VocabularyFilter
          value={partOfSpeechFilter}
          onChange={handlePartOfSpeechFilterChange}
        />
      </section>

      <main className="grid gap-6 lg:grid-cols-[360px_minmax(0,1fr)]">
        <VocabularyList
          words={filteredWords}
          selectedWordId={selectedWord?.id ?? null}
          selectedItemRef={selectedListItemRef}
          onSelectWord={handleSelectWord}
        />
        <div
          ref={detailRef}
          tabIndex={-1}
          aria-label="선택된 단어 상세 정보"
          className="scroll-mt-4 rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
          <VocabularyDetail
            word={selectedWord}
            currentPosition={selectedIndex >= 0 ? selectedIndex + 1 : 0}
            totalCount={filteredWords.length}
            previousWord={previousWord}
            nextWord={nextWord}
            canGoPrevious={canGoPrevious}
            canGoNext={canGoNext}
            onBackToList={handleBackToList}
            onPrevious={handlePrevious}
            onNext={handleNext}
          />
        </div>
      </main>
    </div>
  );
}
