import { map } from 'lodash-es';
import { computeAverageNeighbourTile } from './compute-average-neighbour-tile';
import type { FireballPatch } from './types/fireball-patch';
import type { FireballSlice } from './types/fireball-slice';

export const createFireballPatches = ({
  tiles,
  cells,
}: FireballSlice): FireballPatch => ({
  tiles,
  patches: map(cells, ({ row, column }) => ({
    row,
    column,
    tile: computeAverageNeighbourTile(tiles, row, column),
  })),
});
