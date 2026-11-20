import { TILE_CANNON_TRIPLE } from '@mander/model';
import { map } from 'lodash-es';
import type { CannonPatch } from './types/cannon-patch';
import type { CannonSlice } from './types/cannon-slice';

export const createTripleCannonPatches = ({
  tiles,
  cells,
}: CannonSlice): CannonPatch => ({
  tiles,
  patches: map(cells, ({ row, column }) => ({
    row,
    column,
    tile: TILE_CANNON_TRIPLE,
  })),
});
