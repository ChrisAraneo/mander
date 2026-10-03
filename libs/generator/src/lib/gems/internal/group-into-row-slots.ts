import type { Tile } from '@mander/model';
import { VERTICAL_BAND_HEIGHT } from '@mander/structures';
import { ceil, filter, floor, map, range, size } from 'lodash-es';
import { GEMS_PER_STRUCTURE } from '../../consts';
import type { Spot } from '../../types/spot';

const SLOT_HEIGHT = VERTICAL_BAND_HEIGHT / GEMS_PER_STRUCTURE;

export const groupIntoRowSlots = (
  tiles: Tile[][],
  candidates: Spot[],
): Spot[][] =>
  map(range(ceil(size(tiles) / SLOT_HEIGHT)), (slot) =>
    filter(candidates, ({ row }) => floor(row / SLOT_HEIGHT) === slot),
  );
