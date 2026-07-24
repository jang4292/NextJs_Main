import type { MoveTarget } from "../../domain/entities/Move";
import type { Suit } from "../../domain/value-objects/Suit";

/**
 * Resolves a drop target from raw pointer coordinates. Drop zones are marked
 * with `data-drop-zone` on their *container* element (a whole tableau column,
 * or a foundation button) rather than on individual cards, so a drop lands
 * correctly even over empty space within a pile, not just exact card bounds.
 */
export function findDropTarget(clientX: number, clientY: number): MoveTarget | null {
  const elements = document.elementsFromPoint(clientX, clientY);

  for (const element of elements) {
    const zoneEl = element.closest<HTMLElement>("[data-drop-zone]");
    if (!zoneEl) continue;

    if (zoneEl.dataset.dropZone === "tableau") {
      const column = Number(zoneEl.dataset.column);
      if (Number.isInteger(column)) return { zone: "tableau", column };
    }

    if (zoneEl.dataset.dropZone === "foundation") {
      const suit = zoneEl.dataset.suit as Suit | undefined;
      if (suit) return { zone: "foundation", suit };
    }
  }

  return null;
}
