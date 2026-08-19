import { createInitialGameSession } from "../../domain/gameSession";

export function resetGame() {
  return createInitialGameSession();
}
