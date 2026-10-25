import type { Random } from '@mander/engine';
import { type Tile } from '@mander/model';
import { map, size, sortBy, times } from 'lodash-es';
import { pipe } from 'remeda';
import type { Spot } from '../../types/spot';

export const sortByColumnRandomly = (
  tiles: Tile[][],
  slots: Spot[][],
  random: Random,
): Spot[][] =>
  pipe(
    tiles[0] ?? [],
    size,
    (width) => times(width, () => random()),
    (rolls) =>
      map(slots, (slot) => sortBy(slot, ({ column }) => rolls[column])),
  );
