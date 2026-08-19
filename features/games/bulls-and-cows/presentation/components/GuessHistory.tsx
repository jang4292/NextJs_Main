import type { GuessResult } from "../../domain/game.types";
import styles from "../styles/bullsAndCows.module.css";

interface GuessHistoryProps {
  attempts: GuessResult[];
}

export function GuessHistory({ attempts }: GuessHistoryProps) {
  return (
    <section className={styles.panel} aria-label="시도 기록">
      <div className={styles.panelHeader}>
        <h2>시도 기록</h2>
        <span>{attempts.length}회</span>
      </div>
      {attempts.length === 0 ? (
        <p className={styles.emptyState}>아직 제출한 숫자가 없어요.</p>
      ) : (
        <ol className={styles.historyList}>
          {attempts.map((attempt, index) => (
            <li key={`${attempt.guess}-${attempts.length - index}`}>
              <span className={styles.historyIndex}>
                #{attempts.length - index}
              </span>
              <strong className={styles.historyGuess}>{attempt.guess}</strong>
              <ResultBadges result={attempt} />
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}

function ResultBadges({ result }: { result: GuessResult }) {
  if (result.isOut) {
    return <span className={styles.outBadge}>Out</span>;
  }

  return (
    <span className={styles.badgeGroup}>
      <span className={styles.strikeBadge}>{result.strikes} Strike</span>
      <span className={styles.ballBadge}>{result.balls} Ball</span>
    </span>
  );
}
