"use client";

import { useEffect, useRef } from "react";

interface ArithmeticKeyboardCallbacks {
  enabled: boolean;
  onDigit: (digit: number) => void;
  onDelete: () => void;
  onSubmit: () => void;
}

export function useArithmeticKeyboardInput(
  callbacks: ArithmeticKeyboardCallbacks,
) {
  const callbacksRef = useRef(callbacks);

  useEffect(() => {
    callbacksRef.current = callbacks;
  });

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      const currentCallbacks = callbacksRef.current;

      if (!currentCallbacks.enabled || isEditableTarget(event.target)) return;
      if (event.ctrlKey || event.metaKey || event.altKey) return;

      if (/^[0-9]$/.test(event.key)) {
        event.preventDefault();
        currentCallbacks.onDigit(Number(event.key));
        return;
      }

      if (event.key === "Backspace" || event.key === "Delete") {
        event.preventDefault();
        currentCallbacks.onDelete();
        return;
      }

      if (event.key === "Enter") {
        event.preventDefault();
        currentCallbacks.onSubmit();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);
}

function isEditableTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;

  const tagName = target.tagName.toLowerCase();
  return (
    tagName === "input" ||
    tagName === "textarea" ||
    tagName === "select" ||
    target.isContentEditable
  );
}

