export function canDrawFromStock(stockSize: number): boolean {
  return stockSize > 0;
}

export function canRecycleWaste(stockSize: number, wasteSize: number): boolean {
  return stockSize === 0 && wasteSize > 0;
}
