import type { Board } from "./domain/entities/Board";

export function board(rows: number[][]): Board {
  return rows.map((row) => [...row]);
}

/** Returns a deterministic RNG that yields `sequence` in order, then throws if exhausted. */
export function fixedRng(sequence: number[]): () => number {
  let index = 0;
  return () => {
    if (index >= sequence.length) {
      throw new Error(
        "fixedRng exhausted: not enough values queued for this test",
      );
    }
    return sequence[index++];
  };
}
