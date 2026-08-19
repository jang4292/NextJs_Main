"use client";

import { RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BET_OPTIONS } from "../domain/betting";
import { BetControls } from "./components/BetControls";
import { GameInstructions } from "./components/GameInstructions";
import { PayoutTable } from "./components/PayoutTable";
import { ResultMessage } from "./components/ResultMessage";
import { SlotMachine } from "./components/SlotMachine";
import { SpinButton } from "./components/SpinButton";
import { StatusPanel } from "./components/StatusPanel";
import { TechShowcase } from "./components/TechShowcase";
import {
  useSlotMachine,
  type UseSlotMachineOptions,
} from "./hooks/useSlotMachine";

export function SlotMachineGame(options: UseSlotMachineOptions = {}) {
  const game = useSlotMachine(options);
  const { session } = game;
  const isBetAtMinimum = session.bet === BET_OPTIONS[0];
  const isBetAtMaximum =
    session.bet === BET_OPTIONS[BET_OPTIONS.length - 1] ||
    session.bet >= session.balance;

  return (
    <section className="mx-auto max-w-4xl space-y-4" aria-label="Slot Machine">
      <StatusPanel
        balance={session.balance}
        bet={session.bet}
        lastPayout={session.lastPayout}
      />
      <SlotMachine
        session={session}
        stoppedReels={game.stoppedReels}
        isBusy={game.isBusy}
      />
      <ResultMessage
        message={session.lastMessage}
        isGameOver={game.isGameOver}
      />
      <div className="grid gap-3 rounded-lg border border-neutral-200 bg-neutral-50 p-3 shadow-sm sm:grid-cols-[1fr_1fr]">
        <BetControls
          bet={session.bet}
          disabled={game.isBusy || game.isGameOver}
          onDecrease={game.decreaseBet}
          onIncrease={game.increaseBet}
        />
        <div className="grid gap-2">
          <SpinButton
            disabled={!game.canSpin || game.isBusy || game.isGameOver}
            isBusy={game.isBusy}
            onSpin={game.spin}
          />
          <Button
            type="button"
            variant="outline"
            className="min-h-11 w-full"
            onClick={game.newGame}
            aria-label="새 슬롯 머신 게임 시작"
          >
            <RefreshCcw aria-hidden />
            NEW GAME
          </Button>
        </div>
      </div>
      <p className="text-center text-xs text-neutral-500">
        베팅 범위: {BET_OPTIONS.join(" / ")} 크레딧
        {isBetAtMinimum ? " · 최소 베팅" : ""}
        {isBetAtMaximum ? " · 현재 가능한 최대 베팅" : ""}
      </p>
      <PayoutTable />
      <GameInstructions />
      <TechShowcase />
    </section>
  );
}
