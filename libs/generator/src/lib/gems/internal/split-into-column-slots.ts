import type { Tile } from '@mander/model';
import { ceil, filter, floor, map, range, size, sortBy } from 'lodash-es';
import { SLOT_WIDTH } from '../../consts';
import type { Spot } from '../../types/spot';

export const splitIntoColumnSlots = (
  tiles: Tile[][],
  candidates: Spot[],
): Spot[][] =>
  map(range(ceil(size(tiles[0] ?? []) / SLOT_WIDTH)), (slotIndex) =>
    sortBy(
      filter(
        candidates,
        ({ column }) => floor(column / SLOT_WIDTH) === slotIndex,
      ),
      'column',
    ),
  );
