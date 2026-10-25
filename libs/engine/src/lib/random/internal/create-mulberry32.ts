import { pipe } from 'remeda';
import { nextMulberry32Float } from './next-mulberry32-float';
import type { Mulberry32Cell } from './types/mulberry32-cell';

export const createMulberry32 = (seed: number): (() => number) =>
  pipe(
    seed,
    Math.trunc,
    (state): Mulberry32Cell => ({ state }),
    (cell) => (): number => nextMulberry32Float(cell),
  );
