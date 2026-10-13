import { match, P } from 'ts-pattern';
import { createAirRows } from './create-air-rows';
import type { getFloorRow } from './get-floor-row';

const { nullish } = P;

export const createSkyRows = ({
  tiles,
  padding,
  floor,
}: ReturnType<typeof getFloorRow>) => ({
  tiles,
  padding,
  floor,
  sky: match(floor)
    .with(nullish, () => [])
    .otherwise((row) => createAirRows(row, padding.sky)),
});
