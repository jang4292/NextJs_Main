import type { Position } from "./Position";
import type { TileType } from "./Tile";

export interface MatchGroup {
  direction: "horizontal" | "vertical";
  tileType: TileType;
  positions: Position[];
}
