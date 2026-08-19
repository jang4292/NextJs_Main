import { Delete } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DIGITS } from "../../domain/game.constants";
import styles from "../styles/bullsAndCows.module.css";

interface NumberKeypadProps {
  disabled: boolean;
  onInput: (digit: string) => void;
  onDelete: () => void;
}

export function NumberKeypad({
  disabled,
  onInput,
  onDelete,
}: NumberKeypadProps) {
  return (
    <section className={styles.panel} aria-label="모바일 숫자 키패드">
      <p className={styles.metaLabel}>숫자 키패드</p>
      <div className={styles.keypad} role="group" aria-label="숫자 입력 패드">
        {DIGITS.slice(1).map((digit) => (
          <Button
            key={digit}
            type="button"
            variant="outline"
            disabled={disabled}
            onClick={() => onInput(digit)}
            className={styles.keypadButton}
            aria-label={`${digit} 입력`}
          >
            {digit}
          </Button>
        ))}
        <Button
          type="button"
          variant="outline"
          disabled={disabled}
          onClick={() => onInput("0")}
          className={styles.keypadButton}
          aria-label="0 입력"
        >
          0
        </Button>
        <Button
          type="button"
          variant="outline"
          disabled={disabled}
          onClick={onDelete}
          className={styles.keypadButton}
          aria-label="한 자리 지우기"
        >
          <Delete aria-hidden />
        </Button>
      </div>
    </section>
  );
}
