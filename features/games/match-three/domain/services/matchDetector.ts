import type { Board } from "../entities/Board";
import type { MatchGroup } from "../entities/MatchGroup";
import type { Position } from "../entities/Position";
import type { TileType } from "../entities/Tile";
import { positionKey } from "../rules/positionRules";

export function findMatches(board: Board): MatchGroup[] {
  return [...findHorizontalMatches(board), ...findVerticalMatches(board)];
}

export function collectMatchedPositions(
  matchGroups: readonly MatchGroup[],
): Position[] {
  const positions = new Map<string, Position>();

  for (const group of matchGroups) {
    for (const position of group.positions) {
      positions.set(positionKey(position), position);
    }
  }

  return [...positions.values()];
}

function findHorizontalMatches(board: Board): MatchGroup[] {
  const groups: MatchGroup[] = [];
  const columns = board[0]?.length ?? 0;

  for (let row = 0; row < board.length; row++) {
    let runStart = 0;
    let runType: TileType | null = board[row][0]?.type ?? null;

    for (let column = 1; column <= columns; column++) {
      const currentType = column < columns ? board[row][column]?.type : null;
      if (currentType !== null && currentType === runType) continue;

      addRun(groups, "horizontal", runType, row, runStart, column - 1);
      runStart = column;
      runType = currentType ?? null;
    }
  }

  return groups;
}

function findVerticalMatches(board: Board): MatchGroup[] {
  const groups: MatchGroup[] = [];
  const rows = board.length;
  const columns = board[0]?.length ?? 0;

  for (let column = 0; column < columns; column++) {
    let runStart = 0;
    let runType: TileType | null = board[0]?.[column]?.type ?? null;

    for (let row = 1; row <= rows; row++) {
      const currentType = row < rows ? board[row][column]?.type : null;
      if (currentType !== null && currentType === runType) continue;

      addRun(groups, "vertical", runType, column, runStart, row - 1);
      runStart = row;
      runType = currentType ?? null;
    }
  }

  return groups;
}

function addRun(
  groups: MatchGroup[],
  direction: MatchGroup["direction"],
  tileType: TileType | null,
  fixedIndex: number,
  start: number,
  end: number,
) {
  if (tileType === null || end - start + 1 < 3) return;

  const positions = Array.from({ length: end - start + 1 }, (_, offset) => {
    const movingIndex = start + offset;
    return direction === "horizontal"
      ? { row: fixedIndex, column: movingIndex }
      : { row: movingIndex, column: fixedIndex };
  });

  groups.push({ direction, tileType, positions });
}
