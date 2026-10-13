import { TILE_AIR } from '@mander/model';
import { map } from 'lodash-es';
import type { BeartrapSlice } from './slice-beartrap-cells';

export const createBeartrapPatches = ({
  tiles,
  cells,
}: BeartrapSlice): BeartrapPatch => ({
  tiles,
  patches: map(cells, ({ row, column }) => ({ row, column, tile: TILE_AIR })),
});

export interface BeartrapPatch {
  patches: { row: number; column: number; tile: typeof TILE_AIR }[];
  tiles: number[][];
}
