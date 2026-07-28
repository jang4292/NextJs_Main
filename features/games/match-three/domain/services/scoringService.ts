import type { MatchThreeConfig } from "../../config/gameConfig";
import { DEFAULT_MATCH_THREE_CONFIG } from "../../config/gameConfig";

export function calculateMatchScore(
  removedTileCount: number,
  cascadeStep: number,
  config: MatchThreeConfig = DEFAULT_MATCH_THREE_CONFIG,
): number {
  const multiplier = Math.max(1, cascadeStep);
  return removedTileCount * config.baseScore * multiplier;
}
