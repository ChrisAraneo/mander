import { map } from 'lodash-es';
import { computeAverageNeighbourTile } from './compute-average-neighbour-tile';
import type { FireballCells } from './types/fireball-cells';
import type { FireballPatch } from './types/fireball-patch';

export const createFireballPatches = ({
  tiles,
  cells,
}: FireballCells): FireballPatch => ({
  tiles,
  patches: map(cells, ({ row, column }) => ({
    row,
    column,
    tile: computeAverageNeighbourTile(tiles, row, column),
  })),
});
