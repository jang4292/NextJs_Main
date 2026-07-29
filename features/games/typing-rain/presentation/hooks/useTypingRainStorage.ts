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
  loadTypingGameStorage,
  saveTypingGameStorage,
} from "../../application/use-cases/storage";

export function useTypingRainStorage() {
  const [storage, setStorage] = useState<TypingGameStorage>(
    getDefaultStorage,
  );
  const [hydrated, setHydrated] = useState(false);
  const hydratedRef = useRef(false);

  useEffect(() => {
    if (hydratedRef.current) return;
    hydratedRef.current = true;
    setStorage(loadTypingGameStorage());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    saveTypingGameStorage(storage);
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
