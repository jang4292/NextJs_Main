// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import type { StatisticsQuestion } from "../domain/statistics.types";
import { StatisticsLearning } from "./StatisticsLearning";

afterEach(() => {
  cleanup();
});

describe("StatisticsLearning", () => {
  it("renders the first statistics question immediately", () => {
    renderLearning();

    expect(screen.getByText("문제 1 / 2")).toBeInTheDocument();
    expect(screen.getByLabelText("자료 3, 5, 5, 7, 10"))
      .toBeInTheDocument();
    expect(screen.getByText("자료의 합계는?")).toBeInTheDocument();
  });

  it("displays number-pad input and deletes one digit", async () => {
    const user = userEvent.setup();
    renderLearning();

    await user.click(screen.getByRole("button", { name: "3 입력" }));
    await user.click(screen.getByRole("button", { name: "0 입력" }));

    expect(screen.getByLabelText("현재 입력한 답")).toHaveTextContent("30");

    await user.click(screen.getByRole("button", { name: "한 자리 지우기" }));

    expect(screen.getByLabelText("현재 입력한 답")).toHaveTextContent("3");
  });

  it("shows correct feedback after a correct answer", async () => {
    const user = userEvent.setup();
    renderLearning();

    await submitDigits(user, [3, 0]);

    expect(screen.getByText("정답이에요!")).toBeInTheDocument();
    expect(screen.getByText(/합계는 30이에요/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "다음 문제" })).toBeEnabled();
  });

  it("keeps the same question active after the first wrong answer", async () => {
    const user = userEvent.setup();
    renderLearning();

    await submitDigits(user, [9]);

    expect(screen.getByText("다시 생각해 보세요.")).toBeInTheDocument();
    expect(screen.getByLabelText("자료 3, 5, 5, 7, 10"))
      .toBeInTheDocument();
    expect(screen.getByRole("button", { name: "1 입력" })).toBeEnabled();
  });

  it("shows the result screen after the last question is completed", async () => {
    const user = userEvent.setup();
    renderLearning();

    await submitDigits(user, [3, 0]);
    await user.click(screen.getByRole("button", { name: "다음 문제" }));
    await submitDigits(user, [9]);
    await user.click(screen.getByRole("button", { name: "결과 보기" }));

    expect(screen.getByText("통계 학습 완료")).toBeInTheDocument();
    expect(screen.getByText(/전체 2문제 중 2문제/)).toBeInTheDocument();
  });
});

function renderLearning(questions = createQuestions()) {
  render(<StatisticsLearning createQuestions={() => questions} />);
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

function createQuestions(): StatisticsQuestion[] {
  return [
    {
      id: "statistics-basic-sum-3-5-5-7-10",
      values: [3, 5, 5, 7, 10],
      answer: 30,
      kind: "sum",
      difficulty: "easy",
      stageId: "statistics-basic",
    },
    {
      id: "statistics-basic-maximum-4-6-9-2-8",
      values: [4, 6, 9, 2, 8],
      answer: 9,
      kind: "maximum",
      difficulty: "easy",
      stageId: "statistics-basic",
    },
  ];
}
