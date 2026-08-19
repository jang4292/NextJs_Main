"use client";

import { GameStatusPanel } from "./components/GameStatusPanel";
import { GuessHistory } from "./components/GuessHistory";
import { GuessInput } from "./components/GuessInput";
import { NumberKeypad } from "./components/NumberKeypad";
import { RuleCard } from "./components/RuleCard";
import { useBullsAndCowsGame } from "./hooks/useBullsAndCowsGame";
import styles from "./styles/bullsAndCows.module.css";

export function BullsAndCowsGame() {
  const game = useBullsAndCowsGame();

  return (
    <section className={styles.shell} aria-label="숫자 야구 게임">
      <div className={styles.hero}>
        <p className={styles.eyebrow}>Bulls and Cows</p>
        <h2>숫자를 추리하고, 기록으로 좁혀가세요.</h2>
        <p>
          중복 없는 세 자리 숫자를 10번 안에 맞히는 싱글 플레이 숫자 야구
          게임입니다.
        </p>
      </div>

      <div className={styles.layout}>
        <div className={styles.playColumn}>
          <GameStatusPanel
            status={game.status}
            message={game.message}
            remainingAttempts={game.remainingAttempts}
            maxAttempts={game.maxAttempts}
          />
          <GuessInput
            value={game.currentInput}
            disabled={game.inputDisabled}
            onChange={game.setInput}
            onDelete={game.deleteDigit}
            onSubmit={game.submit}
            onRestart={game.restart}
          />
          <NumberKeypad
            disabled={game.inputDisabled}
            onInput={game.inputDigit}
            onDelete={game.deleteDigit}
          />
        </div>

        <div className={styles.infoColumn}>
          <GuessHistory attempts={game.attempts} />
          <RuleCard />
        </div>
      </div>
    </section>
  );
}
