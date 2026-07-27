const cardElements = new Map<string, HTMLElement>();

export function registerCardEl(cardId: string, el: HTMLElement | null): void {
  if (el) {
    cardElements.set(cardId, el);
  } else {
    cardElements.delete(cardId);
  }
}

export function getCardEl(cardId: string): HTMLElement | undefined {
  return cardElements.get(cardId);
}

export function getCardRect(cardId: string): DOMRect | undefined {
  return cardElements.get(cardId)?.getBoundingClientRect();
}
