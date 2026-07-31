import type { GameSession } from "../../domain/slot.types";
import { SlotReel } from "./SlotReel";
import styles from "../styles/slotMachine.module.css";

interface SlotMachineProps {
  session: GameSession;
  stoppedReels: number;
  isBusy: boolean;
}

export function SlotMachine({
  session,
  stoppedReels,
  isBusy,
}: SlotMachineProps) {
  const isWinningResult =
    session.state.status === "result" && session.state.isWin;

  return (
    <div className={styles.machine} role="group" aria-label="3릴 슬롯 머신">
      <div className={styles.reelStage}>
        <div className={styles.payline} aria-hidden="true" />
        {session.reels.map((reel, index) => (
          <SlotReel
            key={index}
            reel={reel}
            isSpinning={isBusy && index >= stoppedReels}
            isWinning={isWinningResult}
          />
        ))}
      </div>
      <p className="mt-3 text-center text-xs font-medium text-neutral-600">
        가운데 줄이 유일한 페이라인입니다.
      </p>
    </div>
  );
}
