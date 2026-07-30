"use client";

import type { CSSProperties } from "react";
import { useEffect, useMemo, useState } from "react";

interface VisualViewportState {
  viewportHeight: number;
  boardHeight: number;
  keyboardOffset: number;
  isCompact: boolean;
}

function getViewportState(): VisualViewportState {
  if (typeof window === "undefined") {
    return {
      viewportHeight: 720,
      boardHeight: 420,
      keyboardOffset: 0,
      isCompact: false,
    };
  }

  const viewport = window.visualViewport;
  const viewportHeight = Math.round(viewport?.height ?? window.innerHeight);
  const keyboardOffset = Math.max(
    0,
    Math.round(window.innerHeight - viewportHeight - (viewport?.offsetTop ?? 0)),
  );

  return {
    viewportHeight,
    boardHeight: Math.max(340, Math.min(viewportHeight - 320, 560)),
    keyboardOffset,
    isCompact: window.innerWidth < 480 || viewportHeight < 620,
  };
}

export function useVisualViewport() {
  const [state, setState] = useState<VisualViewportState>(getViewportState);

  useEffect(() => {
    function handleResize() {
      setState(getViewportState());
    }

    const viewport = window.visualViewport;
    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleResize);
    viewport?.addEventListener("resize", handleResize);
    viewport?.addEventListener("scroll", handleResize);

    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleResize);
      viewport?.removeEventListener("resize", handleResize);
      viewport?.removeEventListener("scroll", handleResize);
    };
  }, []);

  return useMemo(
    () => ({
      ...state,
      cssVariables: {
        "--typing-rain-viewport-height": `${state.viewportHeight}px`,
        "--typing-rain-board-height": `${state.boardHeight}px`,
        "--typing-rain-keyboard-offset": `${state.keyboardOffset}px`,
      } as CSSProperties,
    }),
    [state],
  );
}
