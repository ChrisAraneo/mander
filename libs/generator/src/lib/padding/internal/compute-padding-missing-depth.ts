import { match, P } from 'ts-pattern';
import { computeMissingGroundDepth } from './compute-missing-ground-depth';
import type { PaddingDepth } from './types/padding-depth';
import type { PaddingLowestRow } from './types/padding-lowest-row';

const { number } = P;

const FIRST_ROW_INDEX = 0;

export const computePaddingMissingDepth = ({
  tiles,
  front,
  lowest,
}: PaddingLowestRow): PaddingDepth => ({
  tiles,
  depth: match(lowest)
    .with(number.lt(FIRST_ROW_INDEX), () => 0)
    .otherwise((row) => computeMissingGroundDepth(front, row)),
});
