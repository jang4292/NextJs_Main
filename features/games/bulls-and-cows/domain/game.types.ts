export type GameStatus = "ready" | "playing" | "win" | "lose";

export type GuessResult = {
  guess: string;
  strikes: number;
  balls: number;
  isOut: boolean;
};

export type GameState = {
  secret: string;
  currentInput: string;
  attempts: GuessResult[];
  maxAttempts: number;
  status: GameStatus;
  message: string;
};
