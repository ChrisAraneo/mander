export interface Rng {
  next(): number;
  int(min: number, max: number): number;
  chance(probability: number): boolean;
  pick<Value>(values: readonly Value[]): Value;
}
