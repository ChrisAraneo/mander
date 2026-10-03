import { TILE_AIR } from '@mander/model';
import { map } from 'lodash-es';
import type { pickBeartrapCells } from './pick-beartrap-cells';

export const createBeartrapPatches = ({
  tiles,
  cells,
}: ReturnType<typeof pickBeartrapCells>) => ({
  tiles,
  patches: map(cells, ({ row, column }) => ({ row, column, tile: TILE_AIR })),
});
