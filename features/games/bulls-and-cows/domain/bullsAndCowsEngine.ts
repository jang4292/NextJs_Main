import { DEFAULT_SECRET_LENGTH, DIGITS } from "./game.constants";
import type { GuessResult } from "./game.types";

export function generateSecret(length = DEFAULT_SECRET_LENGTH): string {
  if (length < 1 || length > DIGITS.length) {
    throw new Error("Secret length must be between 1 and 10.");
  }

  const candidates = [...DIGITS];
  const secret: string[] = [];

  for (let index = 0; index < length; index += 1) {
    const start = index === 0 && length > 1 ? 1 : 0;
    const randomIndex =
      start + Math.floor(Math.random() * (candidates.length - start));
    const [digit] = candidates.splice(randomIndex, 1);
    secret.push(digit);
  }

  return secret.join("");
}

export function validateGuess(
  guess: string,
  length = DEFAULT_SECRET_LENGTH,
): { valid: boolean; message?: string } {
  if (!guess) {
    return { valid: false, message: "숫자를 입력해 주세요." };
  }

  if (!/^\d+$/.test(guess)) {
    return { valid: false, message: "숫자만 입력할 수 있어요." };
  }

  if (guess.length !== length) {
    return { valid: false, message: `${length}자리 숫자를 입력해 주세요.` };
  }

  if (length > 1 && guess.startsWith("0")) {
    return { valid: false, message: "첫 자리에는 0을 사용할 수 없어요." };
  }

  if (new Set(guess).size !== guess.length) {
    return { valid: false, message: "중복 없는 숫자를 입력해 주세요." };
  }

  return { valid: true };
}

export function judgeGuess(secret: string, guess: string): GuessResult {
  let strikes = 0;
  let balls = 0;

  for (let index = 0; index < guess.length; index += 1) {
    const digit = guess[index];

    if (secret[index] === digit) {
      strikes += 1;
      continue;
    }

    if (secret.includes(digit)) {
      balls += 1;
    }
  }

  return {
    guess,
    strikes,
    balls,
    isOut: strikes === 0 && balls === 0,
  };
}

export function isGameWon(result: GuessResult): boolean {
  return result.strikes === result.guess.length;
}

export function isGameLost(
  attemptsCount: number,
  maxAttempts: number,
): boolean {
  return attemptsCount >= maxAttempts;
}
