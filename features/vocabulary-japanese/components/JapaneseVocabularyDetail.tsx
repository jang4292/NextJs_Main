"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { JapaneseVocabularyWord } from "@/features/vocabulary-japanese/types/japaneseVocabulary.types";
import { JAPANESE_PART_OF_SPEECH_LABELS } from "@/features/vocabulary-japanese/components/JapaneseVocabularyFilter";
import { isSpeechSynthesisSupported } from "@/features/vocabulary-japanese/services/speech.service";
import { SpeechButton } from "@/features/vocabulary-japanese/components/SpeechButton";

interface JapaneseVocabularyDetailProps {
  word: JapaneseVocabularyWord | null;
  currentPosition: number;
  totalCount: number;
  previousWord: JapaneseVocabularyWord | null;
  nextWord: JapaneseVocabularyWord | null;
  canGoPrevious: boolean;
  canGoNext: boolean;
  onPrevious: () => void;
  onNext: () => void;
}

export function JapaneseVocabularyDetail({
  word,
  currentPosition,
  totalCount,
  previousWord,
  nextWord,
  canGoPrevious,
  canGoNext,
  onPrevious,
  onNext,
}: JapaneseVocabularyDetailProps) {
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
        aria-labelledby="japanese-vocabulary-detail-title"
        className="rounded-md border border-neutral-200 bg-white p-6"
      >
        <h2
          id="japanese-vocabulary-detail-title"
          className="text-lg font-semibold text-neutral-950"
        >
          단어 상세
        </h2>
        <p role="status" className="mt-8 text-center text-sm text-neutral-500">
          선택된 단어가 없습니다.
        </p>
      </section>
    );
  }

  const secondaryMeanings = word.meanings.filter(
    (meaning) => meaning !== word.primaryMeaning,
  );
  const speechDisabled = isSpeechSupported !== true;
  const speechText = word.kanji || word.kana;
  const previousButtonLabel = previousWord
    ? `이전: ${previousWord.kanji}`
    : "이전 단어";
  const nextButtonLabel = nextWord ? `다음: ${nextWord.kanji}` : "다음 단어";

  return (
    <section
      aria-labelledby="japanese-vocabulary-detail-title"
      className="rounded-md border border-neutral-200 bg-white p-6"
    >
      <div className="flex flex-col gap-4 border-b border-neutral-200 pb-6 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-medium text-emerald-700">
              {JAPANESE_PART_OF_SPEECH_LABELS[word.partOfSpeech]}
            </p>
            <span className="rounded-md bg-neutral-100 px-2 py-1 text-xs font-medium text-neutral-600">
              {currentPosition} / {totalCount}
            </span>
          </div>
          <h2
            id="japanese-vocabulary-detail-title"
            className="mt-2 text-3xl font-bold text-neutral-950"
          >
            {word.kanji}
          </h2>
          <p className="mt-2 text-xl font-semibold text-neutral-700">
            {word.kana}
          </p>
          <p className="mt-1 text-sm text-neutral-500">{word.romaji}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <SpeechButton
            label="단어 듣기"
            text={speechText}
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
          <dt className="text-sm font-semibold text-neutral-950">발음</dt>
          <dd className="mt-2 text-base text-neutral-700">
            {word.pronunciation}
          </dd>
        </div>

        <div>
          <dt className="text-sm font-semibold text-neutral-950">대표 뜻</dt>
          <dd className="mt-2 text-base text-neutral-700">
            {word.primaryMeaning}
          </dd>
        </div>

        <div>
          <dt className="text-sm font-semibold text-neutral-950">보조 뜻</dt>
          <dd className="mt-2">
            {secondaryMeanings.length > 0 ? (
              <ul className="flex flex-wrap gap-2">
                {secondaryMeanings.map((meaning) => (
                  <li
                    key={meaning}
                    className="rounded-md bg-neutral-100 px-2.5 py-1 text-sm text-neutral-700"
                  >
                    {meaning}
                  </li>
                ))}
              </ul>
            ) : (
              <span className="text-sm text-neutral-500">
                보조 뜻이 없습니다.
              </span>
            )}
          </dd>
        </div>

        <div>
          <dt className="text-sm font-semibold text-neutral-950">예문</dt>
          <dd className="mt-2 rounded-md bg-neutral-50 p-4 text-base leading-relaxed text-neutral-800">
            {word.example}
          </dd>
        </div>

        <div>
          <dt className="text-sm font-semibold text-neutral-950">예문 해석</dt>
          <dd className="mt-2 text-sm leading-relaxed text-neutral-600">
            {word.exampleTranslation}
          </dd>
        </div>
      </dl>

      <div className="mt-8 flex flex-wrap justify-between gap-3 border-t border-neutral-200 pt-5">
        <button
          type="button"
          aria-label={
            previousWord
              ? `이전 단어 ${previousWord.kanji}로 이동`
              : "이전 단어"
          }
          disabled={!canGoPrevious}
          onClick={onPrevious}
          className="inline-flex items-center gap-2 rounded-md border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 transition-colors hover:border-emerald-300 hover:text-emerald-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 disabled:cursor-not-allowed disabled:border-neutral-200 disabled:text-neutral-400 disabled:hover:text-neutral-400"
        >
          <ChevronLeft aria-hidden="true" size={16} />
          {previousButtonLabel}
        </button>
        <button
          type="button"
          aria-label={
            nextWord ? `다음 단어 ${nextWord.kanji}로 이동` : "다음 단어"
          }
          disabled={!canGoNext}
          onClick={onNext}
          className="inline-flex items-center gap-2 rounded-md border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 transition-colors hover:border-emerald-300 hover:text-emerald-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 disabled:cursor-not-allowed disabled:border-neutral-200 disabled:text-neutral-400 disabled:hover:text-neutral-400"
        >
          {nextButtonLabel}
          <ChevronRight aria-hidden="true" size={16} />
        </button>
      </div>
    </section>
  );
}
