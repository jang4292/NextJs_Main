export interface RandomSource {
  pickStopIndex(stripLength: number): number;
}
