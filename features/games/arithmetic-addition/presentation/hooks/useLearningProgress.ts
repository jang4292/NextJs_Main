"use client";

import { useEffect, useRef, useState } from "react";
import type {
  LearningSession,
  LearningStage,
  SessionAnalysis,
} from "../../domain/arithmetic.types";
import type { ArithmeticLearningData } from "../../domain/learningProgress.types";
import {
  applyStageResult,
  getDefaultLearningData,
  parseLearningData,
  serializeLearningData,
  STORAGE_KEY,
} from "../../application/use-cases/learningStorage";

function readLearningData(): ArithmeticLearningData {
  try {
    return parseLearningData(window.localStorage.getItem(STORAGE_KEY));
  } catch {
    return getDefaultLearningData();
  }
}

function writeLearningData(data: ArithmeticLearningData): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, serializeLearningData(data));
  } catch {
    // Persistence should never block the learning flow.
  }
}

export function useLearningProgress() {
  const [data, setData] = useState<ArithmeticLearningData>(
    getDefaultLearningData,
  );
  const [hydrated, setHydrated] = useState(false);
  const hydratedRef = useRef(false);

  useEffect(() => {
    if (hydratedRef.current) return;
    hydratedRef.current = true;
    setData(readLearningData());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    writeLearningData(data);
  }, [data, hydrated]);

  function recordStageResult(
    stage: LearningStage,
    session: LearningSession,
    analysis: SessionAnalysis,
  ) {
    setData((currentData) =>
      applyStageResult(currentData, stage, session, analysis),
    );
  }

  return {
    data,
    hydrated,
    recordStageResult,
  };
}
