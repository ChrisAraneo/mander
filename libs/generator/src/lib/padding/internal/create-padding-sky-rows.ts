import { match, P } from 'ts-pattern';
import { createAirRows } from './create-air-rows';
import type { PaddingFloor } from './types/padding-floor';
import type { PaddingSky } from './types/padding-sky';

const { nullish } = P;

export const createPaddingSkyRows = ({
  tiles,
  padding,
  floor,
}: PaddingFloor): PaddingSky => ({
  tiles,
  padding,
  floor,
  sky: match(floor)
    .with(nullish, () => [])
    .otherwise((row) => createAirRows(row, padding.sky)),
});
