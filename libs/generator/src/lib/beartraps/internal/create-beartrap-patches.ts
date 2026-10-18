import { TILE_AIR } from '@mander/model';
import { map } from 'lodash-es';
import type { BeartrapPatch } from './types/beartrap-patch';
import type { BeartrapSlice } from './types/beartrap-slice';

export const createBeartrapPatches = ({
  tiles,
  cells,
}: BeartrapSlice): BeartrapPatch => ({
  tiles,
  patches: map(cells, ({ row, column }) => ({ row, column, tile: TILE_AIR })),
});
