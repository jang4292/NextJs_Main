// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import type { SequenceQuestion } from "../domain/sequence.types";
import { SequenceLearning } from "./SequenceLearning";

afterEach(() => {
  cleanup();
});

describe("SequenceLearning", () => {
  it("renders the first sequence question immediately", () => {
    renderLearning();

    expect(screen.getByText("문제 1 / 2")).toBeInTheDocument();
    expect(screen.getByLabelText("수열 2, 4, 6, 8, 다음 수"))
      .toBeInTheDocument();
  });

  it("displays number-pad input and deletes one digit", async () => {
    const user = userEvent.setup();
    renderLearning();

    await user.click(screen.getByRole("button", { name: "1 입력" }));
    await user.click(screen.getByRole("button", { name: "0 입력" }));

    expect(screen.getByLabelText("현재 입력한 답")).toHaveTextContent("10");

    await user.click(screen.getByRole("button", { name: "한 자리 지우기" }));

    expect(screen.getByLabelText("현재 입력한 답")).toHaveTextContent("1");
  });

  it("shows correct feedback after a correct answer", async () => {
    const user = userEvent.setup();
    renderLearning();

    await submitDigits(user, [1, 0]);

    expect(screen.getByText("정답이에요!")).toBeInTheDocument();
    expect(screen.getByText(/2씩 커져요/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "다음 문제" })).toBeEnabled();
  });

  it("keeps the same question active after the first wrong answer", async () => {
    const user = userEvent.setup();
    renderLearning();

    await submitDigits(user, [9]);

    expect(screen.getByText("다시 생각해 보세요.")).toBeInTheDocument();
    expect(screen.getByLabelText("수열 2, 4, 6, 8, 다음 수"))
      .toBeInTheDocument();
    expect(screen.getByRole("button", { name: "1 입력" })).toBeEnabled();
  });

  it("shows the result screen after the last question is completed", async () => {
    const user = userEvent.setup();
    renderLearning();

    await submitDigits(user, [1, 0]);
    await user.click(screen.getByRole("button", { name: "다음 문제" }));
    await submitDigits(user, [3]);
    await user.click(screen.getByRole("button", { name: "결과 보기" }));

    expect(screen.getByText("수열 학습 완료")).toBeInTheDocument();
    expect(screen.getByText(/전체 2문제 중 2문제/)).toBeInTheDocument();
  });
});

function renderLearning(questions = createQuestions()) {
  render(<SequenceLearning createQuestions={() => questions} />);
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

function createQuestions(): SequenceQuestion[] {
  return [
    {
      id: "sequence-next-number-increase-2-2",
      values: [2, 4, 6, 8],
      answer: 10,
      step: 2,
      direction: "increase",
      difficulty: "easy",
      stageId: "sequence-next-number",
    },
    {
      id: "sequence-next-number-decrease-3-15",
      values: [15, 12, 9, 6],
      answer: 3,
      step: 3,
      direction: "decrease",
      difficulty: "medium",
      stageId: "sequence-next-number",
    },
  ];
}
