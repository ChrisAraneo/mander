import { size } from 'lodash-es';
import { match, P } from 'ts-pattern';
import type { findLowestFilledRow } from './find-lowest-filled-row';

const { number } = P;

const GROUND_DEPTH = 4;

export const getMissingDepth = ({
  tiles,
  front,
  lowest,
}: ReturnType<typeof findLowestFilledRow>) => ({
  tiles,
  depth: match(lowest)
    .with(number.lt(0), () => 0)
    .otherwise((row) => Math.max(0, GROUND_DEPTH - (size(front) - 1 - row))),
});
