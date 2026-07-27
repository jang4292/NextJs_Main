"use client";

import { useCallback, useEffect, useState } from "react";

/** Counts whole seconds while `isRunning` is true. Call `reset` to zero it (e.g. on restart). */
export function useElapsedTimer(isRunning: boolean): {
  elapsedSeconds: number;
  reset: () => void;
} {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    if (!isRunning) return;

    const intervalId = setInterval(
      () => setElapsedSeconds((seconds) => seconds + 1),
      1000,
    );
    return () => clearInterval(intervalId);
  }, [isRunning]);

  const reset = useCallback(() => setElapsedSeconds(0), []);

  return { elapsedSeconds, reset };
}
