export type TileType =
  "ruby" | "sapphire" | "emerald" | "topaz" | "amethyst" | "orange";

export interface Tile {
  id: string;
  type: TileType;
}
