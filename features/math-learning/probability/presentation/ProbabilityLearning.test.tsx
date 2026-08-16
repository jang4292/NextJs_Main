// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import type { ProbabilityQuestion } from "../domain/probability.types";
import { ProbabilityLearning } from "./ProbabilityLearning";

afterEach(() => {
  cleanup();
});

describe("ProbabilityLearning", () => {
  it("renders the first probability question immediately", () => {
    renderLearning();

    expect(screen.getByText("문제 1 / 2")).toBeInTheDocument();
    expect(screen.getByLabelText("가능한 결과 앞면, 뒷면")).toBeInTheDocument();
    expect(
      screen.getByText("나올 수 있는 결과는 모두 몇 가지인가요?"),
    ).toBeInTheDocument();
  });

  it("displays number-pad input and deletes one digit", async () => {
    const user = userEvent.setup();
    renderLearning();

    await user.click(screen.getByRole("button", { name: "1 입력" }));
    await user.click(screen.getByRole("button", { name: "2 입력" }));

    expect(screen.getByLabelText("현재 입력한 답")).toHaveTextContent("12");

    await user.click(screen.getByRole("button", { name: "한 자리 지우기" }));

    expect(screen.getByLabelText("현재 입력한 답")).toHaveTextContent("1");
  });

  it("shows correct feedback after a correct answer", async () => {
    const user = userEvent.setup();
    renderLearning();

    await submitDigits(user, [2]);

    expect(screen.getByText("정답이에요!")).toBeInTheDocument();
    expect(screen.getByText(/모두 2가지 결과/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "다음 문제" })).toBeEnabled();
  });

  it("keeps the same question active after the first wrong answer", async () => {
    const user = userEvent.setup();
    renderLearning();

    await submitDigits(user, [9]);

    expect(screen.getByText("다시 생각해 보세요.")).toBeInTheDocument();
    expect(screen.getByLabelText("가능한 결과 앞면, 뒷면")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "1 입력" })).toBeEnabled();
  });

  it("shows the result screen after the last question is completed", async () => {
    const user = userEvent.setup();
    renderLearning();

    await submitDigits(user, [2]);
    await user.click(screen.getByRole("button", { name: "다음 문제" }));
    await submitDigits(user, [2]);
    await user.click(screen.getByRole("button", { name: "결과 보기" }));

    expect(screen.getByText("확률 학습 완료")).toBeInTheDocument();
    expect(screen.getByText(/전체 2문제 중 2문제/)).toBeInTheDocument();
  });
});

function renderLearning(questions = createQuestions()) {
  render(<ProbabilityLearning createQuestions={() => questions} />);
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

function createQuestions(): ProbabilityQuestion[] {
  return [
    {
      id: "probability-basic-coin-total-outcomes-1",
      scenarioKind: "coin",
      scenarioTitle: "동전 한 개",
      situation: "동전을 한 번 던질 때 나올 수 있는 결과를 살펴봐요.",
      questionText: "나올 수 있는 결과는 모두 몇 가지인가요?",
      outcomes: ["앞면", "뒷면"],
      targetOutcomeLabels: [],
      answer: 2,
      explanation: "동전은 앞면 또는 뒷면, 모두 2가지 결과가 있어요.",
      kind: "total-outcomes",
      difficulty: "easy",
      stageId: "probability-basic",
    },
    {
      id: "probability-basic-color-pick-favorable-outcomes-2",
      scenarioKind: "color-pick",
      scenarioTitle: "색 공 뽑기",
      situation: "상자에 빨강 공 2개, 파랑 공 1개, 노랑 공 1개가 있어요.",
      questionText: "빨강 공을 뽑는 경우는 몇 가지인가요?",
      outcomes: ["빨강", "빨강", "파랑", "노랑"],
      targetOutcomeLabels: ["빨강"],
      answer: 2,
      explanation: "빨강 공이 2개 있으므로 조건에 맞는 경우는 2가지예요.",
      kind: "favorable-outcomes",
      difficulty: "easy",
      stageId: "probability-basic",
    },
  ];
}
