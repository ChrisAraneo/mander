import { pipe } from 'remeda';
import type { Random } from '../types/random';
import { nextMulberry32Float } from './next-mulberry32-float';
import type { Mulberry32Cell } from './types/mulberry32-cell';

export const createMulberry32 = (seed: number): Random =>
  pipe(
    seed,
    Math.trunc,
    (state): Mulberry32Cell => ({ state }),
    (cell) => (): number => nextMulberry32Float(cell),
  );
