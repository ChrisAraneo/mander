import { type Tile } from '@mander/model';
import { indexOf, size } from 'lodash-es';
import { pipe } from 'remeda';
import { match } from 'ts-pattern';
import type { Spot } from '../../types/spot';

const PREFERRED_PORTAL_OFFSETS = [1, 2, 3, 0];

const NOT_FOUND = -1;

export const findOffsetPriority = (tiles: Tile[][], { column }: Spot): number =>
  pipe(
    tiles[0],
    size,
    (width) => width - 1 - column,
    (offset) =>
      match(indexOf(PREFERRED_PORTAL_OFFSETS, offset))
        .with(NOT_FOUND, () => offset)
        .otherwise((priority) => priority),
  );
