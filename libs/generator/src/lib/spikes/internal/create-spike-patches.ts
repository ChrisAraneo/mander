import { TILE_AIR } from '@mander/model';
import { map } from 'lodash-es';
import type { sliceSpikeCells } from './slice-spike-cells';

export const createSpikePatches = ({
  tiles,
  cells,
}: ReturnType<typeof sliceSpikeCells>) => ({
  tiles,
  patches: map(cells, ({ row, column }) => ({ row, column, tile: TILE_AIR })),
});
