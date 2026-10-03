import { map } from 'lodash-es';
import { computeAverageNeighbourTile } from './compute-average-neighbour-tile';
import type { findCannonCells } from './find-cannon-cells';

export const createCannonPatches = ({
  tiles,
  cells,
}: ReturnType<typeof findCannonCells>) => ({
  tiles,
  patches: map(cells, ({ row, column }) => ({
    row,
    column,
    tile: computeAverageNeighbourTile(tiles, row, column),
  })),
});
