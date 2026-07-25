"use client";

import { cn } from "@/lib/utils";
import type { Cell } from "../domain/entities/Cell";
import type { Position } from "../domain/entities/Position";
import type { useCellInteraction } from "./interaction/useCellInteraction";
import styles from "./styles/minesweeper.module.css";

interface CellViewProps {
  cell: Cell;
  interaction: ReturnType<typeof useCellInteraction>;
}

function getCellAriaLabel(cell: Cell): string {
  if (cell.isRevealed) {
    return cell.isMine ? "지뢰 셀" : `주변 지뢰 ${cell.adjacentMines}개가 있는 열린 셀`;
  }
  return cell.isFlagged ? "깃발이 설정된 셀" : "닫힌 셀";
}

function getCellContent(cell: Cell): string {
  if (cell.isRevealed) {
    if (cell.isMine) return "💣";
    return cell.adjacentMines > 0 ? String(cell.adjacentMines) : "";
  }
  return cell.isFlagged ? "🚩" : "";
}

export function CellView({ cell, interaction }: CellViewProps) {
  const position: Position = { row: cell.row, column: cell.column };
  const countAttr = cell.isRevealed && !cell.isMine && cell.adjacentMines > 0 ? cell.adjacentMines : undefined;

  return (
    <button
      type="button"
      className={cn(
        "aspect-square select-none touch-none rounded-sm text-sm font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1",
        styles.cell,
      )}
      data-revealed={cell.isRevealed}
      data-flagged={cell.isFlagged}
      data-mine={cell.isMine}
      data-count={countAttr}
      aria-label={getCellAriaLabel(cell)}
      onPointerDown={(event) => interaction.onPointerDown(event, position)}
      onPointerMove={interaction.onPointerMove}
      onPointerUp={(event) => interaction.onPointerUp(event, position)}
      onPointerCancel={interaction.onPointerCancel}
      onContextMenu={(event) => interaction.onContextMenu(event, position)}
    >
      {getCellContent(cell)}
    </button>
  );
}
