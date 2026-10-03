import type { Tile } from '@mander/model';
import { STRUCTURE_WIDTH } from '@mander/structures';
import { ceil, filter, floor, map, range, size, sortBy } from 'lodash-es';
import { GEMS_PER_STRUCTURE } from '../../consts';
import type { Spot } from '../../types/spot';

const SLOT_WIDTH = STRUCTURE_WIDTH / GEMS_PER_STRUCTURE;

export const groupIntoColumnSlots = (
  tiles: Tile[][],
  candidates: Spot[],
): Spot[][] =>
  map(range(ceil(size(tiles[0] ?? []) / SLOT_WIDTH)), (slot) =>
    sortBy(
      filter(candidates, ({ column }) => floor(column / SLOT_WIDTH) === slot),
      'column',
    ),
  );
