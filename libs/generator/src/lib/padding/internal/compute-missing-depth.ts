import { match, P } from 'ts-pattern';
import { computeMissingGroundDepth } from './compute-missing-ground-depth';
import type { findLowestFilledRow } from './find-lowest-filled-row';

const { number } = P;

export const computeMissingDepth = ({
  tiles,
  front,
  lowest,
}: ReturnType<typeof findLowestFilledRow>) => ({
  tiles,
  depth: match(lowest)
    .with(number.lt(0), () => 0)
    .otherwise((row) => computeMissingGroundDepth(front, row)),
});
