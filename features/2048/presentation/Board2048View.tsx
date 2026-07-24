"use client";

import { cn } from "@/lib/utils";
import { BOARD_SIZE } from "../domain/entities/Board";
import type { Tile } from "../application/use-cases/reconcileTiles";
import type { useSwipeInput } from "./interaction/useSwipeInput";
import { Tile2048View } from "./Tile2048View";
import styles from "./styles/game2048.module.css";

interface Board2048ViewProps {
  tiles: Tile[];
  onTileAnimationEnd: () => void;
  swipeHandlers: ReturnType<typeof useSwipeInput>;
}

export function Board2048View({ tiles, onTileAnimationEnd, swipeHandlers }: Board2048ViewProps) {
  const cells = Array.from({ length: BOARD_SIZE * BOARD_SIZE });

  return (
    <div
      className={cn("relative aspect-square w-full touch-none select-none rounded-lg", styles.board)}
      {...swipeHandlers}
    >
      {/*
        Padding lives on this inner, absolutely-positioned wrapper (not the
        outer .board div) so the background grid (normal flow, h-full/w-full)
        and the tile layer (absolute, inset-0) resolve against the exact same
        box. If the outer div carried the padding instead, inset-0 on the
        tile layer would resolve against its padding box - which *includes*
        that padding - making the tile layer larger than the grid underneath
        and drifting tiles out of alignment with the background cells.
      */}
      <div className="absolute inset-2">
        <div className="grid h-full w-full grid-cols-4 grid-rows-4">
          {cells.map((_, index) => (
            <div key={index} className={cn("m-1 rounded-md", styles.cell)} />
          ))}
        </div>
        <div className="absolute inset-0">
          {tiles.map((tile) => (
            <Tile2048View key={tile.id} tile={tile} boardSize={BOARD_SIZE} onAnimationEnd={onTileAnimationEnd} />
          ))}
        </div>
      </div>
    </div>
  );
}
