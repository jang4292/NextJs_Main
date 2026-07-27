"use client";

import { useEffect, useRef } from "react";
import type { Direction } from "../../domain/entities/Direction";

const KEY_TO_DIRECTION: Record<string, Direction> = {
  ArrowUp: "UP",
  ArrowDown: "DOWN",
  ArrowLeft: "LEFT",
  ArrowRight: "RIGHT",
  w: "UP",
  W: "UP",
  s: "DOWN",
  S: "DOWN",
  a: "LEFT",
  A: "LEFT",
  d: "RIGHT",
  D: "RIGHT",
};

/** Secondary/assistive input only - touch and mouse remain primary. */
export function useKeyboardInput(onDirection: (direction: Direction) => void) {
  const callbackRef = useRef(onDirection);

  useEffect(() => {
    callbackRef.current = onDirection;
  }, [onDirection]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      const direction = KEY_TO_DIRECTION[event.key];
      if (!direction) return;
      event.preventDefault();
      callbackRef.current(direction);
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);
}
