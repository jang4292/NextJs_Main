// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest";
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { RandomSource } from "../application/randomSource";
import { createInitialGameSession } from "../domain/gameSession";
import { SlotMachineGame } from "./SlotMachineGame";

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

describe("SlotMachineGame", () => {
  it("renders the initial slot machine UI", () => {
    render(
      <SlotMachineGame randomSource={createFakeRandomSource([0, 5, 4])} />,
    );

    expect(screen.getByText("Balance")).toBeInTheDocument();
    expect(screen.getByText("1,000")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "슬롯 머신 스핀" }),
    ).toBeEnabled();
    expect(screen.getByText("Payout Table")).toBeInTheDocument();
    expect(screen.getByText("How to Play")).toBeInTheDocument();
    expect(screen.getByText("Portfolio Notes")).toBeInTheDocument();
  });

  it("disables spin controls while reels are spinning", () => {
    vi.useFakeTimers();
    render(
      <SlotMachineGame
        randomSource={createFakeRandomSource([0, 5, 4])}
        createSpinId={() => "spin-test"}
        stopDelaysMs={[100, 200, 300, 400]}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "슬롯 머신 스핀" }));

    expect(
      screen.getByRole("button", { name: "슬롯 머신 스핀" }),
    ).toBeDisabled();
    expect(screen.getByText("릴이 회전하고 있습니다...")).toBeInTheDocument();

    act(() => {
      vi.runAllTimers();
    });

    expect(
      screen.getByText("당첨! 20 크레딧을 받았습니다."),
    ).toBeInTheDocument();
  });

  it("shows game over and restores the initial state with NEW GAME", () => {
    vi.useFakeTimers();
    render(
      <SlotMachineGame
        initialSession={{ ...createInitialGameSession(), balance: 10 }}
        randomSource={createFakeRandomSource([1, 1, 1])}
        createSpinId={() => "spin-test"}
        stopDelaysMs={[0, 0, 0, 0]}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "슬롯 머신 스핀" }));

    act(() => {
      vi.runAllTimers();
    });

    expect(
      screen.getByText("최소 베팅보다 잔액이 적어 새 게임이 필요합니다."),
    ).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("button", { name: "새 슬롯 머신 게임 시작" }),
    );

    expect(
      screen.getByText("베팅을 정하고 SPIN을 눌러 보세요."),
    ).toBeInTheDocument();
    expect(screen.getByText("1,000")).toBeInTheDocument();
  });
});

function createFakeRandomSource(indexes: number[]) {
  const source: RandomSource & { calls: number } = {
    calls: 0,
    pickStopIndex(stripLength: number) {
      const value = indexes[source.calls++] ?? 0;

      return value % stripLength;
    },
  };

  return source;
}
