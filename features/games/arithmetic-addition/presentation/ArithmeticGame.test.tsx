// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import type { ArithmeticQuestion } from "../domain/arithmetic.types";
import { ArithmeticGame } from "./ArithmeticGame";

afterEach(() => {
  cleanup();
});

describe("ArithmeticGame", () => {
  it("starts the game from the start screen", async () => {
    const user = userEvent.setup();
    renderGame();

    await user.click(screen.getByRole("button", { name: "학습 시작" }));

    expect(screen.getByText("문제 1 / 2")).toBeInTheDocument();
    expect(screen.getByLabelText("1 더하기 2")).toBeInTheDocument();
  });

  it("displays number-pad input and deletes one digit", async () => {
    const user = userEvent.setup();
    renderGame();

    await startGame(user);
    await user.click(screen.getByRole("button", { name: "1 입력" }));
    await user.click(screen.getByRole("button", { name: "2 입력" }));

    expect(screen.getByLabelText("현재 입력한 답")).toHaveTextContent("12");

    await user.click(screen.getByRole("button", { name: "한 자리 지우기" }));

    expect(screen.getByLabelText("현재 입력한 답")).toHaveTextContent("1");
  });

  it("shows correct feedback after a correct answer", async () => {
    const user = userEvent.setup();
    renderGame();

    await startGame(user);
    await submitDigits(user, [3]);

    expect(screen.getByText("정답이에요!")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "다음 문제" })).toBeEnabled();
  });

  it("keeps the same question active after the first wrong answer", async () => {
    const user = userEvent.setup();
    renderGame();

    await startGame(user);
    await submitDigits(user, [4]);

    expect(screen.getByText("다시 생각해 보세요.")).toBeInTheDocument();
    expect(screen.getByLabelText("1 더하기 2")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "3 입력" })).toBeEnabled();

    await submitDigits(user, [3]);

    expect(screen.getByText("정답이에요!")).toBeInTheDocument();
  });

  it("shows the result screen after the last question is completed", async () => {
    const user = userEvent.setup();
    renderGame();

    await completeTwoCorrectQuestions(user);

    expect(screen.getByText("학습 완료")).toBeInTheDocument();
    expect(screen.getByText("처음에 맞힌 문제")).toBeInTheDocument();
    expect(screen.getByText("처음부터 모두 맞혔어요.")).toBeInTheDocument();
  });

  it("restarts from the result screen", async () => {
    const user = userEvent.setup();
    renderGame();

    await completeTwoCorrectQuestions(user);
    await user.click(screen.getByRole("button", { name: /다시 시작/ }));

    expect(screen.getByText("문제 1 / 2")).toBeInTheDocument();
    expect(screen.getByLabelText("1 더하기 2")).toBeInTheDocument();
  });

  it("starts review mode with first-try wrong questions only", async () => {
    const user = userEvent.setup();
    renderGame();

    await startGame(user);
    await submitDigits(user, [4]);
    await submitDigits(user, [3]);
    await user.click(screen.getByRole("button", { name: "다음 문제" }));
    await submitDigits(user, [7]);
    await user.click(screen.getByRole("button", { name: "결과 보기" }));
    await user.click(
      screen.getByRole("button", { name: "틀린 문제만 다시 풀기" }),
    );

    expect(screen.getByText("틀린 문제 복습")).toBeInTheDocument();
    expect(screen.getByText("문제 1 / 1")).toBeInTheDocument();
    expect(screen.getByLabelText("1 더하기 2")).toBeInTheDocument();
  });
});

function renderGame(questions = createQuestions()) {
  let currentTime = 1000;

  render(
    <ArithmeticGame
      createQuestions={() => questions}
      now={() => {
        currentTime += 1000;
        return currentTime;
      }}
    />,
  );
}

async function startGame(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByRole("button", { name: "학습 시작" }));
}

async function submitDigits(
  user: ReturnType<typeof userEvent.setup>,
  digits: number[],
) {
  for (const digit of digits) {
    await user.click(screen.getByRole("button", { name: `${digit} 입력` }));
  }
  await user.click(screen.getByRole("button", { name: "정답 확인" }));
}

async function completeTwoCorrectQuestions(
  user: ReturnType<typeof userEvent.setup>,
) {
  await startGame(user);
  await submitDigits(user, [3]);
  await user.click(screen.getByRole("button", { name: "다음 문제" }));
  await submitDigits(user, [7]);
  await user.click(screen.getByRole("button", { name: "결과 보기" }));
}

function createQuestions(): ArithmeticQuestion[] {
  return [
    {
      id: "1-2-addition",
      leftOperand: 1,
      rightOperand: 2,
      operator: "addition",
      answer: 3,
      difficulty: "easy",
    },
    {
      id: "3-4-addition",
      leftOperand: 3,
      rightOperand: 4,
      operator: "addition",
      answer: 7,
      difficulty: "medium",
    },
  ];
}
