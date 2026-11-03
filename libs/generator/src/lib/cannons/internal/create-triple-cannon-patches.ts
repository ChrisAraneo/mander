import { TILE_CANNON_TRIPLE } from '@mander/model';
import { map } from 'lodash-es';
import type { Cell } from '../../types/cell';
import type { TilePatch } from '../../types/tile-patch';

export const createTripleCannonPatches = (cells: Cell[]): TilePatch[] =>
  map(cells, ({ row, column }) => ({
    row,
    column,
    tile: TILE_CANNON_TRIPLE,
  }));
