import { TILE_AIR } from '@mander/model';
import { map } from 'lodash-es';
import type { pickSpikeCells } from './pick-spike-cells';

export const createSpikePatches = ({
  tiles,
  cells,
}: ReturnType<typeof pickSpikeCells>) => ({
  tiles,
  patches: map(cells, ({ row, column }) => ({ row, column, tile: TILE_AIR })),
});
