"use client";

import { useEffect, useSyncExternalStore } from "react";

const BEST_SCORE_KEY = "portfolio.game2048.bestScore";

type Listener = () => void;
const listeners = new Set<Listener>();

function readBestScore(): number {
  try {
    const raw = window.localStorage.getItem(BEST_SCORE_KEY);
    return raw ? Number(raw) || 0 : 0;
  } catch {
    return 0;
  }
}

function writeBestScore(value: number): void {
  try {
    window.localStorage.setItem(BEST_SCORE_KEY, String(value));
  } catch {
    // Ignore storage failures; best score simply won't persist.
  }
  listeners.forEach((listener) => listener());
}

function subscribe(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getServerSnapshot(): number {
  return 0;
}

/**
 * Syncs the best score with localStorage via useSyncExternalStore - the
 * server snapshot is always 0, so SSR and the first client render never
 * hydration-mismatch. Persisting a new high score is a plain effect that
 * writes to storage and notifies subscribers, rather than calling setState
 * directly (which fights React's render cycle).
 */
export function useBestScore(currentScore: number): number {
  const bestScore = useSyncExternalStore(
    subscribe,
    readBestScore,
    getServerSnapshot,
  );

  useEffect(() => {
    if (currentScore > bestScore) {
      writeBestScore(currentScore);
    }
  }, [currentScore, bestScore]);

  return bestScore;
}
