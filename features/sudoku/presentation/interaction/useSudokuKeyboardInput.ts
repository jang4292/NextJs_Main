"use client";

import { useEffect, useRef } from "react";
import type { MoveDirection } from "../../application/use-cases/moveSelection";
import type { SudokuValue } from "../../domain/entities/SudokuValue";

interface SudokuKeyboardCallbacks {
  onDigit: (value: SudokuValue) => void;
  onDelete: () => void;
  onMove: (direction: MoveDirection) => void;
  onEscape: () => void;
}

const ARROW_TO_DIRECTION: Record<string, MoveDirection> = {
  ArrowUp: "up",
  ArrowDown: "down",
  ArrowLeft: "left",
  ArrowRight: "right",
};

/**
 * Locking (paused/completed) is intentionally not checked here - each
 * callback dispatches into use-cases that already guard on game status via
 * isInputLocked, keeping that rule in a single place.
 */
export function useSudokuKeyboardInput(callbacks: SudokuKeyboardCallbacks) {
  const callbacksRef = useRef(callbacks);

  useEffect(() => {
    callbacksRef.current = callbacks;
  });

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.ctrlKey || event.metaKey || event.altKey) return;

      if (event.key >= "1" && event.key <= "9") {
        event.preventDefault();
        callbacksRef.current.onDigit(Number(event.key) as SudokuValue);
        return;
      }

      if (event.key === "Backspace" || event.key === "Delete") {
        event.preventDefault();
        callbacksRef.current.onDelete();
        return;
      }

      const direction = ARROW_TO_DIRECTION[event.key];
      if (direction) {
        event.preventDefault();
        callbacksRef.current.onMove(direction);
        return;
      }

      if (event.key === "Escape") {
        callbacksRef.current.onEscape();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);
}
