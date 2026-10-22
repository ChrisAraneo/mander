import { map } from 'lodash-es';
import { computeAverageNeighbourTile } from './compute-average-neighbour-tile';
import type { CannonPatch } from './types/cannon-patch';
import type { CannonSlice } from './types/cannon-slice';

export const createCannonPatches = ({
  tiles,
  cells,
}: CannonSlice): CannonPatch => ({
  tiles,
  patches: map(cells, ({ row, column }) => ({
    row,
    column,
    tile: computeAverageNeighbourTile(tiles, row, column),
  })),
});
