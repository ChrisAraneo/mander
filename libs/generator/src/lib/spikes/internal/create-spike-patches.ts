import { TILE_AIR } from '@mander/model';
import { map } from 'lodash-es';
import type { SpikePatch } from './types/spike-patch';
import type { SpikeSlice } from './types/spike-slice';

export const createSpikePatches = ({
  tiles,
  cells,
}: SpikeSlice): SpikePatch => ({
  tiles,
  patches: map(cells, ({ row, column }) => ({ row, column, tile: TILE_AIR })),
});
