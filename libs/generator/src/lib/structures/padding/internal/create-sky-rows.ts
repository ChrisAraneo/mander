import { TILE_AIR } from '@mander/model';
import { size, times } from 'lodash-es';
import { match, P } from 'ts-pattern';
import type { findFloorRow } from './find-floor-row';

const { nullish } = P;

export const createSkyRows = ({
  tiles,
  padding,
  floor,
}: ReturnType<typeof findFloorRow>) => ({
  tiles,
  padding,
  floor,
  sky: match(floor)
    .with(nullish, () => [])
    .otherwise((row) =>
      times(padding.sky, () => times(size(row), () => TILE_AIR)),
    ),
});
