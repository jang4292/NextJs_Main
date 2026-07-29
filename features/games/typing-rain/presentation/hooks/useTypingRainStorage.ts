"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type {
  TypingGameResult,
  TypingGameSettings,
  TypingGameStorage,
} from "../../domain/typing.types";
import {
  applyGameResultToStorage,
  applyPreferences,
  getDefaultStorage,
  parseTypingGameStorage,
  serializeTypingGameStorage,
  TYPING_RAIN_STORAGE_KEY,
} from "../../application/use-cases/storage";

function readStorage(): TypingGameStorage {
  try {
    return parseTypingGameStorage(
      window.localStorage.getItem(TYPING_RAIN_STORAGE_KEY),
    );
  } catch {
    return getDefaultStorage();
  }
}

function writeStorage(storage: TypingGameStorage) {
  try {
    window.localStorage.setItem(
      TYPING_RAIN_STORAGE_KEY,
      serializeTypingGameStorage(storage),
    );
  } catch {
    // Storage failures should not block a playable session.
  }
}

export function useTypingRainStorage() {
  const [storage, setStorage] = useState<TypingGameStorage>(
    getDefaultStorage,
  );
  const [hydrated, setHydrated] = useState(false);
  const hydratedRef = useRef(false);

  useEffect(() => {
    if (hydratedRef.current) return;
    hydratedRef.current = true;
    setStorage(readStorage());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    writeStorage(storage);
  }, [hydrated, storage]);

  const updatePreferences = useCallback(
    (preferences: Partial<TypingGameStorage["preferences"]>) => {
      setStorage((currentStorage) =>
        applyPreferences(currentStorage, preferences),
      );
    },
    [],
  );

  const recordResult = useCallback(
    (settings: TypingGameSettings, result: TypingGameResult) => {
      setStorage((currentStorage) =>
        applyGameResultToStorage({
          storage: currentStorage,
          settings,
          result,
        }),
      );
    },
    [],
  );

  return {
    storage,
    hydrated,
    updatePreferences,
    recordResult,
  };
}
