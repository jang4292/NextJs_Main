"use client";

import { cn } from "@/lib/utils";
import type { Tile } from "../application/use-cases/reconcileTiles";
import styles from "./styles/game2048.module.css";

interface Tile2048ViewProps {
  tile: Tile;
  boardSize: number;
  onAnimationEnd?: () => void;
}

export function Tile2048View({
  tile,
  boardSize,
  onAnimationEnd,
}: Tile2048ViewProps) {
  const cellPercent = 100 / boardSize;

  return (
    <div
      className="absolute top-0 left-0 transition-transform duration-150 ease-out motion-reduce:transition-none"
      style={{
        width: `${cellPercent}%`,
        height: `${cellPercent}%`,
        transform: `translate(${tile.col * 100}%, ${tile.row * 100}%)`,
      }}
    >
      <div
        data-value={tile.value}
        onAnimationEnd={onAnimationEnd}
        className={cn(
          "absolute inset-1 flex items-center justify-center rounded-md text-[clamp(1rem,6vw,2rem)] font-bold",
          styles.tile,
          tile.isNew && styles.spawn,
          tile.isMerged && styles.merge,
        )}
      >
        {tile.value}
      </div>
    </div>
  );
}
