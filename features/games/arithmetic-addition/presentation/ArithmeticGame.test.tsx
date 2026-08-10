// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest";
import {
  cleanup,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import { STORAGE_KEY } from "../application/use-cases/learningStorage";
import type { ArithmeticQuestion } from "../domain/arithmetic.types";
import { ArithmeticGame } from "./ArithmeticGame";

afterEach(() => {
  cleanup();
  window.localStorage.clear();
});

describe("ArithmeticGame", () => {
  it("starts a stage from the arithmetic home screen", async () => {
    const user = userEvent.setup();
    renderGame();

    expect(screen.getByRole("heading", { name: "오늘의 연산을 골라요" }))
      .toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /덧셈/ }));

    expect(screen.getByRole("heading", { name: "기초" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "숙련" })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "응용" }))
      .not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /5 이하 덧셈/ }));

    expect(screen.getByText("문제 1 / 2")).toBeInTheDocument();
    expect(screen.getByLabelText("1 더하기 2")).toBeInTheDocument();
  });

  it("keeps mixed practice disabled on the home screen", async () => {
    const user = userEvent.setup();
    renderGame();

    const unavailableOperation = screen.getByRole("button", { name: /혼합/ });

    expect(unavailableOperation).toBeDisabled();
    await user.click(unavailableOperation);
    expect(screen.getByRole("heading", { name: "오늘의 연산을 골라요" }))
      .toBeInTheDocument();
  });

  it("displays number-pad input and deletes one digit", async () => {
    const user = userEvent.setup();
    renderGame();

    await startAdditionStage(user);
    await user.click(screen.getByRole("button", { name: "1 입력" }));
    await user.click(screen.getByRole("button", { name: "2 입력" }));

    expect(screen.getByLabelText("현재 입력한 답")).toHaveTextContent("12");

    await user.click(screen.getByRole("button", { name: "한 자리 지우기" }));

    expect(screen.getByLabelText("현재 입력한 답")).toHaveTextContent("1");
  });

  it("accepts keyboard input while a question is active", async () => {
    const user = userEvent.setup();
    renderGame();

    await startAdditionStage(user);
    await user.keyboard("3");
    await user.keyboard("{Enter}");

    expect(screen.getByText("정답이에요!")).toBeInTheDocument();
  });

  it("shows correct feedback after a correct answer", async () => {
    const user = userEvent.setup();
    renderGame();

    await startAdditionStage(user);
    await submitDigits(user, [3]);

    expect(screen.getByText("정답이에요!")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "다음 문제" })).toBeEnabled();
  });

  it("keeps the same question active after the first wrong answer", async () => {
    const user = userEvent.setup();
    renderGame();

    await startAdditionStage(user);
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

    expect(await screen.findByText("학습 완료")).toBeInTheDocument();
    expect(screen.getByText("처음에 맞힌 문제")).toBeInTheDocument();
    expect(screen.getByText("처음부터 모두 맞혔어요.")).toBeInTheDocument();
  });

  it("restarts the selected stage from the result screen", async () => {
    const user = userEvent.setup();
    renderGame();

    await completeTwoCorrectQuestions(user);
    await screen.findByText("학습 완료");
    await user.click(screen.getByRole("button", { name: /다시 시작/ }));

    expect(screen.getByText("문제 1 / 2")).toBeInTheDocument();
    expect(screen.getByLabelText("1 더하기 2")).toBeInTheDocument();
  });

  it("starts review mode with first-try wrong questions only", async () => {
    const user = userEvent.setup();
    renderGame();

    await startAdditionStage(user);
    await submitDigits(user, [4]);
    await submitDigits(user, [3]);
    await user.click(screen.getByRole("button", { name: "다음 문제" }));
    await submitDigits(user, [7]);
    await user.click(screen.getByRole("button", { name: "결과 보기" }));
    await screen.findByText("학습 완료");
    await user.click(
      screen.getByRole("button", { name: "틀린 문제만 다시 풀기" }),
    );

    expect(screen.getByText("틀린 문제 복습")).toBeInTheDocument();
    expect(screen.getByText("문제 1 / 1")).toBeInTheDocument();
    expect(screen.getByLabelText("1 더하기 2")).toBeInTheDocument();
  });

  it("persists progress and exposes continue learning after reload", async () => {
    const user = userEvent.setup();
    renderGame();

    await completeTwoCorrectQuestions(user);
    await screen.findByText("학습 완료");

    await waitFor(() => {
      expect(window.localStorage.getItem(STORAGE_KEY)).toContain(
        "addition-within-5",
      );
    });

    cleanup();
    renderGame();

    expect(await screen.findByText("이어서 학습하기")).toBeInTheDocument();
    expect(screen.getByText("덧셈 · 5 이하 덧셈")).toBeInTheDocument();
  });

  it("runs subtraction stages without addition-only labels", async () => {
    const user = userEvent.setup();
    renderGame(createSubtractionQuestions());

    await user.click(screen.getByRole("button", { name: /뺄셈/ }));
    await user.click(screen.getByRole("button", { name: /5 이하 뺄셈/ }));

    expect(screen.getByText("- 뺄셈")).toBeInTheDocument();
    expect(screen.getByLabelText("4 빼기 1")).toBeInTheDocument();
  });

  it("starts multiplication basic stages from the arithmetic home screen", async () => {
    const user = userEvent.setup();
    renderGame(createMultiplicationQuestions());

    await user.click(screen.getByRole("button", { name: /곱셈/ }));

    expect(screen.getByRole("heading", { name: "기초" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /같은 묶음/ }))
      .toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /같은 묶음/ }));

    expect(screen.getByText("× 곱셈")).toBeInTheDocument();
    expect(screen.getByText("문제 1 / 1")).toBeInTheDocument();
    expect(screen.getByLabelText("2 곱하기 3")).toBeInTheDocument();

    await submitDigits(user, [6]);

    expect(screen.getByText("정답이에요!")).toBeInTheDocument();
  });

  it("starts division basic stages from the arithmetic home screen", async () => {
    const user = userEvent.setup();
    renderGame(createDivisionQuestions());

    await user.click(screen.getByRole("button", { name: /나눗셈/ }));

    expect(screen.getByRole("heading", { name: "기초" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /똑같이 나누기/ }))
      .toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /똑같이 나누기/ }));

    expect(screen.getByText("÷ 나눗셈")).toBeInTheDocument();
    expect(screen.getByText("문제 1 / 1")).toBeInTheDocument();
    expect(screen.getByLabelText("12개를 3개의 묶음으로 나누기"))
      .toBeInTheDocument();

    await submitDigits(user, [4]);

    expect(screen.getByText("정답이에요!")).toBeInTheDocument();
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

async function startAdditionStage(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByRole("button", { name: /덧셈/ }));
  await user.click(screen.getByRole("button", { name: /5 이하 덧셈/ }));
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
  await startAdditionStage(user);
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
      stageId: "addition-within-5",
    },
    {
      id: "3-4-addition",
      leftOperand: 3,
      rightOperand: 4,
      operator: "addition",
      answer: 7,
      difficulty: "medium",
      stageId: "addition-within-5",
    },
  ];
}

function createSubtractionQuestions(): ArithmeticQuestion[] {
  return [
    {
      id: "4-1-subtraction",
      leftOperand: 4,
      rightOperand: 1,
      operator: "subtraction",
      answer: 3,
      difficulty: "easy",
      stageId: "subtraction-within-5",
    },
  ];
}

function createMultiplicationQuestions(): ArithmeticQuestion[] {
  return [
    {
      id: "2-3-multiplication",
      leftOperand: 2,
      rightOperand: 3,
      operator: "multiplication",
      answer: 6,
      difficulty: "easy",
      stageId: "multiplication-equal-groups",
    },
  ];
}

function createDivisionQuestions(): ArithmeticQuestion[] {
  return [
    {
      id: "12-3-division",
      leftOperand: 12,
      rightOperand: 3,
      operator: "division",
      answer: 4,
      difficulty: "medium",
      stageId: "division-equal-sharing",
    },
  ];
}
