export interface Position {
  row: number;
  column: number;
}

export function positionKey(position: Position): string {
  return `${position.row}:${position.column}`;
}
