"use client";

import { useEffect, useRef } from "react";

export function useGameLoop({
  enabled,
  onTick,
}: {
  enabled: boolean;
  onTick: (timestamp: number, deltaMs: number) => void;
}) {
  const onTickRef = useRef(onTick);

  useEffect(() => {
    onTickRef.current = onTick;
  });

  useEffect(() => {
    if (!enabled) return;

    let animationFrameId = 0;
    let previousTimestamp: number | null = null;

    function tick(timestamp: number) {
      const deltaMs =
        previousTimestamp === null ? 0 : timestamp - previousTimestamp;
      previousTimestamp = timestamp;
      onTickRef.current(timestamp, deltaMs);
      animationFrameId = window.requestAnimationFrame(tick);
    }

    animationFrameId = window.requestAnimationFrame(tick);

    return () => window.cancelAnimationFrame(animationFrameId);
  }, [enabled]);
}
