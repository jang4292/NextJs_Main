import type { MatchThreeConfig } from "../../config/gameConfig";
import { DEFAULT_MATCH_THREE_CONFIG } from "../../config/gameConfig";
import type { GameSession } from "../../domain/entities/GameSession";
import { generateBoard } from "../../domain/services/boardGenerator";
import type { Rng } from "../../domain/services/random";
import {
  createSequentialTileIdGenerator,
  type TileIdGenerator,
} from "../../domain/services/tileFactory";

export function startNewMatchThreeGame(
  config: MatchThreeConfig = DEFAULT_MATCH_THREE_CONFIG,
  rng: Rng = Math.random,
  nextId: TileIdGenerator = createSequentialTileIdGenerator(),
): GameSession {
  return {
    board: generateBoard(config, rng, nextId),
    score: 0,
    movesRemaining: config.initialMoves,
    phase: "idle",
  };
}
