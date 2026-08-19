import type { GameStatus } from "../../domain/game.types";
import styles from "../styles/bullsAndCows.module.css";

interface GameStatusPanelProps {
  status: GameStatus;
  message: string;
  remainingAttempts: number;
  maxAttempts: number;
}

const STATUS_LABELS: Record<GameStatus, string> = {
  ready: "준비",
  playing: "진행 중",
  win: "승리",
  lose: "실패",
};

export function GameStatusPanel({
  status,
  message,
  remainingAttempts,
  maxAttempts,
}: GameStatusPanelProps) {
  return (
    <section className={styles.panel} aria-label="게임 상태">
      <div className={styles.statusGrid}>
        <div>
          <p className={styles.metaLabel}>남은 시도</p>
          <p className={styles.counter}>
            {remainingAttempts}
            <span>/ {maxAttempts}</span>
          </p>
        </div>
        <div>
          <p className={styles.metaLabel}>현재 상태</p>
          <span className={styles.statusBadge} data-status={status}>
            {STATUS_LABELS[status]}
          </span>
        </div>
      </div>
      <p className={styles.message} role="status" aria-live="polite">
        {message}
      </p>
    </section>
  );
}
