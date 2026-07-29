// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest";
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { TYPING_RAIN_STORAGE_KEY } from "../application/use-cases/storage";
import type {
  TypingContent,
  TypingGameStorageV1,
} from "../domain/typing.types";
import { TypingRainGame } from "./TypingRainGame";

let frameId = 0;
let currentTimestamp = 1000;
let frameCallbacks = new Map<number, FrameRequestCallback>();

beforeEach(() => {
  frameId = 0;
  currentTimestamp = 1000;
  frameCallbacks = new Map<number, FrameRequestCallback>();
  vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) => {
    frameId += 1;
    frameCallbacks.set(frameId, callback);
    return frameId;
  });
  vi.stubGlobal("cancelAnimationFrame", (id: number) => {
    frameCallbacks.delete(id);
  });
});

afterEach(() => {
  cleanup();
  window.localStorage.clear();
  vi.unstubAllGlobals();
});

describe("TypingRainGame", () => {
  it("starts with the saved language and difficulty", async () => {
    const user = userEvent.setup();
    window.localStorage.setItem(
      TYPING_RAIN_STORAGE_KEY,
      JSON.stringify({
        version: 1,
        highScores: { "en:hard": 450 },
        maxCombo: 4,
        preferences: {
          language: "en",
          difficulty: "hard",
          soundEnabled: true,
          reduceMotion: true,
        },
      } satisfies TypingGameStorageV1),
    );

    renderGame();

    expect(screen.getByText("Typing Rain")).toBeInTheDocument();
    expect(await screen.findByText("450")).toBeInTheDocument();
    expect(screen.getByRole("checkbox", { name: /효과음/ })).toBeChecked();
    expect(
      screen.getByRole("checkbox", { name: /화면 흔들림 줄이기/ }),
    ).toBeChecked();

    await user.click(screen.getByRole("button", { name: "게임 시작" }));
    await runNextFrame();

    expect(screen.getByText("Hard")).toBeInTheDocument();
    expect(await screen.findByText("storm")).toBeInTheDocument();
  });

  it("removes a completed word, updates score and keeps the input editable", async () => {
    const user = userEvent.setup();
    renderGame();

    await startEnglishGame(user);

    const input = screen.getByRole("textbox", { name: "현재 입력" });
    await user.type(input, "sky");

    expect(await screen.findByText("110")).toBeInTheDocument();
    expect(input).toHaveValue("");
    await waitFor(() => {
      expect(screen.queryByText("sky")).not.toBeInTheDocument();
    });
  });

  it("does not complete a Korean word until IME composition ends", async () => {
    const user = userEvent.setup();
    renderGame({ contents: [koreanContent] });

    await user.click(screen.getByRole("button", { name: "게임 시작" }));
    await runNextFrame();

    const word = await screen.findByText("가방");
    const input = screen.getByRole("textbox", { name: "현재 입력" });

    fireEvent.compositionStart(input);
    fireEvent.change(input, { target: { value: "가방" } });

    expect(word).toBeInTheDocument();
    expect(input).toHaveValue("가방");

    fireEvent.compositionEnd(input, { target: { value: "가방" } });

    expect(await screen.findByText("110")).toBeInTheDocument();
    expect(input).toHaveValue("");
  });

  it("drops health on a missed word and shows the result screen at zero health", async () => {
    const user = userEvent.setup();
    renderGame();

    await startEnglishGame(user);
    expect(await screen.findByText("sky")).toBeInTheDocument();
    await runNextFrame(600);

    expect(await screen.findByRole("heading", { name: "도전을 마쳤어요" }))
      .toBeInTheDocument();
    expect(screen.getByText("실패")).toBeInTheDocument();
    expect(screen.getByText("1개")).toBeInTheDocument();
  });

  it("prevents input matches while paused", async () => {
    const user = userEvent.setup();
    renderGame();

    await startEnglishGame(user);
    await user.click(screen.getByRole("button", { name: "일시정지" }));

    const input = screen.getByRole("textbox", { name: "현재 입력" });
    expect(screen.getByRole("dialog", { name: "일시정지" })).toBeInTheDocument();
    expect(input).toBeDisabled();

    await user.click(screen.getByRole("button", { name: "재개" }));
    expect(input).not.toBeDisabled();
  });
});

function renderGame({
  contents = [englishContent, englishHardContent],
}: {
  contents?: TypingContent[];
} = {}) {
  render(
    <TypingRainGame
      contents={contents}
      countdownMs={0}
      difficultyConfigs={{
        easy: {
          spawnIntervalMs: 120000,
          fallDurationMs: 500,
          maxActiveWords: 1,
          initialHealth: 1,
        },
        hard: {
          spawnIntervalMs: 120000,
          fallDurationMs: 500,
          maxActiveWords: 1,
          initialHealth: 1,
        },
      }}
      rng={() => 0.5}
      now={() => currentTimestamp}
    />,
  );
}

async function startEnglishGame(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByRole("button", { name: "English" }));
  await user.click(screen.getByRole("button", { name: "게임 시작" }));
  await runNextFrame();
  expect(await screen.findByText("sky")).toBeInTheDocument();
}

async function runNextFrame(stepMs = 16) {
  await act(async () => {
    const callbacks = Array.from(frameCallbacks.values());
    frameCallbacks.clear();
    currentTimestamp += stepMs;

    for (const callback of callbacks) {
      callback(currentTimestamp);
    }
  });
}

const englishContent: TypingContent = {
  id: "test-en-sky",
  text: "sky",
  language: "en",
  type: "word",
  difficulty: "easy",
  category: "test",
  tags: ["test"],
  enabled: true,
};

const englishHardContent: TypingContent = {
  id: "test-en-storm",
  text: "storm",
  language: "en",
  type: "word",
  difficulty: "hard",
  category: "test",
  tags: ["test"],
  enabled: true,
};

const koreanContent: TypingContent = {
  id: "test-ko-bag",
  text: "가방",
  language: "ko",
  type: "word",
  difficulty: "easy",
  category: "test",
  tags: ["test"],
  enabled: true,
};
