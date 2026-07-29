"use client";

import { Keyboard, Play, Volume2, Waves } from "lucide-react";
import { Button } from "@/components/ui/button";
import { buildHighScoreKey } from "../../application/use-cases/storage";
import { DIFFICULTY_LABELS } from "../../domain/difficulty.config";
import type {
  DifficultyLevel,
  LanguageType,
  TypingGameSettings,
  TypingGameStorage,
} from "../../domain/typing.types";

interface StartPanelProps {
  settings: TypingGameSettings;
  storage: TypingGameStorage;
  onSettingsChange: (settings: TypingGameSettings) => void;
  onPreferencesChange: (
    preferences: Partial<TypingGameStorage["preferences"]>,
  ) => void;
  onStart: () => void;
}

const LANGUAGES: Array<{ value: LanguageType; label: string }> = [
  { value: "ko", label: "한글" },
  { value: "en", label: "English" },
];

const DIFFICULTIES: DifficultyLevel[] = ["easy", "normal", "hard"];

export function StartPanel({
  settings,
  storage,
  onSettingsChange,
  onPreferencesChange,
  onStart,
}: StartPanelProps) {
  const highScore =
    storage.highScores[
      buildHighScoreKey(settings.language, settings.difficulty)
    ] ?? 0;

  return (
    <section
      className="mx-auto flex w-full max-w-[720px] flex-col gap-4 px-3 py-5 sm:px-4"
      aria-label="Typing Rain 시작"
    >
      <div className="rounded-lg border border-sky-200 bg-white p-5 shadow-sm">
        <div className="flex items-start gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-sky-100 text-sky-700">
            <Waves aria-hidden="true" />
          </span>
          <div>
            <p className="text-sm font-semibold text-sky-700">Typing Rain</p>
            <h1 className="mt-1 text-3xl font-bold tracking-normal text-neutral-950">
              떨어지는 단어를 입력해요
            </h1>
            <p className="mt-2 text-sm leading-6 text-neutral-600">
              한글과 영문 단어를 정확히 입력해 비를 걷어내는 타자 연습 게임입니다.
            </p>
          </div>
        </div>

        <dl className="mt-5 grid grid-cols-3 gap-2 text-center text-sm">
          <div className="rounded-lg bg-sky-50 p-3">
            <dt className="text-neutral-500">최고 점수</dt>
            <dd className="mt-1 font-bold text-sky-950">{highScore}</dd>
          </div>
          <div className="rounded-lg bg-emerald-50 p-3">
            <dt className="text-neutral-500">최고 콤보</dt>
            <dd className="mt-1 font-bold text-emerald-950">
              {storage.maxCombo}
            </dd>
          </div>
          <div className="rounded-lg bg-amber-50 p-3">
            <dt className="text-neutral-500">모드</dt>
            <dd className="mt-1 font-bold text-amber-950">점수 도전</dd>
          </div>
        </dl>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <fieldset className="rounded-lg border border-neutral-200 bg-white p-4">
          <legend className="text-sm font-bold text-neutral-950">언어</legend>
          <div className="mt-3 grid grid-cols-2 gap-2">
            {LANGUAGES.map((language) => (
              <Button
                key={language.value}
                type="button"
                variant={
                  settings.language === language.value ? "default" : "outline"
                }
                onClick={() =>
                  onSettingsChange({
                    ...settings,
                    language: language.value,
                  })
                }
              >
                <Keyboard aria-hidden="true" />
                {language.label}
              </Button>
            ))}
          </div>
        </fieldset>

        <fieldset className="rounded-lg border border-neutral-200 bg-white p-4">
          <legend className="text-sm font-bold text-neutral-950">난이도</legend>
          <div className="mt-3 grid grid-cols-3 gap-2">
            {DIFFICULTIES.map((difficulty) => (
              <Button
                key={difficulty}
                type="button"
                variant={
                  settings.difficulty === difficulty ? "default" : "outline"
                }
                onClick={() =>
                  onSettingsChange({
                    ...settings,
                    difficulty,
                  })
                }
                className="px-2"
              >
                {DIFFICULTY_LABELS[difficulty]}
              </Button>
            ))}
          </div>
        </fieldset>
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
        <label className="flex min-h-11 items-center gap-2 rounded-lg border border-neutral-200 bg-white px-3 text-sm font-medium text-neutral-700">
          <input
            type="checkbox"
            checked={storage.preferences.soundEnabled}
            onChange={(event) =>
              onPreferencesChange({ soundEnabled: event.currentTarget.checked })
            }
          />
          <Volume2 className="h-4 w-4" aria-hidden="true" />
          효과음
        </label>
        <label className="flex min-h-11 items-center gap-2 rounded-lg border border-neutral-200 bg-white px-3 text-sm font-medium text-neutral-700">
          <input
            type="checkbox"
            checked={storage.preferences.reduceMotion}
            onChange={(event) =>
              onPreferencesChange({ reduceMotion: event.currentTarget.checked })
            }
          />
          화면 흔들림 줄이기
        </label>
      </div>

      <Button
        type="button"
        size="lg"
        onClick={onStart}
        className="min-h-12 bg-sky-700 text-base hover:bg-sky-800"
      >
        <Play aria-hidden="true" />
        게임 시작
      </Button>
    </section>
  );
}
