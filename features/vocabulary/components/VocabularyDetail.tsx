"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, List } from "lucide-react";
import type {
  PartOfSpeech,
  VocabularyWord,
} from "@/features/vocabulary/types/vocabulary.types";
import { isSpeechSynthesisSupported } from "@/features/vocabulary/services/speech.service";
import { SpeechButton } from "@/features/vocabulary/components/SpeechButton";

const PART_OF_SPEECH_LABELS: Record<PartOfSpeech, string> = {
  noun: "명사",
  verb: "동사",
  adjective: "형용사",
  other: "기타",
};

interface VocabularyDetailProps {
  word: VocabularyWord | null;
  currentPosition: number;
  totalCount: number;
  previousWord: VocabularyWord | null;
  nextWord: VocabularyWord | null;
  canGoPrevious: boolean;
  canGoNext: boolean;
  onBackToList: () => void;
  onPrevious: () => void;
  onNext: () => void;
}

export function VocabularyDetail({
  word,
  currentPosition,
  totalCount,
  previousWord,
  nextWord,
  canGoPrevious,
  canGoNext,
  onBackToList,
  onPrevious,
  onNext,
}: VocabularyDetailProps) {
  const [isSpeechSupported, setIsSpeechSupported] = useState<boolean | null>(
    null,
  );

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setIsSpeechSupported(isSpeechSynthesisSupported());
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, []);

  if (!word) {
    return (
      <section
        aria-labelledby="vocabulary-detail-title"
        className="rounded-lg border border-gray-200 bg-white p-6"
      >
        <h2
          id="vocabulary-detail-title"
          className="text-lg font-semibold text-gray-900"
        >
          단어 상세
        </h2>
        <p role="status" className="mt-8 text-center text-sm text-gray-500">
          선택된 단어가 없습니다.
        </p>
      </section>
    );
  }

  const secondaryMeanings = word.meanings.filter(
    (meaning) => meaning !== word.primaryMeaning,
  );
  const speechDisabled = isSpeechSupported !== true;
  const previousButtonLabel = previousWord
    ? `이전: ${previousWord.word}`
    : "이전 단어";
  const nextButtonLabel = nextWord ? `다음: ${nextWord.word}` : "다음 단어";

  return (
    <section
      aria-labelledby="vocabulary-detail-title"
      className="rounded-lg border border-gray-200 bg-white p-6"
    >
      <div className="mb-4 flex items-center justify-between gap-3 lg:hidden">
        <button
          type="button"
          aria-label={`${word.word} 단어가 있는 목록 위치로 이동`}
          onClick={onBackToList}
          className="inline-flex items-center gap-2 rounded-md border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:border-blue-300 hover:text-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
          <List aria-hidden="true" size={16} />
          단어 목록으로
        </button>
        <span className="shrink-0 text-sm font-medium text-gray-500">
          {currentPosition} / {totalCount}
        </span>
      </div>

      <div className="flex flex-col gap-4 border-b border-gray-200 pb-6 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-medium text-blue-600">
              {PART_OF_SPEECH_LABELS[word.partOfSpeech]}
            </p>
            <span className="hidden rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600 lg:inline-flex">
              {currentPosition} / {totalCount}
            </span>
          </div>
          <h2
            id="vocabulary-detail-title"
            className="mt-2 text-3xl font-bold text-gray-900"
          >
            {word.word}
          </h2>
          <p className="mt-2 text-base text-gray-500">{word.pronunciation}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <SpeechButton
            label="단어 듣기"
            text={word.word}
            disabled={speechDisabled}
          />
          <SpeechButton
            label="예문 듣기"
            text={word.example}
            disabled={speechDisabled}
          />
        </div>
      </div>

      {isSpeechSupported === false && (
        <p role="status" className="mt-4 text-sm text-red-600">
          현재 브라우저는 음성 듣기를 지원하지 않습니다.
        </p>
      )}

      <dl className="mt-6 grid gap-5">
        <div>
          <dt className="text-sm font-semibold text-gray-900">대표 뜻</dt>
          <dd className="mt-2 text-base text-gray-700">
            {word.primaryMeaning}
          </dd>
        </div>

        <div>
          <dt className="text-sm font-semibold text-gray-900">보조 뜻</dt>
          <dd className="mt-2">
            {secondaryMeanings.length > 0 ? (
              <ul className="flex flex-wrap gap-2">
                {secondaryMeanings.map((meaning) => (
                  <li
                    key={meaning}
                    className="rounded-md bg-gray-100 px-2.5 py-1 text-sm text-gray-700"
                  >
                    {meaning}
                  </li>
                ))}
              </ul>
            ) : (
              <span className="text-sm text-gray-500">보조 뜻이 없습니다.</span>
            )}
          </dd>
        </div>

        <div>
          <dt className="text-sm font-semibold text-gray-900">예문</dt>
          <dd className="mt-2 rounded-md bg-gray-50 p-4 text-base leading-relaxed text-gray-800">
            {word.example}
          </dd>
        </div>

        <div>
          <dt className="text-sm font-semibold text-gray-900">예문 번역</dt>
          <dd className="mt-2 text-sm leading-relaxed text-gray-600">
            {word.exampleTranslation}
          </dd>
        </div>
      </dl>

      <div className="mt-8 flex flex-wrap justify-between gap-3 border-t border-gray-200 pt-5">
        <button
          type="button"
          aria-label={
            previousWord ? `이전 단어 ${previousWord.word}로 이동` : "이전 단어"
          }
          disabled={!canGoPrevious}
          onClick={onPrevious}
          className="inline-flex items-center gap-2 rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:border-blue-300 hover:text-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:cursor-not-allowed disabled:border-gray-200 disabled:text-gray-400 disabled:hover:text-gray-400"
        >
          <ChevronLeft aria-hidden="true" size={16} />
          {previousButtonLabel}
        </button>
        <button
          type="button"
          aria-label={
            nextWord ? `다음 단어 ${nextWord.word}로 이동` : "다음 단어"
          }
          disabled={!canGoNext}
          onClick={onNext}
          className="inline-flex items-center gap-2 rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:border-blue-300 hover:text-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:cursor-not-allowed disabled:border-gray-200 disabled:text-gray-400 disabled:hover:text-gray-400"
        >
          {nextButtonLabel}
          <ChevronRight aria-hidden="true" size={16} />
        </button>
      </div>
    </section>
  );
}
