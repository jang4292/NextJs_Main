"use client";

import { useEffect, useRef } from "react";
import type { GameState } from "../../domain/entities/GameState";
import { useFreecellGame } from "./useFreecellGame";

const STORAGE_KEY = "portfolio.freecell.save.v1";
const SAVE_VERSION = 1;

interface SavedFreecellGame {
  version: number;
  currentState: GameState;
  initialState: GameState;
  history: GameState[];
  savedAt: string;
}

function isGameState(value: unknown): value is GameState {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<GameState>;
  return Array.isArray(candidate.tableau) && Array.isArray(candidate.freeCells) && !!candidate.foundations;
}

function readSavedGame(): SavedFreecellGame | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as Partial<SavedFreecellGame>;
    if (parsed.version !== SAVE_VERSION) return null;
    if (!isGameState(parsed.currentState) || !isGameState(parsed.initialState)) return null;
    if (!Array.isArray(parsed.history)) return null;

    return parsed as SavedFreecellGame;
  } catch {
    return null; // Corrupt or unreadable save -- fall back to a fresh game.
  }
}

function writeSavedGame(save: SavedFreecellGame): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(save));
  } catch {
    // Ignore storage failures (private browsing, quota, ...); the game
    // simply won't persist across reloads.
  }
}

/** Adds localStorage persistence on top of useFreecellGame, kept as a
 * separate hook so the core reducer stays free of browser storage concerns. */
export function usePersistedFreecell() {
  const freecell = useFreecellGame();
  const hydratedRef = useRef(false);

  useEffect(() => {
    if (hydratedRef.current) return;
    hydratedRef.current = true;

    const saved = readSavedGame();
    if (saved) {
      freecell.hydrate({ current: saved.currentState, initial: saved.initialState, past: saved.history });
    }
    // Restores the previous session once on mount only; freecell.hydrate is
    // a stable dispatch wrapper, so omitting it from deps is safe here.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!hydratedRef.current) return;
    writeSavedGame({
      version: SAVE_VERSION,
      currentState: freecell.game,
      initialState: freecell.initial,
      history: freecell.past,
      savedAt: new Date().toISOString(),
    });
  }, [freecell.game, freecell.initial, freecell.past]);

  return freecell;
}
