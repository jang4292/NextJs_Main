import type { TileType } from "../domain/entities/Tile";

export interface MatchThreeConfig {
  rows: number;
  columns: number;
  tileTypes: readonly TileType[];
  initialMoves: number;
  targetScore: number;
  baseScore: number;
  maxBoardGenerationAttempts: number;
  maxCascadeSteps: number;
}

export const MATCH_THREE_TILE_TYPES = [
  "ruby",
  "sapphire",
  "emerald",
  "topaz",
  "amethyst",
  "orange",
] as const satisfies readonly TileType[];

export const DEFAULT_MATCH_THREE_CONFIG: MatchThreeConfig = {
  rows: 8,
  columns: 8,
  tileTypes: MATCH_THREE_TILE_TYPES,
  initialMoves: 30,
  targetScore: 3000,
  baseScore: 10,
  maxBoardGenerationAttempts: 80,
  maxCascadeSteps: 20,
};
