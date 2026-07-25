import type { CardLocation } from "../../domain/entities/Move";
import type { Suit } from "../../domain/value-objects/Suit";

/**
 * Resolves a drop location from raw pointer coordinates. Drop zones are
 * marked with `data-drop-zone` on their *container* element (a whole tableau
 * column, a free cell slot, or a foundation slot) so a drop lands correctly
 * over empty space too, not just exact card bounds.
 */
export function findDropLocation(clientX: number, clientY: number): CardLocation | null {
  const elements = document.elementsFromPoint(clientX, clientY);

  for (const element of elements) {
    const zoneEl = element.closest<HTMLElement>("[data-drop-zone]");
    if (!zoneEl) continue;

    if (zoneEl.dataset.dropZone === "tableau") {
      const columnIndex = Number(zoneEl.dataset.columnIndex);
      if (Number.isInteger(columnIndex)) return { type: "tableau", columnIndex, cardIndex: 0 };
    }

    if (zoneEl.dataset.dropZone === "freeCell") {
      const slotIndex = Number(zoneEl.dataset.slotIndex);
      if (Number.isInteger(slotIndex)) return { type: "freeCell", slotIndex };
    }

    if (zoneEl.dataset.dropZone === "foundation") {
      const suit = zoneEl.dataset.suit as Suit | undefined;
      if (suit) return { type: "foundation", suit };
    }
  }

  return null;
}
