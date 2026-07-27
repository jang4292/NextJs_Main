export interface FlyOptions {
  durationMs: number;
  easing?: string;
}

/**
 * Animates `el` from an offset (dx, dy) back to its natural (0, 0) position.
 * Used both for FLIP (delta between old/new layout position) and for the
 * drag ghost's snap/return animations (delta between pointer position and target).
 */
export function flyElement(
  el: HTMLElement,
  dx: number,
  dy: number,
  opts: FlyOptions,
): Animation {
  return el.animate(
    [
      { transform: `translate(${dx}px, ${dy}px)` },
      { transform: "translate(0px, 0px)" },
    ],
    {
      duration: opts.durationMs,
      easing: opts.easing ?? "ease-out",
      fill: "forwards",
    },
  );
}
