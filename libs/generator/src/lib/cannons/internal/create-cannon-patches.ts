import { map } from 'lodash-es';
import { computeAverageNeighbourTile } from './compute-average-neighbour-tile';
import type { CannonCells } from './types/cannon-cells';
import type { CannonPatch } from './types/cannon-patch';

export const createCannonPatches = ({
  tiles,
  cells,
}: CannonCells): CannonPatch => ({
  tiles,
  patches: map(cells, ({ row, column }) => ({
    row,
    column,
    tile: computeAverageNeighbourTile(tiles, row, column),
  })),
});
