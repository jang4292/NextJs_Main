export interface RowCellTrace {
  type: "move" | "merge";
  /** Original indices consumed for this resulting cell: 1 for a move, 2 (ascending) for a merge. */
  fromIndices: number[];
  toIndex: number;
  value: number;
}

export interface MoveRowResult {
  row: number[];
  scoreGained: number;
  moved: boolean;
  trace: RowCellTrace[];
}

/**
 * Compacts and merges a single row to the left. Each source tile merges at
 * most once per call, since a merged pair is consumed together and the
 * merged result is never re-examined against the next tile in this pass.
 */
export function moveRowLeft(row: readonly number[]): MoveRowResult {
  const nonZero = row
    .map((value, index) => ({ value, index }))
    .filter((cell) => cell.value !== 0);

  const resultRow = new Array(row.length).fill(0);
  const trace: RowCellTrace[] = [];
  let scoreGained = 0;
  let writeIndex = 0;
  let i = 0;

  while (i < nonZero.length) {
    const current = nonZero[i];
    const next = nonZero[i + 1];

    if (next && next.value === current.value) {
      const mergedValue = current.value * 2;
      resultRow[writeIndex] = mergedValue;
      trace.push({
        type: "merge",
        fromIndices: [current.index, next.index],
        toIndex: writeIndex,
        value: mergedValue,
      });
      scoreGained += mergedValue;
      writeIndex++;
      i += 2;
    } else {
      resultRow[writeIndex] = current.value;
      trace.push({
        type: "move",
        fromIndices: [current.index],
        toIndex: writeIndex,
        value: current.value,
      });
      writeIndex++;
      i += 1;
    }
  }

  const moved = row.some((value, index) => value !== resultRow[index]);

  return { row: resultRow, scoreGained, moved, trace };
}
