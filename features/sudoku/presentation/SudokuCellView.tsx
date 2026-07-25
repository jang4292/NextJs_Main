"use client";

import { cn } from "@/lib/utils";
import type { SudokuCell } from "../domain/entities/SudokuCell";
import styles from "./styles/sudoku.module.css";

interface SudokuCellViewProps {
  cell: SudokuCell;
  isSelected: boolean;
  isPeer: boolean;
  isSameValue: boolean;
  onSelect: () => void;
}

function describeCell(cell: SudokuCell): string {
  const position = `${cell.row + 1}행 ${cell.column + 1}열`;
  if (cell.isFixed) return `${position}, 고정 숫자 ${cell.value}`;
  if (cell.value === 0) return `${position}, 빈 칸`;
  if (cell.isError) return `${position}, 오류, 입력값 ${cell.value}`;
  return `${position}, 입력값 ${cell.value}`;
}

export function SudokuCellView({
  cell,
  isSelected,
  isPeer,
  isSameValue,
  onSelect,
}: SudokuCellViewProps) {
  const boxRight = cell.column % 3 === 2 && cell.column !== 8;
  const boxBottom = cell.row % 3 === 2 && cell.row !== 8;

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-label={describeCell(cell)}
      aria-pressed={isSelected}
      className={cn(
        styles.cell,
        boxRight && styles.boxRightBorder,
        boxBottom && styles.boxBottomBorder,
        cell.isFixed && styles.fixed,
        isPeer && styles.peer,
        isSameValue && styles.sameValue,
        cell.isError && styles.error,
        isSelected && styles.selected,
      )}
    >
      {/* Keying on the value replays the pop-in animation only when the
          digit actually changes, without driving a setState-in-effect. */}
      {cell.value !== 0 && (
        <span key={cell.value} className={styles.justInput}>
          {cell.value}
        </span>
      )}
    </button>
  );
}
