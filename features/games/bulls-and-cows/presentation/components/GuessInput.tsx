import { RefreshCcw, Send, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import styles from "../styles/bullsAndCows.module.css";

interface GuessInputProps {
  value: string;
  disabled: boolean;
  onChange: (value: string) => void;
  onDelete: () => void;
  onSubmit: () => void;
  onRestart: () => void;
}

export function GuessInput({
  value,
  disabled,
  onChange,
  onDelete,
  onSubmit,
  onRestart,
}: GuessInputProps) {
  return (
    <section className={styles.panel} aria-label="숫자 입력">
      <label className={styles.metaLabel} htmlFor="bulls-and-cows-input">
        현재 입력
      </label>
      <input
        id="bulls-and-cows-input"
        className={styles.hiddenInput}
        value={value}
        inputMode="numeric"
        pattern="[0-9]*"
        maxLength={3}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
        aria-label="현재 입력한 숫자"
      />
      <div className={styles.digitDisplay} aria-hidden>
        {[0, 1, 2].map((index) => (
          <span key={index} className={styles.digitSlot}>
            {value[index] ?? ""}
          </span>
        ))}
      </div>
      <div className={styles.inputActions}>
        <Button
          type="button"
          onClick={onSubmit}
          disabled={disabled}
          className="min-h-11"
          aria-label="숫자 제출"
        >
          <Send aria-hidden />
          제출
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onDelete}
          disabled={disabled || value.length === 0}
          className="min-h-11"
          aria-label="한 자리 지우기"
        >
          <X aria-hidden />
          지우기
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onRestart}
          className="min-h-11"
          aria-label="숫자 야구 게임 다시 시작"
        >
          <RefreshCcw aria-hidden />
          재시작
        </Button>
      </div>
    </section>
  );
}
